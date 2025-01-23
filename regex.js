module.exports = {
	saldo: (sms) => {
		const regex = /^\s*saldo\s*$/i;

		return regex.test(sms);
	},

	datos: (sms) => {
		const regex = /^\s*datos\s*$/i;

		return regex.test(sms);
	},

	abono: (sms) => {
		const regexAbono = /^\s*abono\s*(-?\d+)?\s*$/i;
		const match = sms.match(regexAbono);

		if (match) {
			return match[1] ? Number(match[1]) : null;
		}

		return null;
	},
};
