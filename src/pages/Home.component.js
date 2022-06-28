import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

import { CircularProgress } from "@mui/material";
import TextField from '@mui/material/TextField';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import { getTimeString, getDateString } from "../components/utils";
import "./home.css";

export default function Home() {
	const [equipment, setEquipment] = useState([]);
	const [loading, setLoading] = useState(true);
	const [date, setDate] = useState(new Date());
	
	async function bookDevice(device_id, slot_id) {
		const { data, error } = await supabase.rpc("bookdevice", {
			b_date: getDateString(date),
			s_id: slot_id,
			d_id: device_id,
		});
		if (error) {
			console.error(error);
		} else {
			window.location.reload();
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
			setLoading(false);
		}

		getAllByEquipment();
	}, [date]);

	return (
		<div style={{ padding: "1%" }}>
			<h3>Home</h3>
			<div style={{
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
				margin: "1%"
			}}>
				<LocalizationProvider dateAdapter={AdapterDateFns}>
					<DatePicker
						value={date}
						label="Date"
						onChange={(newValue) => {
							setDate(newValue);
						}}
						renderInput={(params) => <TextField {...params} />}
					/>
				</LocalizationProvider>
			</div>
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
						<div style={{ marginBottom: "1%" }}>
							{equipment_item.equipment}
						</div>
						<table>
							<thead>
								<tr>
									<th>Device Name</th>
									{equipment_item.slots[0] != null && equipment_item.slots.map(slot => {
										return <th key={slot.id}>
											{getTimeString(slot.start_time) + " - " + getTimeString(slot.end_time)}
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
															return <div>
																<button
																	onClick={() => {
																		bookDevice(
																			device.id,
																			slot.id
																		);
																	}}
																>
																	Book
																</button>
															</div>
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
