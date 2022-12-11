import React, { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "../../Utils/supabaseClient";

import { CircularProgress } from "@mui/material";

// import DeviceTable from "../../components/deviceTable";
// import HomeSearchFilter from "../../components/homeSearchFilter/homeSearchFilter";
import TextField from '@mui/material/TextField';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import Toast from "../../components/toast/toast";
import "./home.scss";
import BookingDialog from "../../components/bookingDialog";
import { addDaysToDate, getDateString, getTimeString, matchSearch} from "../../Utils/utilities";
import ShowMoreWrapper from "../../components/showMoreWrapper/showMoreWrapper";
import SlotButton from "../../components/slotButton";

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
	
	const context = useMemo(() => ({
		devices,
		date,
		search,
		setDialog,
	}), [devices, date, search, setDialog]);

	async function handleBooking(device_id, slot_id, b_date, isUnbook) {
		const { data, error } = await supabase.rpc((isUnbook) ? "unbook_device" : "bookdevice", {
			b_date: getDateString(b_date, true),
			s_id: slot_id,
			d_id: device_id,
		});
		setDialog(null);
		// console.log(data, error);
		if (error) {
			setToastDetails({ description: error.message, isError: true });
		} else if (data.id == null) {
			setToastDetails({ description: `Unable to ${isUnbook ? 'unbook device' : 'book slot'}`, isError: true });
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
			setDevices([...temp_devices]);
			// getDeviceBooked([...temp_devices]);
		}
	}
	
	const getAllByDevice = useCallback(
		async function getAllByDevice() {
			var temp = [];
			await supabase.rpc(
				"get_all_by_device",
				{
					b_date: getDateString(date, true),
					days: 1,
				}	
			).then(response => {
					temp = response.data;
				})
				.catch(error => {
					// console.error(error);
					setToastDetails({ description: error.message, isError: true });
				});
			// getDeviceBooked(temp);
			setDevices(temp);
		}, [date]);

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
			
			<button
				onClick={() => {
					supabase.from("users").select("*")
						.then(response => {
							console.log(JSON.stringify(response, null, 2));
						})
				}}
			> Test </button>
			
			<div style={{ padding: "10px" }}>
				<input
					type="text"
					placeholder="Search"
					className="search-input"
					onChange={(e) => {
						setSearch(e.target.value);
					}}
				/>
			</div>

			<div className="HomeSearchFilter__mainDiv">
				{/* <div style={{ whiteSpace: 'nowrap' }}>
					{"Slots for: "}
					<button
						className={`joined-button-left ${!searchForToday ? "joined-button--inactive" : ""}`}
						onClick={() => {
							setSearchForToday(true);
						}}>Today</button>
					<button
						className={`joined-button-right ${searchForToday ? "joined-button--inactive" : ""}`}
						onClick={() => {
							setSearchForToday(false);
						}}>Next 5 days</button>
				</div> */}
				<div>
					<LocalizationProvider dateAdapter={AdapterDateFns}>
						<DatePicker
							value={date}
							label="Date"
							inputFormat="dd/MM/yyyy"
							onChange={(newValue) => {
								setDate(newValue);
							}}
							renderInput={(params) => <TextField sx={{ width: "175px", }} size="small" {...params} />}
						/>
					</LocalizationProvider>
				</div>
			</div>

			{devices.length === 0 &&
				<div className="centered-div">
					<CircularProgress />
				</div>
			}

			<div style={{
				overflowX: 'auto',
			}}>
				<ShowMoreWrapper
					list={devices}
					initial_length={10}
					builder={(device, device_index) => {
						if (!matchSearch(device.device, search)
							&& !matchSearch(device.remarks ?? "", search))
							return null;

						return <div className="card-style device-card" key={device.id}>
							<div className="device-desc">
								<h4>{device.device}</h4>
								{device.remarks &&
									<p style={{
										width: "100%",
										height: "100%",
										overflow: "hidden",
									}}
									>{device.remarks}</p>
								}
							</div>
							{/* vertical line */}
							<div style={{
								borderLeft: "1px solid #e0e0e0",
							}}></div>
							<div className="device-slots">
								{device != null &&
										device.slots && device.slots[0] != null && device.slots.map(slot => {
											return <SlotButton
													key={slot.id}
													device={device}
													slot={slot}
													date={addDaysToDate(date, 0)}
													setDialog={setDialog}
												/>
										})
									}
							</div>
						</div>
					}}
				/>
			</div>
		</div>
	);
}
