import { useEffect, useState } from "react";
import { useAuth } from "../Auth";
import { supabase } from "../supabaseClient";

import { CircularProgress } from "@mui/material";
import TextField from '@mui/material/TextField';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import { getDateString, getTimeString } from "../components/utils";
import "./home.css";

/* 
// remove add devices from nav
// no refresh after booking
// Change device list to devices
// equipment list overlap
// no booking for past date
// email sign in error handling
// unbook slot
// My bookings
// forgot password
Add confirmation dialogs
sort filter search
pagination
 */

/* 
To be discussed:
Added name length limit
OAuth
Download data format
 */
export default function Home() {
	const [equipment, setEquipment] = useState([]);
	const [date, setDate] = useState(new Date());
	const [search, setSearch] = useState("");
	const [dialog, setDialog] = useState(null);

	const { user } = useAuth();

	async function handleBooking(device_id, slot_id, isUnbook) {
		const { data, error } = await supabase.rpc((isUnbook) ? "unbook_device" : "bookdevice", {
			b_date: getDateString(date),
			s_id: slot_id,
			d_id: device_id,
		});
		setDialog(null);

		if (error) {
			console.error(error);
		} else if (data.id == null) {
			if (isUnbook) {
				console.log("Unable to unbook device");
			} else {
				console.error("Unable to book slot");
			}
		} else {
			let temp_equipment = equipment;
			const index = temp_equipment.findIndex(
				eq => eq.devices.some(
					device => device.id == data.device_id
				));
			if (index !== -1) {
				if (isUnbook) {
					temp_equipment[index].bookings = temp_equipment[index].bookings.filter(
						booking => booking.id != data.id
					);
				} else {
					temp_equipment[index].bookings.push(data);
				}
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
				.eq("booking_date", getDateString(date, true))
				.then(response => {
					response.data.forEach(booking => {
						const index = temp_equipment.findIndex(
							eq => eq.devices.some(
								device => device.id === booking.device_id
							)
						);
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
							<b>Equipment name:</b> {dialog.equipment_name} <br />
							<b>Device name:</b> {dialog.device_name} <br />
							<b>Slot:</b> {dialog.start_time} - {dialog.end_time} <br />
							{dialog.booked &&
								<p>
									<b>Booked by:</b> {dialog.email}
								</p>
							}
						</p>
						<div className="centered-div" style={{ justifyContent: "space-between" }}>
							<button onClick={() => setDialog(null)}>Close</button>
							{dialog.booked && dialog.email === user.email &&
								<button onClick={() => handleBooking(dialog.device_id, dialog.slot_id, true)}>
									Unbook
								</button>
							}
							{!dialog.booked &&
								<button onClick={() => handleBooking(dialog.device_id, dialog.slot_id)}>
									Book
								</button>
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
						inputFormat="dd/MM/yyyy"
						onChange={(newValue) => {
							setDate(newValue);
						}}
						renderInput={(params) => <TextField size="small" {...params} />}
					/>
				</LocalizationProvider>
			</div>
			{equipment.length === 0 &&
				<div className="centered-div">
					<CircularProgress />
				</div>
			}
			{/* <button onClick={() => {
				supabase.rpc("does_email_exist", {
					email_param: "xaxem99271@leupus.com"
				}).then(response => {
					console.log(response);
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
						style={{ overflow: "auto" }}
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
										if (!device.name.toLowerCase().includes(search.toLowerCase())) return null;

										return <tr key={device.id}>
											<td>{device.name}</td>
											{equipment_item.slots[0] != null && equipment_item.slots.map(slot => {
												return <td key={slot.id}>
													{(() => {
														var booking = equipment_item.bookings.find(b => {
															if (!b)
																return false;
															return b.device_id === device.id && b.slot_id === slot.id;
														})

														// var temp_date = new Date();
														// temp_date.setHours(0, 0, 0, 0);
														const d = new Date(date.getFullYear(), date.getMonth(), date.getDate(), slot.end_time.split(":")[0], slot.end_time.split(":")[1], slot.end_time.split(":")[2]);

														if (booking) {
															return <div
																style={{
																	display: "flex",
																}}>
																<button
																	className="slot-red"
																	onClick={() => {
																		setDialog({
																			equipment_name: equipment_item.equipment,
																			device_name: device.name,
																			start_time: getTimeString(slot.start_time),
																			end_time: getTimeString(slot.end_time),
																			device_id: device.id,
																			slot_id: slot.id,
																			booked: true,
																			email: booking.email,
																		})
																	}}
																/>
															</div>
														} else if (d < new Date()) {
															return <div className="slot-grey"></div>
														} else {
															return <div
																style={{
																	display: "flex",
																}}>
																<button
																	className="slot-green"
																	onClick={() => {
																		setDialog({
																			equipment_name: equipment_item.equipment,
																			device_name: device.name,
																			start_time: getTimeString(slot.start_time),
																			end_time: getTimeString(slot.end_time),
																			device_id: device.id,
																			slot_id: slot.id,
																			booked: false,
																		})
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
