
export function getTimeString(date) {
	return new Date('1970-01-01T' + date + 'Z')
		.toLocaleTimeString('en-US',
			{ timeZone: 'UTC', hour12: true, hour: 'numeric', minute: 'numeric' }
		);
}

export function getDateString(date) {
	return new Date(date)
		.toLocaleDateString('en-US',
			{ day: 'numeric', month: 'numeric', year: 'numeric' }
		);
}