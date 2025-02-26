import { Router, Request, Response } from 'express';
import { Bot } from '../interfaces/interface';
import sendPdf from '../controllers/send-pdf.controller';

export default function Routes(client: Bot['client']): Router {
	const router = Router();

	router.post('/send-pdf', (req: Request, res: Response) => {
		sendPdf(req, res, client);
	});

	return router;
}
