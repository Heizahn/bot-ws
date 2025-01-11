module.exports = {
	clients: async () => {
		const res = await fetch('http://172.17.0.126:3000/clients-for-bot');
		const data = await res.json();
		return data;
	},
};
