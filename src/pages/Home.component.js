import React from "react";
import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

import { CircularProgress } from "@mui/material";
// import calendar icon
import CalendarIcon from "@mui/icons-material/CalendarToday";

import "./home.css";
import { getDateString } from "../components/utils";

export default function Home() {
	const [equipment, setEquipment] = useState([]);
	const [loading, setLoading] = useState(true);
	const [date, setDate] = useState(new Date());
	const [open, setOpen] = useState(false);
	
	useEffect(() => {				
		const temp_equipment = [];
		async function getAllByEquipment() {
			supabase.rpc("get_all_by_equipment")
				.then(response => {
					response.data.forEach(element => element.bookings = []);
					temp_equipment.push(...response.data);
				})
				.catch(error => console.log(error));
			
			await supabase.from("bookings")
				.select()
				.then(response => {
					response.data.forEach(booking => {
						const index = temp_equipment.findIndex(equipment => equipment.devices.some(device => device.id === booking.device_id));
						if (index !== -1) {
							temp_equipment[index].bookings.push(booking);
						}
					});
					setEquipment(temp_equipment);
				}).catch(error => console.log(error));
			setLoading(false);
		}
		
		getAllByEquipment();
	}, []);
	
	return (
		<div style={{ padding: "1%" }}>
			<h3>Home</h3>
			<input
				type="text"
				placeholder="Search"
				style={{ width: "100%", marginBottom: "1%" }}
			/>
			{loading &&
				<div className="centeredDiv">
					<CircularProgress />
				</div>
			}
			{/* <button onClick={() => {
				supabase.rpc("get_all").then(response => {
					console.log(JSON.stringify(response.data, null, 2));
				});
			}}>Call</button> */}
			{!loading && 
				equipment.map(equipment_item => {
					return <div
						key={equipment_item.equipment_id}
						// use card-style class defined in home.module.css
						className="card-style"
					>
						<div style={{marginBottom: "1%"}}>
							{equipment_item.equipment}
						</div>
						<table>
							<thead>
								<tr>
									<th>Device Name</th>
									{equipment_item.slots[0] != null && equipment_item.slots.map(slot => {
										return <th key={slot.id}>
											{getDateString(slot.start_time) +  " - " + getDateString(slot.end_time)}
										</th>
									})
									}
								</tr>
							</thead>
							<tbody>
								{equipment_item.devices[0] != null &&
									equipment_item.devices.map(device => {
										return <tr key={device.id}>
											<td>{device.name}</td>
											{equipment_item.slots[0] != null && equipment_item.slots.map(slot => {
												return <td key={slot.id}>
													{(() => {
														var test = equipment_item.bookings.find(booking => {
															if (!booking)
																return false;
															return booking.device_id === device.id && booking.slot_id === slot.id;
														})
														if (test)
															return <div>{test.email}</div>
														else
															return <div>-</div>
													})()}
												</td>
											})
											}
										</tr>
									})
								}
							</tbody>
						</table>
					</div>
				})
			}
		</div>
	);
}
		