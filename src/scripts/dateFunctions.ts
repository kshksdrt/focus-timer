export function getDaysAgo(numberOfDays = 0) {
	const temp = new Date()
	temp.setDate(temp.getDate() - numberOfDays)
	return new Date(temp)
}

export function getDaysAgoISO(numberOfDays = 0) {
	return getDaysAgo(numberOfDays).toISOString();
}
