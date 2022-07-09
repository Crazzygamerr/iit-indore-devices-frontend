import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useAuth } from "../Auth";

import { CircularProgress } from "@mui/material";
import TextField from '@mui/material/TextField';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import { getTimeString, getDateString } from "../components/utils";
import "./home.css";

/* 
// remove add devices from nav
// no refresh after booking
// Change device list to devices
// equipment list overlap
// no booking for past date
// email sign in error handling
sort filter search
forgot password
pagination
unbook slot
 */
export default function Home() {
	const [equipment, setEquipment] = useState([]);
	const [date, setDate] = useState(new Date());
	const [search, setSearch] = useState("");
	const [dialog, setDialog] = useState(null);
	
	const { user } = useAuth();
	
	async function bookDevice(device_id, slot_id) {
		const { data, error } = await supabase.rpc("bookdevice", {
			b_date: getDateString(date),
			s_id: slot_id,
			d_id: device_id,
		});
		if (error) {
			console.error(error);
		} else if (data.id == null) {
			console.error("Unable to book slot");
		} else {
			let temp_equipment = equipment;
			const index = temp_equipment.findIndex(
				eq => eq.devices.some(
					device => device.id == data.device_id
				));
			if (index !== -1) {
				temp_equipment[index].bookings.push(data);
			}
			setEquipment([...temp_equipment]);
		}
	}

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
				.eq("booking_date", getDateString(date))
				.then(response => {
					response.data.forEach(booking => {
						const index = temp_equipment.findIndex(equipment => equipment.devices.some(device => device.id === booking.device_id));
						if (index !== -1) {
							temp_equipment[index].bookings.push(booking);
						}
					});
					setEquipment(temp_equipment);
				}).catch(error => console.log(error));
		}

		getAllByEquipment();
	}, [date]);

	return (
		<div style={{ padding: "10px" }}>
			{dialog &&
				<div className="dialog-backdrop">
					<div className="dialog-container">
						<h5>Slot Info</h5>
						<p>
							Equipment name: {dialog.equipment_name}
							Device name: {dialog.device_name}
							Slot: {dialog.start_time} - {dialog.end_time}
							{dialog.booked && <p>Booked by: {dialog.email}</p>}
						</p>
						<div className="centeredDiv" style={{justifyContent: "space-between"}}>
							<button onClick={() => setDialog(null)}>Close</button>
							{!dialog.booked && dialog.email == user.email &&
								<button onClick={() => bookDevice(dialog.device_id, dialog.slot_id)}>Unbook</button>
							}
							{!dialog.booked &&
								<button onClick={() => bookDevice(dialog.device_id, dialog.slot_id)}>Book</button>
							}
						</div>
					</div>
				</div>
			}
			<h3>Home</h3>
			<div style={{
				padding: "10px",
			}}>
				<input
						type="text"
						placeholder="Search"
						className="search-input"
						onChange={(e) => {
							setSearch(e.target.value);
						}}
					/>
			</div>
			<div style={{
				display: "flex",
				flexDirection: "row",
				justifyContent: "start",
				alignItems: "center",
				margin: "15px 10px",
			}}>
				<LocalizationProvider dateAdapter={AdapterDateFns}>
					<DatePicker
						value={date}
						label="Date"
						onChange={(newValue) => {
							setDate(newValue);
						}}
						renderInput={(params) => <TextField size="small" {...params} />}
					/>
				</LocalizationProvider>
			</div>
			{equipment.length === 0 &&
				<div className="centeredDiv">
					<CircularProgress />
				</div>
			}
			{/* <button onClick={() => {
				supabase.rpc("get_all").then(response => {
					console.log(JSON.stringify(response.data, null, 2));
				});
			}}>Call</button> */}
			{equipment.length !== 0 &&
				equipment.map(equipment_item => {
					if (!(equipment_item.equipment.toLowerCase().includes(search.toLowerCase())
						|| equipment_item.devices.some(device => device.name.toLowerCase().includes(search.toLowerCase())))) 
						return null;
					
					return <div
						key={equipment_item.equipment_id}
						className="card-style"
						style={{overflow: "auto"}}
					>
						<div style={{ marginBottom: "1%" }}>
							<h5>{equipment_item.equipment}</h5>
						</div>
						<table>
							<thead>
								<tr>
									<th>Device Name</th>
									{equipment_item.slots[0] != null && equipment_item.slots.map(slot => {
										return <th
											key={slot.id}
											style={{
												whiteSpace: "nowrap",
											}}>
											{getTimeString(slot.start_time)}
											<br />
											{getTimeString(slot.end_time)}
										</th>
									})
									}
								</tr>
							</thead>
							<tbody>
								{equipment_item.devices[0] != null &&
									equipment_item.devices.map(device => {
										if(!device.name.toLowerCase().includes(search.toLowerCase())) return null;
										
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
														var temp_date = new Date();
														temp_date.setHours(0, 0, 0, 0);
														if (test) {
															return <div>{test.email}</div>
														} else if (date < temp_date) { 
															return <div className="slot-grey"></div>
														} else {
															return <div>
																<div
																	className="slot-green"
																	onClick={() => {
																		bookDevice(
																			device.id,
																			slot.id
																		);
																	}}
																/>
															</div>
														}
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
