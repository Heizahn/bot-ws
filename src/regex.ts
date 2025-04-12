export const saldoRegex = (sms: string) => {
	const regex = /^\s*s[aáAÁ]ld[oóOÓ]\s*$/i;

	return regex.test(sms);
};

export const datosRegex = (sms: string) => {
	const regex = /^\s*d[aáAÁ]t[oóOÓ]s\s*$/i;

	return regex.test(sms);
};

export const abonoRegex = (sms: string) => {
	const regexAbono = /^\s*[aáAÁ]b[oóOÓ]n[oóOÓ]\s*(-?\d+)?\s*$/i;
	const match = sms.match(regexAbono);

	if (match) {
		return match[1] ? Number(match[1]) : null;
	}

	return null;
};
