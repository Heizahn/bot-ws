import fs from "fs";
import generatePdf from "../generatePdf/generatePdf";
import db from "../config/db";
import { Invoice } from "../entities/invoice";
import { Request, Response } from "express";
import { Bot } from "../interfaces/interface";
import { formatPhoneNumber } from "../utils/functions";

export default async function sendPdf(
    req: Request,
    res: Response,
    client: Bot["client"]
) {
    try {
        const { tlf, referencia, ...data } = req.body;

        if (!referencia) {
            return res
                .status(400)
                .json({ error: "Campo referencia es requerido" });
        }

        const invoiceRepository = db.getRepository(Invoice);

        let invoice = await invoiceRepository.findOneBy({
            reference: referencia,
        });

        while (!invoice || invoice.id === undefined) {
            await invoiceRepository.save({ reference: referencia });

            invoice = await invoiceRepository.findOneBy({
                reference: referencia,
            });
        }

        let numInvoice = String(invoice.id);

        while (numInvoice.length < 5) {
            numInvoice = "0" + numInvoice;
        }

        // Resto del código para generar y enviar PDF...
        const pathPdf = await generatePdf({
            ...data,
            numero: numInvoice,
            identificacion: data.identificacion || "N/A",
            fecha: data.fecha,
        });

        // Enviar archivo con validación
        if (!fs.existsSync(pathPdf)) {
            throw new Error("El archivo PDF no se generó correctamente");
        }

        const formattedPhoneNumber = formatPhoneNumber(tlf);
        await client.sendFile(formattedPhoneNumber, pathPdf);

        fs.unlinkSync(pathPdf);

        res.status(200).json({
            success: true,
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ error: "La referencia ya existe" });
        }
        console.error("Error:", error);
        res.status(500).json({ error: error.message });
    }
}
