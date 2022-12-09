import React, { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "../../Utils/supabaseClient";

import { CircularProgress } from "@mui/material";

import DeviceTable from "../../components/deviceTable";
import HomeSearchFilter from "../../components/homeSearchFilter/homeSearchFilter";
import Toast from "../../components/toast/toast";
import { getDateString, TableContext } from "../../Utils/utilities";
import "./home.css";
import BookingDialog from "../../components/bookingDialog";

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
// Add confirmation dialogs
// no need for device
// one slot booking per equipment
// Remarks column
sort filter search
slot time validation
Allowed users for each device
Queue of students for each device
 */

/* 
To be discussed:
Download data format - send example
Device Equipment change behaviour - delete bookings?
Disable booking for device
 */
export default function Home() {
	const [devices, setDevices] = useState([]);
	const [date, setDate] = useState(new Date());
	const [search, setSearch] = useState("");
	const [dialog, setDialog] = useState(null);
	const [toastDetails, setToastDetails] = useState({ description: '', isError: true });
	const [searchForToday, setSearchForToday] = useState(true);
	
	const context = useMemo(() => ({
		devices,
		date,
		search,
		setDialog,
		searchForToday
	}), [devices, date, search, setDialog, searchForToday]);

	async function handleBooking(device_id, slot_id, b_date, isUnbook) {
		const { data, error } = await supabase.rpc((isUnbook) ? "unbook_device" : "bookdevice", {
			b_date: getDateString(b_date, true),
			s_id: slot_id,
			d_id: device_id,
		});
		setDialog(null);
		// console.log(data);
		if (error) {
			setToastDetails({ description: error.message, isError: true });
		} else if (data.id == null) {
			if (isUnbook) {
				setToastDetails({ description: "Unable to unbook device", isError: true });
			} else {
				setToastDetails({ description: "Unable to book slot", isError: true });
			}
		} else {
			let temp_devices = devices;
			const index = temp_devices.findIndex(d => d.id === data.device_id);
			if (index !== -1) {
				if (isUnbook) {
					if (temp_devices[index].bookings) {
						temp_devices[index].bookings = temp_devices[index].bookings.filter(
							booking => booking.id != data.id
						);
					}
				} else {
					if (!temp_devices[index].bookings) {
						temp_devices[index].bookings = [];
					}
					temp_devices[index].bookings.push(data);
				}
			}
			// setDevices([...temp_devices]);
			getDeviceBooked([...temp_devices]);
		}
	}
	
	const getDeviceBooked = useCallback(
		async function getDeviceBooked(temp) {
			supabase.rpc("get_booked_devices")
				.then(response => {
					temp = temp.map(device => {
						device.isBooked = response.data.indexOf(device.id) !== -1;
						return device;
					})
					setDevices(temp);
					console.log(JSON.stringify(temp, null, 2));
				})
				.catch(error => {
					// console.error(error);
					setToastDetails({ description: error.message, isError: true });
				});
		}, [setDevices]);
	
	const getAllByDevice = useCallback(
		async function getAllByDevice() {
			var temp = [];
			await supabase.rpc(
				"get_all_by_device",
				{
					b_date: getDateString(date, true),
					days: (searchForToday) ? 1 : 5,
				}	
			).then(response => {
					temp = response.data;
				})
				.catch(error => {
					// console.error(error);
					setToastDetails({ description: error.message, isError: true });
				});
			getDeviceBooked(temp);
		}, [date, searchForToday, getDeviceBooked]);

	useEffect(() => {
		getAllByDevice();
	}, [date, getAllByDevice]);

	return (
		<div style={{ padding: "10px" }}>

			<Toast toastDetails={toastDetails} />

			{dialog &&
				<BookingDialog
					dialog={dialog}
					handleBooking={handleBooking}
					setDialog={setDialog}
				/>
			}
			
			<h3>Home </h3>
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
				searchForToday={searchForToday}
				setSearchForToday={setSearchForToday}
			/>

			{devices.length === 0 &&
				<div className="centered-div">
					<CircularProgress />
				</div>
			}
			{/* <button onClick={() => {
				console.log(JSON.stringify(devices, null, 2));
			}}>Call</button> */}

			<TableContext.Provider value={context}>
				<DeviceTable />
			</TableContext.Provider>
		</div>
	);
}