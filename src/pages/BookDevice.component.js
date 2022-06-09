import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../Auth";
import { supabase } from "../supabaseClient";

import { TextField, Button } from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

export default function BookDevice() {
	const { user } = useAuth();
	const { id } = useParams();
	const [device, setDevice] = React.useState(null);
	const [date, setDate] = React.useState(Date.now());
	
	const book = () => {
		const slots = device.slots || [];
		slots.push({
			date: date,
			email: user.email
		});
		
		supabase
			.from('devices')
			.update({slots: slots})
			.eq("id", device.id)
			.then(response => {
				console.log(response);
				window.location.reload();
			})
			.catch(function (error) {
				console.log(error);
			});
	}
	
	useEffect(() => {
		if (!id) {
			return;
		}
		supabase.from("devices")
			.select()
			.eq("id", id)
			.then(response => {
				if (!response.data[0].slots) {
					setDevice({ ...response.data[0], slots: [] });
				} else {
					setDevice(response.data[0]);
				}
			})
			.catch(function (error) {
				console.log(error);
			});
		
	}, [id]);
	
	return (
		<div style={{ padding: "1%" }}>
			<h3>Device Booking</h3>
			{device && (
				<div>
					<p>
						Device name: {device.name} <br />
						Device Type: {device.type}
					</p>
					<br />
				</div>
			)}
			{ device && !(device.slots.some(slot => slot.email === user.email)) && 
				<div>
					<div>
						<LocalizationProvider dateAdapter={AdapterDateFns}>
							<DateTimePicker
								renderInput={(props) => <TextField {...props} />}
								label="DateTimePicker"
								value={date}
								onChange={(newValue) => {
									setDate(newValue);
								}}
							/>
						</LocalizationProvider>
					</div>
					<br />
					<Button variant="contained" onClick={book}>
						Book Device
					</Button>
					<br /><br />
				</div>
			}
			{ device && device.hasOwnProperty('slots') && device.slots.length > 0 && 
				<div style={{
					width: "min-content",
					whiteSpace: "nowrap"
				}}>
					<h4>Booked Slots</h4>
					<table className="table">
						<thead className="thead-light">
							<tr>
								<td>User</td>
								<td>Date</td>
							</tr>
						</thead>
						<tbody>
							{device && device.slots.map(slot => (
								<tr key={slot.date}>
									<td>
										{(slot.email === user.email ? "You" : slot.email)}
									</td>
									<td>
										{new Date(slot.date).toLocaleDateString() + "  " + new Date(slot.date).toLocaleTimeString()}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			}
		</div>
	);
}