import { Message } from '@wppconnect-team/wppconnect';
import { Bot, ClientDB } from '../interfaces/interface';

export default async function resSaldo(
	client: Bot['client'],
	message: Message,
	clientDB: ClientDB[],
) {
	let res = '';
	let needPM = false;
	const conversionCache: Record<number, string | number> = {};
	let total = 0;
	let control = 0;

	for (let service of clientDB) {
		const saldo = Number(service.nBalance);

		if (saldo > 0) {
			res += `Servicio ${service.sName}\nPosee un saldo positivo de ${service.nBalance}REF\n\n`;
		} else if (saldo === 0) {
			res += `Servicio ${service.sName}\nActualmente esta solvente\n\n`;
		} else {
			const absSaldo = Math.abs(saldo);

			if (!conversionCache[absSaldo]) {
				let success = false;
				let retries = 3;

				while (!success && retries > 0) {
					try {
						const resFetch = await fetch(
							`${process.env.API_BCV}/convert?amount=${absSaldo}`,
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
				res += `Servicio ${service.sName}\nPosee un saldo pendiente de ${absSaldo}REF\nNo pudimos calcular la conversión a Bolívares en este momento. Intente más tarde.\n\n`;
			} else {
				res += `Servicio ${service.sName}\nPosee un saldo pendiente de ${absSaldo}REF\nBolívares: ${conversion}Bs\n\n`;
				total += Number(conversion);
				control++;
				needPM = true;
			}
		}
	}

	if (res.endsWith('\n\n')) {
		if (needPM) {
			res += `${
				clientDB.length > 1 && control > 1 ? `Total: ${total.toFixed(2)}Bs\n\n` : ''
			}`;
			needPM;
		} else {
			res = res.slice(0, -2);
		}
	}

	client.sendText(message.from, res);
}
