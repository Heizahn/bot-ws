export const saldoRegex = (sms: string) => {
	const regex = /^\s*saldo\s*$/i;

	return regex.test(sms);
};

export const datosRegex = (sms: string) => {
	const regex = /^\s*datos\s*$/i;

	return regex.test(sms);
};

export const abonoRegex = (sms: string) => {
	const regexAbono = /^\s*abono\s*(-?\d+)?\s*$/i;
	const match = sms.match(regexAbono);

	if (match) {
		return match[1] ? Number(match[1]) : null;
	}

	return null;
};
