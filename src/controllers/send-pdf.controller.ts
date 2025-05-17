import { Request, Response } from 'express';
import { Bot } from '../interfaces/interface';
import { formatPhoneNumber } from '../utils/functions';
import fs from 'fs';

export default async function sendPdf(req: Request, res: Response, client: Bot['client']) {
	let pdfPath: string | null = null;

	try {
		const { pdfBase64, fileName, tlf } = req.body;

		// Validación más estricta del base64
		if (!pdfBase64 || typeof pdfBase64 !== 'string' || pdfBase64.trim() === '') {
			throw new Error('El archivo PDF base64 está vacío o es inválido');
		}

		// Verificar que el base64 comienza con el prefijo correcto
		if (!pdfBase64.startsWith('data:application/pdf;base64,')) {
			// Si no tiene el prefijo, lo agregamos
			const base64Data = pdfBase64.startsWith('data:')
				? pdfBase64
				: `data:application/pdf;base64,${pdfBase64}`;

			console.log('Enviando PDF con base64 modificado');
			await client.sendFile(formatPhoneNumber(tlf), base64Data, {
				caption: fileName.trim().toUpperCase(),
				mimetype: 'application/pdf',
			});
		} else {
			console.log('Enviando PDF con base64 original');
			await client.sendFile(formatPhoneNumber(tlf), pdfBase64, {
				caption: fileName.trim().toUpperCase(),
				mimetype: 'application/pdf',
			});
		}

		res.status(200).json({
			success: true,
			message: `PDF Enviado exitosamente`,
		});
	} catch (error) {
		console.error('Error detallado:', error);
		// Limpiar el archivo en caso de error
		if (pdfPath && fs.existsSync(pdfPath)) {
			try {
				fs.unlinkSync(pdfPath);
			} catch (cleanupError) {
				console.error('Error al limpiar el archivo:', cleanupError);
			}
		}
		res.status(500).json({
			error: error instanceof Error ? error.message : 'Error desconocido',
			stack: process.env.NODE_ENV === 'development' ? (error as Error).stack : undefined,
		});
	}
}
