import 'dotenv/config';
import * as wppconnect from '@wppconnect-team/wppconnect';
import { bot } from './bot/bot';
import Routes from './router/router';

const server = (await import('./config/server')).default;

try {
	const client = await wppconnect.create({
		session: 'session',
		puppeteerOptions: {
			headless: 'shell',
		},
	});

	bot(client);

	server.use('/', Routes(client));

	server.listen(Number(process.env.PORT), () => {
		console.log('Servidor iniciado en http://localhost:' + process.env.PORT);
	});
} catch (error) {
	console.error('Error al iniciar la sesión de WhatsApp');
	console.error(error);
}
