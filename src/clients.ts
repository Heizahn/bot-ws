import 'dotenv/config';

export default async function clients() {
	const host = process.env.API_URL;
	if (!host) {
		throw new Error('No se ha definido el host de los clientes');
	}

	const res = await fetch(`${host}/clients/bot`);

	const data = await res.json();

	return data;
}
