import React from "react";
import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

import { CircularProgress } from "@mui/material";
import styled from "styled-components";

const CenteredDiv = styled.div`
	width: 100%;
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 1%;
	`;

export default function Home() {
	const [devices, setDevices] = useState([]);
	const [slots, setSlots] = useState([]);
	const [bookings, setBookings] = useState([]);
	const [loading, setLoading] = useState(true);
	
	useEffect(() => {		
		// var temp_devices = [], temp_slots = [], temp_bookings = [];
		
		const fetchData = async () => {
			await supabase.from("devices")
				.select()
				.then(response => {
					// temp_devices = response.data;
					setDevices(response.data);
				})
				.catch(error => {
					console.log(error);
				});

			await supabase.from("slots")
				.select()
				.order("start_time")
				.then(response => {
					// temp_slots = response.data;
					setSlots(response.data);
				}).catch(error => console.log(error));
			
			await supabase.from("bookings")
				.select()
				.then(response => {
					setBookings(response.data);
				}).catch(error => console.log(error));
			
			//merge devices and slots
			/* var merged = [];
			for (var i = 0; i < temp_devices.length; i++) {
				var device = temp_devices[i];
				var slots = [];	
				for (var j = 0; j < temp_slots.length; j++) {
					var slot = temp_slots[j]; */
			
			setLoading(false);
		}
		
		fetchData();
	}, []);
	
	return (
		<div style={{ padding: "1%" }}>
			<h3>Home</h3>
			{loading && <CenteredDiv>
				<CircularProgress />
			</CenteredDiv>}
			{! loading &&
				<table>
					<thead>
						<tr>
							<th style={{
										fontWeight: "normal",
										margin: "1%",
										border: "1px solid black",
										whiteSpace: "pre-line",
							}}>
								Device
							</th>
							{
								slots.map(slot => {
									return (
										<th key={slot.id} style={{
											fontWeight: "normal",
											margin: "1%",
											border: "1px solid black",
											whiteSpace: "pre-line",
										}}>
											{new Date('1970-01-01T' + slot.start_time + 'Z')
											.toLocaleTimeString('en-US',
												{timeZone:'UTC',hour12:true,hour:'numeric',minute:'numeric'}
											)} - {new Date('1970-01-01T' + slot.end_time + 'Z')
											.toLocaleTimeString('en-US',
												{timeZone:'UTC',hour12:true,hour:'numeric',minute:'numeric'}
											)}
										</th>
									)
								})
							}
						</tr>
					</thead>
					<tbody>
						{devices.map(device => {
							return (
								<tr key={device.id}>
									<td>{device.name}</td>
									{
										slots.map(slot => {
											return <td key={slot.id}>
												{(() => {
													// show email id if booked else show button
													var temp = bookings.filter(booking => booking.device_id === device.id && booking.slot_id === slot.id);
													if (temp.length > 0) {
														return temp[0].email;
													} else {
														return <button>Book</button>
													}
												})()}
											</td>
										})
									}
								</tr>
							)
						})
						}
					</tbody>
				</table>
			}
		</div>
	);
}
		