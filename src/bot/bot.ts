import 'dotenv/config';
import { Bot, ClientDB } from '../interfaces/interface';
import { saldoRegex, datosRegex } from '../regex';

const pagoMovil = 'Nuestros Datos\nBanco: BNC\nTelefono: 04122354797\nRif: J411898147';

export async function bot(client: Bot['client']) {
	client.onMessage(async (message) => {
		console.log(message.from);
		const clients = (await import('../clients')).default();

		const clientDB = (await clients).filter((c: ClientDB) => {
			if (c.telefonos.startsWith('0')) {
				return message.from === c.telefonos.replace('0', '58') + '@c.us';
			} else {
				return message.from === c.telefonos + '@c.us';
			}
		});

		if (clientDB.length === 0) {
			return;
		}

		const sms = String(message.body).toLowerCase();

		if (saldoRegex(sms)) {
			(await import('../bot/res-bot-saldo')).default(
				client,
				message,
				clientDB,
				pagoMovil,
			);
		}

		if (datosRegex(sms)) {
			client.sendText(message.from, pagoMovil);
		}

		if (sms.startsWith('abono')) {
			(await import('../bot/res-bot-abono')).default(sms, client, message, pagoMovil);
		}
	});
}
