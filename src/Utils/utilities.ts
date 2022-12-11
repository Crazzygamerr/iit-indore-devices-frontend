import { supabase } from "./supabaseClient";
import { createContext } from "react";

export function getTimeString(date: string, date2?: string): String {
	var s = new Date('1970-01-01T' + date + 'Z')
		.toLocaleTimeString('en-US',
			{ timeZone: 'UTC', hour12: true, hour: 'numeric', minute: 'numeric' }
	);
	if (date2) {
		s += ' - ' + new Date('1970-01-01T' + date2 + 'Z')
			.toLocaleTimeString('en-US',
				{ timeZone: 'UTC', hour12: true, hour: 'numeric', minute: 'numeric' }
			);
	}
	return s;
}

export function addDaysToDate(date: string, days: number): Date {
	const temp_date = new Date(date);
	temp_date.setDate(temp_date.getDate() + days);
	return temp_date;
}

export function getDateString(
	date: string,
	isUSformat: boolean = false,
	addDays = 0 
): String {
	
	const temp_date = addDaysToDate(date, addDays);
	// Supabase/postgres date equates only to the US format
	var date_string = temp_date.toLocaleDateString(
		isUSformat ? 'en-US' : 'en-GB',
		{ day: 'numeric', month: 'numeric', year: 'numeric' }
	);
	
	if (isUSformat) {
		date_string = date_string.replace(/\//g, '-');
		if (date_string.split('-')[1].length === 1) {
			date_string = date_string.replace(/-/, '-0');
		}
		if (date_string.split('-')[0].length === 1) {
			date_string = "0" + date_string;
		}
		date_string = date_string.split('-')[2] + '-' + date_string.split('-')[0] + '-' + date_string.split('-')[1];
	}
	
	return date_string;
}

export function matchSearch(
	text: string,
	search: string
): boolean {
	return text.toLowerCase().includes(search.toLowerCase());
}

export async function checkIfEmailExists(email: string):Promise<boolean> {
	const { data, error } = await supabase.rpc('does_email_exist', {
		email_param: email,
	});

	return (data as any) as boolean;
}

// create context for the user
// export const TableContext = createContext({});