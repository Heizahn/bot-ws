import { Request, Response } from 'express';
import { Bot } from '../interfaces/interface';
import { formatPhoneNumber } from '../utils/functions';

export default async function sendText(req: Request, res: Response, client: Bot['client']) {
	const { tlf, body } = req.body;

	if (!tlf || !body) {
		return res.status(400).json({ error: 'Faltan datos' });
	}

	try {
		const formattedPhoneNumber = formatPhoneNumber(tlf);

		await client.sendText(formattedPhoneNumber, body);

		res.status(200).json({ success: true });
	} catch (error) {
		if (error instanceof Error) {
			console.error('Error al enviar el texto:', error.message);
			res.status(500).json({ error: error.message });
		} else {
			console.error('Error al enviar el texto:', error);
			res.status(500).json({ error: 'Error desconocido' });
		}
	}
}
