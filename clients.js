require('dotenv').config();
module.exports = {
	clients: async () => {
		const host = process.env.HOST_CLIENT;
		const hostG = process.env.HOST_CLIENT_G;
		if (!host || !hostG) {
			throw new Error('No se ha definido el host de los clientes');
		}

		const [resOne, resTwo] = Promise.all([
			fetch(`${host}/clients-for-bot`),
			fetch(`${hostG}/clients-for-bot`),
		]);

		const dataOne = await resOne.json();
		const dataTwo = await resTwo.json();
		return [...dataOne, ...dataTwo];
	},
};
