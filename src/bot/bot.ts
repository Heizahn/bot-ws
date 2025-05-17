import 'dotenv/config';
import { Bot, ClientDB } from '../interfaces/interface';
import { saldoRegex, datosRegex, isOscar } from '../regex';
import { formatPhoneNumber } from '../utils/functions';

export async function bot(client: Bot['client']) {
	client.onMessage(async (message) => {
		const sms = String(message.body).toLowerCase().trim();
		if (sms.startsWith('id') && isOscar(message.from.replace('@c.us', ''))) {
			return (await import('../bot/res-bot-id')).default(client, sms, message.from);
		}

		const clients = (await import('../clients')).default();

		const clientDB = (await clients).filter((c: ClientDB) => {
			return formatPhoneNumber(c.sPhone) === message.from;
		});

		if (clientDB.length === 0) {
			return;
		}

		if (saldoRegex(sms)) {
			(await import('../bot/res-bot-saldo')).default(client, message, clientDB);
		}

		if (datosRegex(sms)) {
			(await import('../bot/res-bot-datos')).default(client, message.from, clientDB);
		}

		if (sms.startsWith('abono')) {
			(await import('../bot/res-bot-abono')).default(sms, client, message);
		}
	});
}
