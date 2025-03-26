import * as nodemailer from "nodemailer";

export default async function sendMail(pdfPath: string, to: string) {
    if (!pdfPath || !to) {
        throw new Error("pdfPath y to son obligatorios");
    }

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
        throw new Error(
            "No se ha definido las variables de entorno del correo electrónico"
        );
    }

    const transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        auth: {
            user: "nathanael.wisoky71@ethereal.email",
            pass: "NjQfJ5C26G7XhW2rtG",
        },
    });

    try {
        const response = await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to,
            subject: "Recibo de Pago",
            attachments: [
                {
                    filename: "Recibo de Pago.pdf",
                    path: pdfPath,
                },
            ],
        });

        console.log("Correo electrónico enviado:", response);
    } catch (error) {
        console.error("Error al enviar el correo electrónico:", error.message);
        throw error;
    }
}
