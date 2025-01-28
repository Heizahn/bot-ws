const wppconnet = require('@wppconnect-team/wppconnect');
const { saldo, datos, abono } = require('./regex');

require('dotenv').config();

const fs = require('fs');
const generatePdf = require('./generatePdf/generatePdf');
// const { Invoice, connectDB } = require('./db');

wppconnet
	.create()
	.then((client) => bot(client))
	.catch(console.error);

const pagoMovil = 'Nuestros Datos\nBanco: BNC\nTelefono: 04122354797\nRif: J411898147';

async function bot(client) {
	const express = require('express');
	const server = express();

	// Middleware para manejar JSON y formularios
	server.use(express.json());
	server.use(express.urlencoded({ extended: true }));

	await client.onMessage(async (message) => {
		const clients = await require('./clients').clients();

		const clientDB = clients.filter(
			(c) => message.from === c.telefonos.replace('0', '58') + '@c.us',
		);

		if (clientDB.length === 0) {
			return;
		}

		const sms = String(message.body).toLowerCase();

		if (saldo(sms)) {
			let res = '';
			let needPM = false;
			const conversionCache = {};

			for (let service of clientDB) {
				const saldo = Number(service.saldo);

				if (saldo > 0) {
					res += `Servicio ${service.nombre}\nPosee un saldo positivo de ${service.saldo}REF\n\n`;
				} else if (saldo === 0) {
					res += `Servicio ${service.nombre}\nActualmente esta solvente\n\n`;
				} else {
					const absSaldo = Math.abs(saldo);

					if (!conversionCache[absSaldo]) {
						let success = false;
						let retries = 3;

						while (!success && retries > 0) {
							try {
								const resFetch = await fetch(
									`http://172.17.0.126:8080/convert?amount=${absSaldo}`,
								);

								const { conversion } = await resFetch.json();

								conversionCache[absSaldo] = conversion;
								success = true;
							} catch (err) {
								retries--;
							}
						}

						if (!success) {
							conversionCache[absSaldo] = 'No disponible';
						}
					}

					const conversion = conversionCache[absSaldo];

					if (conversion === 'No disponible') {
						res += `Servicio ${service.nombre}\nPosee un saldo pendiente de ${absSaldo}REF\nNo pudimos calcular la conversión a Bolívares en este momento. Intente más tarde.\n\n`;
					} else {
						res += `Servicio ${service.nombre}\nPosee un saldo pendiente de ${absSaldo}REF\nEn Bolívares son ${conversion}Bs\n\n`;
						needPM = true;
					}
				}
			}

			if (res.endsWith('\n\n')) {
				if (needPM) {
					res += pagoMovil;
					needPM;
				} else {
					res = res.slice(0, -2);
				}
			}

			client.sendText(message.from, res);
		}

		if (datos(sms)) {
			client.sendText(message.from, pagoMovil);
		}

		if (sms.startsWith('abono')) {
			const monto = abono(sms);

			let res = '';

			if (monto === null) {
				res = `Para abonar, usa el formato: "abono [monto]".\n\nEjemplo: "abono 10"\nSin las comillas`;
			} else if (monto === 0) {
				res = '¿Abonar 0?\nIntenta con un monto mayor a 0.';
			} else if (monto < 0) {
				res = 'No se aceptan abonos negativos, Por favor, ingrese un monto valido';
			} else {
				const resCon = await fetch(`http://172.17.0.126:8080/convert?amount=${monto}`);

				const { conversion } = await resCon.json();

				res = `El monto ${monto} a pagar en bolivares son: ${conversion}Bs\n\n${pagoMovil}`;
			}

			client.sendText(message.from, res);
		}
	});

	server.post('/send-pdf', async (req, res) => {
		try {
			const { tlf, referencia, ...data } = req.body;

			if (!referencia) {
				return res.status(400).json({ error: 'Campo referencia es requerido' });
			}

			// Resto del código para generar y enviar PDF...
			const pathPdf = await generatePdf({
				...data,
				numero: referencia.slice(0, 5),
				identificacion: data.identificacion || 'N/A',
				fecha: data.fecha,
			});

			// Enviar archivo con validación
			if (!fs.existsSync(pathPdf)) {
				throw new Error('El archivo PDF no se generó correctamente');
			}

			await client.sendFile(
				`${tlf.replace('0', '58')}@c.us`,
				pathPdf,
				`Recibo de Pago ${data.identificacion} ${data.fecha.replace(/\//g, '-')}.pdf`,
				'Recibo de pago',
			);

			res.status(200).json({
				success: true,
			});
		} catch (error) {
			if (error.code === 11000) {
				return res.status(400).json({ error: 'La referencia ya existe' });
			}
			console.error('Error:', error);
			res.status(500).json({ error: error.message });
		}
	});

	console.log('Conectado a la base de datos');
	server.listen(process.env.PORT, () => {
		console.log('Servidor iniciado');
	});
}
