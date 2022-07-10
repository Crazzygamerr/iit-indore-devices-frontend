
export function getTimeString(date) {
	return new Date('1970-01-01T' + date + 'Z')
		.toLocaleTimeString('en-US',
			{ timeZone: 'UTC', hour12: true, hour: 'numeric', minute: 'numeric' }
		);
}

export function getDateString(date, isUSformat = false) {
	// Supabase/postgres date equates only to the US format
	return new Date(date)
		.toLocaleDateString(isUSformat ? 'en-US' : 'en-GB',
			{ day: 'numeric', month: 'numeric', year: 'numeric' }
		);
}