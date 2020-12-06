const dayjs = require('dayjs')

export function getDaysAgo(numberOfDays: number) {
	const result = dayjs().subtract(numberOfDays, "day")
		.toISOString();
	return new Date(result);
}
