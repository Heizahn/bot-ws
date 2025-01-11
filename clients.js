module.exports = {
	clients: async () => {
		const res = await fetch('http://172.17.0.54:80/clients-for-bot');
		const data = await res.json();
		return data;
	},
};
