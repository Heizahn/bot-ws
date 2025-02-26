import 'dotenv/config';
import db from './config/db';
import * as wppconnect from '@wppconnect-team/wppconnect';
import { bot } from './bot/bot';
import Routes from './router/router';

async function start() {
	const server = (await import('./config/server')).default;

	try {
		const client = await wppconnect.create({
			session: 'session',
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
}

db.initialize()
	.then(() => {
		start();
	})
	.catch((err) => {
		console.error('Error al iniciar la base de datos');
		console.error(err);
	});
