import { Bot, ClientDB } from '../interfaces/interface';

const bnc = 'Banco: BNC\nTelefono: 04122354797\nRif: J411898147';
const caribe = 'Banco: Bancaribe\nTelefono: 04122354797\nRif: J411898147';
const humberto = 'Banco: Banesco\nTelefono: 04144271554\nCedula: 27605298';

export default async function resBotDatos(
	client: Bot['client'],
	from: string,
	clientDB: ClientDB[],
) {
	//enviar mensaje de bnc solo a los clientes que su owner sea 1 o 3
	const ownerBnc = clientDB.filter((c) => c.owner === 1 || c.owner === 3);

	const ownerCaribe = clientDB.filter(
		(c) => c.owner === 4 || c.owner === 5 || c.owner === 6,
	);

	const ownerHumberto = clientDB.filter((c) => c.owner === 7);

	if (ownerBnc.length > 0) {
		return client.sendText(from, bnc);
	}

	if (ownerCaribe.length > 0) {
		return client.sendText(from, caribe);
	}

	if (ownerHumberto.length > 0) {
		return client.sendText(from, humberto);
	}
}
