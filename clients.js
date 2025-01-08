module.exports = {
	clients: async () => {
		const res = await fetch('http://localhost:3000/clients-for-bot');
		const data = await res.json();
		return data;
	},
};
