import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../Utils/Auth";
import { supabase } from "../Utils/supabaseClient";

import { CircularProgress } from "@mui/material";

import DeviceByEqipmentTable from "../components/deviceByEquipment";
import DeviceTable from "../components/deviceTable";
import HomeSearchFilter from "../components/homeSearchFilter/homeSearchFilter";
import Toast from "../components/toast/toast";
import { getDateString } from "../Utils/utilities";
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
// pagination
Add confirmation dialogs
sort filter search
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
	const [toastDetails, setToastDetails] = useState({description: '', isError: true});
	const [searchByEquipment, setSearchByEquipment] = useState(true);

	const { user } = useAuth();

	async function handleBooking(device_id, slot_id, isUnbook) {
		const { data, error } = await supabase.rpc((isUnbook) ? "unbook_device" : "bookdevice", {
			b_date: getDateString(date, true),
			s_id: slot_id,
			d_id: device_id,
		});
		setDialog(null);

		if (error) {
			setToastDetails({description: error.message, isError: true});
		} else if (data.id == null) {
			if (isUnbook) {
				setToastDetails({description: "Unable to unbook device", isError: true});
			} else {
				setToastDetails({description: "Unable to book slot", isError: true});
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

	const getBookings = useCallback(
		async function get_b(
			temp_equipment,
			days = 1,
		) {
			await supabase.from("bookings")
				.select()
				// .eq("booking_date", getDateString(date, true))
				.gte("booking_date", getDateString(date, true))
				.lt("booking_date", getDateString(date, true, days))
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
				}).catch(error => {
					// console.log(error);
					setToastDetails({description: error.message, isError: true});
				});
		}, [date]);

	useEffect(() => {
		const temp_equipment = [];
		async function getAllByEquipment() {
			supabase.rpc("get_all_by_equipment")
				.then(response => {
					response.data.forEach(element => element.bookings = []);
					temp_equipment.push(...response.data);
				})
				.catch(error => {
					// console.error(error);
					setToastDetails({description: error.message, isError: true});
				});

			await getBookings(temp_equipment);
		}

		getAllByEquipment();
	}, [date, getBookings]);

	return (
		<div style={{ padding: "10px" }}>

			<Toast toastDetails={toastDetails} />

			{dialog &&
				<div className="dialog-backdrop">
					<div className="dialog-container">
						<h5>Slot Info</h5>
						<p>
							<b>Equipment name:</b> {dialog.equipment_name} <br />
							<b>Device name:</b> {dialog.device_name} <br />
							<b>Date:</b> {getDateString(dialog.booking_date)} <br />
							<b>Slot:</b> {dialog.start_time} - {dialog.end_time} <br />
							{dialog.booked && <b>Booked by: </b>}
							{dialog.booked && dialog.email}
						</p>
						<div className="centered-div" style={{
							flexDirection: 'row',
							justifyContent: "space-between"
						}}>
							<button onClick={() => setDialog(null)}>Close</button>
							{dialog.booked && dialog.email === user.email && dialog.canUnbook &&
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

			<HomeSearchFilter
				date={date}
				setDate={setDate}
				searchByEquipment={searchByEquipment}
				setSearchByEquipment={setSearchByEquipment}
			/>

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

			{searchByEquipment ?
				<DeviceByEqipmentTable
					equipment={equipment}
					date={date}
					search={search}
					setDialog={setDialog}
				/> :
				<DeviceTable />
			}

		</div>
	);
}
