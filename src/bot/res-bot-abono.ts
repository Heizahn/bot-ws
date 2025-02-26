import { Message } from '@wppconnect-team/wppconnect';
import { Bot } from '../interfaces/interface';
import { abonoRegex } from '../regex';

export default async function resBotAbono(
	sms: string,
	client: Bot['client'],
	message: Message,
	pagoMovil: string,
) {
	const monto = abonoRegex(sms);

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
