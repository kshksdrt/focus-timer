export function getDay({ days = 0, months = 0 }) {
	const result = Date.today()
		.add({ days, months })
		.toISOString();
	return new Date(result);
}
