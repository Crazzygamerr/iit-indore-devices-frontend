import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../Auth";
import { supabase } from "../supabaseClient";

import TextField from '@mui/material/TextField';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { Button } from "react-bootstrap";

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
				window.location.href="/"
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
		<div>
			<h1>Device Booking</h1>
			{device && (
				<div>
					<h2>{device.name}</h2>
					<p>Device Type: {device.type}</p>
				</div>
			)}
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
			{ device && !(device.slots.some(slot => slot.email === user.email)) && 
				<Button onClick={book}>
					Book Device
				</Button>
			}
			<br />
			<h2>Booked Slots</h2>
			<ul>
				{device && device.slots.map(slot => (
					<li key={slot.date}>
						{(slot.email === user.email ? "You" : slot.email) + ": "}
						{new Date(slot.date).toLocaleDateString() + "  " + new Date(slot.date).toLocaleTimeString()}
					</li>
				))}
			</ul>
		</div>
	);
}