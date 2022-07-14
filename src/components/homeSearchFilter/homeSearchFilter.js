import React from "react";
import TextField from '@mui/material/TextField';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import './homeSearchFilter.css';

export default function HomeSearchFilter({
	date,
	setDate,
	searchByEquipment,
	setSearchByEquipment,
}) {
	
	
	return (
		<div
			className="HomeSearchFilter__mainDiv">
			<div style={{
				whiteSpace: 'nowrap',
				float: 'left',
			}}>
				{"Sort By: "}
				<button
					className={`joined-button-left
						${!searchByEquipment ? "joined-button--inactive" : ""}
					`}
					onClick={() => {
						setSearchByEquipment(true);
					}}>Equipment</button>
				<button
					className={`joined-button-right
						${searchByEquipment ? "joined-button--inactive" : ""}
					`}
					onClick={() => {
						setSearchByEquipment(false);
					}}>Devices</button>
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
						renderInput={(params) => <TextField sx={{width: "175px",}} size="small" {...params} />}
					/>
				</LocalizationProvider>
			</div>
		</div>
	);
	
}