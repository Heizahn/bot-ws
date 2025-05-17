import { Bot } from '../interfaces/interface';
import { idRegex } from '../regex';

export default async function resBotId(client: Bot['client'], message: string, from: string) {
	if (!idRegex(message)) {
		return client.sendText(from, `I don't know XD\nExample:\nid 12345678`);
	}

	const id = message.split(' ')[1];

	const res = await fetch(`${process.env.API_URL}/clients/bot/search/${id}`);

	const data = await res.json();

	let smsRes = '';

	if (data.length === 0) {
		smsRes = `Cliente no encontrado`;
	} else {
		for (const client of data) {
			smsRes += `${client.sName}\n\n`;

			for (const debt of client.debts) {
				smsRes += `${debt.sReason} -${debt.currentBalance}\n`;
			}

			smsRes += `Total: ${client.totalToPay}\n\n`;
		}
	}

	return client.sendText(from, smsRes.trim());
}
