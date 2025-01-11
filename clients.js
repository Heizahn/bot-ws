module.exports = {
	clients: async () => {
		const res = await fetch('http://172.17.0.126:8010/clients-for-bot');
		const data = await res.json();
		return data;
	},
};
