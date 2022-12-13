import React, { useCallback, useEffect, useState } from "react";
import { supabase } from "../../Utils/supabaseClient";
import { CircularProgress } from "@mui/material";
import TextField from '@mui/material/TextField';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import Toast from "../../components/toast/toast";
import "./home.scss";
import BookingDialog from "../../components/bookingDialog";
import { addDaysToDate, getDateString, matchSearch} from "../../Utils/utilities";
import ShowMoreWrapper from "../../components/showMoreWrapper/showMoreWrapper";
import SlotButton from "../../components/slotButton";
import { useAuth } from "../../Utils/Auth";

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
// Allowed users for each device
// Queue of students for each device
sort filter search
slot time validation
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
	const { user } = useAuth();

	async function handleBooking(device_id, slot_id, b_date, isUnbook) {
		const { data, error } = await supabase.rpc((isUnbook) ? "unbook_device" : "bookdevice", {
			b_date: getDateString(b_date, true),
			s_id: slot_id,
			d_id: device_id,
		});
		setDialog(null);
		console.log(data, error);
		if (error) {
			setToastDetails({ description: error.message, isError: true });
		} else if (data.id == null) {
			setToastDetails({ description: `Unable to ${isUnbook ? 'unbook device' : 'book slot'}`, isError: true });
		} else {
			getAllByDevice();
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
				temp.forEach(device => {
					device.queue_pos = 0;
					device.queue_booking = null;
					if (device.bookings) {
						device.queue_pos = device.bookings.length;
						device.queue_pos = device.bookings.findIndex(booking => booking.email === user.email);
						device.queue_booking = device.bookings.find(booking => booking.email === user.email);
						device.queue_pos = (device.queue_pos === -1) ? device.bookings.length : device.queue_pos;
					} else {
						device.bookings = [];
					}
					console.log(temp);
				});
			})
			.catch(error => {
				setToastDetails({ description: error.message, isError: true });
			});
			// getDeviceBooked(temp);
			setDevices(temp);
		}, [date, user.email]);

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
							{(device.slots && device.slots[0] != null && !device.has_queue) 
								? (<div className="device-slots">
									{device.slots.map(slot => {
									return <SlotButton
											key={slot.id}
											device={device}
											slot={slot}
											date={addDaysToDate(date, 0)}
											setDialog={setDialog}
										/>
									})}
								</div>
								) : (
									<div className="device-queue">
										<p>Ahead in queue: {device.queue_pos}</p>
										<p>Total in queue: {device.bookings.filter(booking => booking.is_completed === false).length}</p>
										<button
											onClick={() => {
												handleBooking(
													device.id,
													null,
													device.queue_booking ? device.queue_booking.booking_date : Date.now(),
													device.queue_booking
												);
											}}>
											{!device.queue_booking ? "Book" : "Unbook"}
										</button>
									</div>
								)}
						</div>
					}}
				/>
			</div>
		</div>
	);
}
