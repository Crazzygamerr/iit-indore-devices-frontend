import { supabase } from "./supabaseClient";

export function getTimeString(date: string): String {
	return new Date('1970-01-01T' + date + 'Z')
		.toLocaleTimeString('en-US',
			{ timeZone: 'UTC', hour12: true, hour: 'numeric', minute: 'numeric' }
		);
}

export function getDateString(
	date: string,
	isUSformat: boolean = false,
	addDays = 0 
): String {
	// Supabase/postgres date equates only to the US format
	const temp_date = new Date(date);
	temp_date.setDate(temp_date.getDate() + addDays);
	
	return temp_date.toLocaleDateString(
		isUSformat ? 'en-US' : 'en-GB',
		{ day: 'numeric', month: 'numeric', year: 'numeric' }
	);
}

export async function checkIfEmailExists(email: string):Promise<boolean> {
	const { data, error } = await supabase.rpc('does_email_exist', {
		email_param: email,
	});

	return (data as any) as boolean;
}