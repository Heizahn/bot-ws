const wppconnet = require('@wppconnect-team/wppconnect');

wppconnet
	.create()
	.then((client) => bot(client))
	.catch(console.error);

const pagoMovil = 'Nuestros Datos\nBanco: BNC\nTelefono: 04122354797\nRif: J411898147';

async function bot(client) {
	await client.onMessage(async (message) => {
		const clients = await require('./clients').clients();

		const clientDB = clients.filter(
			(c) => message.from === c.telefonos.replace('0', '58') + '@c.us',
		)[0];

		if (!clientDB) {
			return;
		}

		if (message.from === clientDB.telefonos.replace('0', '58') + '@c.us') {
			const sms = String(message.body).toLowerCase();

			if (sms === '/saldo') {
				if (Number(clientDB.saldo) == 0) {
					client.sendText(
						message.from,
						`${clientDB.nombre} su servicio se encuentra solvente`,
					);
				} else if (Number(clientDB.saldo) > 0) {
					client.sendText(
						message.from,
						`${clientDB.nombre} posee un saldo positivo de ${clientDB.saldo} REF`,
					);
				} else {
					const res = await fetch(
						`http://172.17.0.126:8080/convert?amount=${clientDB.saldo}`,
					);
					const { conversion } = await res.json();

					client.sendText(
						message.from,
						`${clientDB.nombre} tiene un saldo pendiente de ${clientDB.saldo}\nSu deuda en Bs seria ${conversion}Bs\n\n${pagoMovil}`,
					);
				}
			}

			if (sms.includes('/importe')) {
				const abono = sms.split(' ')[sms.split(' ').length - 1];

				if (abono === '/importe') {
					client.sendText(message.from, 'El formato es "/importe <cantidad>"');
				} else {
					if (abono <= 0) {
						client.sendText(
							message.from,
							'El monto no puede ser negativo o CERO, por favor intente nuevamente',
						);
					} else {
						const res = await fetch(
							`http://172.17.0.126:8080/convert?amount=${abono}`,
						);
						const { conversion } = await res.json();
						client.sendText(
							message.from,
							`${clientDB.nombre} el monto a pagar es: ${conversion} Bs\n\n${pagoMovil}\n`,
						);
					}
				}
			}

			if (sms === '/datos') {
				client.sendText(message.from, pagoMovil);
			}
		}
	});
}
