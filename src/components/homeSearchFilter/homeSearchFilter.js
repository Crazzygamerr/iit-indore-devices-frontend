import TextField from '@mui/material/TextField';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import React from "react";

import './homeSearchFilter.css';

export default function HomeSearchFilter({
	date,
	setDate,
	searchForToday,
	setSearchForToday,
}) {


	return (
		<div
			className="HomeSearchFilter__mainDiv">
			<div style={{
				whiteSpace: 'nowrap',
				float: 'left',
			}}>
				{"Slots for: "}
				<button
					className={`joined-button-left
						${!searchForToday ? "joined-button--inactive" : ""}
					`}
					onClick={() => {
						setSearchForToday(true);
					}}>Today</button>
				<button
					className={`joined-button-right
						${searchForToday ? "joined-button--inactive" : ""}
					`}
					onClick={() => {
						setSearchForToday(false);
					}}>Next 5 days</button>
			</div>

			<div style={{
				float: 'left',
			}}>
				<LocalizationProvider dateAdapter={AdapterDateFns}>
					<DatePicker
						value={date}
						label="Date"
						inputFormat="dd/MM/yyyy"
						onChange={(newValue) => {
							setDate(newValue);
						}}
						renderInput={(params) => <TextField sx={{ width: "175px", }} size="small" {...params} />}
					/>
				</LocalizationProvider>
			</div>
		</div>
	);

}