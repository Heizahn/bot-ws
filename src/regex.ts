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

export const isOscar = (tlf: string) => {
	const tlfOscar = process.env.TLF_OSCAR;

	if (!tlfOscar) {
		throw new Error('TLF_OSCAR no está definido');
	}

	return tlf === tlfOscar;
};

export const idRegex = (sms: string) => {
	// Valida "id" seguido de 8 dígitos o una cédula venezolana (solo números)
	const regex = /^\s*(?:id\s+\d{8}|[Vv]?\d{7,8})\s*$/i;

	return regex.test(sms);
};
