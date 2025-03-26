const fs = require("fs");
const Handlebars = require("handlebars");
const puppeteer = require("puppeteer");
const path = require("path");

module.exports = async function generatePdf(data) {
    const templatePath = path.resolve(__dirname, "./invoice-template.html");
    const template = fs.readFileSync(templatePath, "utf8");

    // Compilar la plantilla
    const compiled = Handlebars.compile(template);

    // Cálculos de montos
    let subtotal = 0;

    for (const producto of data.productos) {
        subtotal += Number(producto.monto);
    }

    const iva = subtotal * 0.16;
    const total = subtotal + iva;

    // Generar HTML
    const html = compiled({
        ...data,
        productos: data.productos.map((p) => ({
            ...p,
            motivo: p.useUsd ? `${p.motivo} ${p.montoRef}(REF)` : p.motivo,
        })),
        subtotal: subtotal.toFixed(2),
        iva: iva.toFixed(2),
        total: total.toFixed(2),
    });

    // Generar PDF
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    try {
        const filename = `Recibo de Pago ${
            data.identificacion
        } ${data.fecha.replace(/\//g, "-")}.pdf`;

        const filePath = path.resolve(__dirname, filename);
        await page.setContent(html, { waitUntil: "networkidle0" });

        await page.pdf({
            path: filePath,
            format: "A4",
            printBackground: true,
            margin: {
                top: "0.5in",
                right: "0.5in",
                bottom: "0.5in",
                left: "0.5in",
            },
        });

        return filePath;
    } finally {
        await browser.close();
    }
};
