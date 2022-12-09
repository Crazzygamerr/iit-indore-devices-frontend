import { Children, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../../Utils/supabaseClient';

import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { CircularProgress, IconButton, TextField } from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { Spacer } from '../../components/spacer';
import { getDateString, getTimeString, matchSearch } from '../../Utils/utilities';
import ShowMoreWrapper from '../../components/showMoreWrapper/showMoreWrapper';
import ConfirmDialog from '../../components/confirmDialog';
import Toast from '../../components/toast/toast';
import './EditDevice.scss';

const EditDevice = () => {
	const [device, setDevice] = useState({
		name: "",
		remarks: "",
	});
	const [slots, setSlots] = useState([]);
	const [bookings, setBookings] = useState([]);
	const [loading, setLoading] = useState(true);
	const [search, setSearch] = useState("");
	const [bookingRemoveId, setBookingRemoveId] = useState(null);
	const [startTime, setStartTime] = useState(Date.now());
	const [endTime, setEndTime] = useState(Date.now() + 3600000);
	const [dialogId, setDialogId] = useState(null);
	const [toastDetails, setToastDetails] = useState({
		title: '',
		description: '',
		isError: true,
	});

	const { id } = useParams();
	let navigate = useNavigate();

	function removeBooking(id) {
		supabase.from("bookings")
			.delete()
			.eq("id", id)
			.then(response => {
				setBookings(bookings.filter(b => b.id != id));
				setBookingRemoveId(null);
			}).catch(error => console.log(error));
	}
	
	async function saveDevice() {
		if (!id) {
			const { data, error } = await supabase
				.from("devices")
				.select()
				.eq("name", device.name);
			if (error) {
				setToastDetails({ message: "An error occurred", isError: true });
				return;
			}
			if (data.length > 0) {
				setToastDetails({ message: "Device already exists", isError: true });
				return;
			}
		}
		if (!device.name) {
			setToastDetails({ message: "Device name is required", isError: true });
			return;
		}
		
		const { data, error } = await supabase
			.from("devices")
			.upsert({
				id: id,
				name: device.name,
				remarks: device.remarks,
			});

		if (error) {
			setToastDetails({
				message: "An error occurred",
				isError: true
			});
			return;
		}
		
		if (!id) {
			setSlots(slots.map(slot => {
				slot.device_id = data[0].id;
				if (!slot.id) {
					delete slot.id;
				}
				return slot;
			}));

			await supabase.from("slots")
				.insert(slots)
				.then(res => {
					navigate("/devices");
				})
				.catch(err => console.log(err));
		} else {
			navigate("/devices");
		}
	}
	
	async function addSlot(slot_id) {
		const startTimeString = new Date(startTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).substring(0, 5);
		const endTimeString = new Date(endTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).substring(0, 5);
		setSlots([...slots, {
			id: slot_id,
			start_time: startTimeString,
			end_time: endTimeString,
			device_id: id,
		}]);
	}
	
	useEffect(() => {
		if (id) {
			supabase.rpc("get_device",
				{
					param_id: id,
				})
				.then(response => {
					setDevice({
						id: response.data.id,
						name: response.data.device ?? "",
						remarks: response.data.remarks ?? "",
					});
					setSlots(response.data.slots);
					
					var temp = response.data.bookings;
					if (response.data.bookings) {
						temp.forEach(booking => {
							booking.slot = response.data.slots.find(slot => slot.id === booking.slot_id);
						});
						temp.sort((a, b) => {
							return Date.parse(b.booking_date) - Date.parse(a.booking_date);
						});
					} else if (!response.data.bookings) {
						temp = [];
					}
					setBookings(temp);
					
					setLoading(false);
				}).catch(error => console.log(error));
		} else {
			setLoading(false);
		}

	}, [id]);

	return (
		<div className='editDevice'>
			
			<Toast toastDetails={toastDetails} />
			
			{dialogId &&
				<div className='dialog-backdrop'>
					<div className="dialog-container">
						<h5>Add slot</h5>
						<LocalizationProvider dateAdapter={AdapterDateFns}>
							<TimePicker
								renderInput={(props) => <TextField {...props} />}
								label="Start Time"
								value={startTime}
								onChange={(newValue) => {
									setStartTime(newValue.getTime());
								}}
							/>
						</LocalizationProvider>
						<Spacer height='20px' />
						<LocalizationProvider dateAdapter={AdapterDateFns}>
							<TimePicker
								renderInput={(props) => <TextField {...props} />}
								label="End Time"
								value={endTime}
								onChange={(newValue) => {
									setEndTime(newValue.getTime());
								}}
							/>
						</LocalizationProvider>
						<Spacer height='20px' />
						<div style={{
							display: 'flex',
							justifyContent: 'end',
						}}>
							<div style={{
								display: 'flex',
								justifyContent: 'space-around',
								width: '50%',
							}}>
								<button onClick={() => {
									setDialogId(null);
								}}>
									Cancel
								</button>
								<button onClick={() => {
									if (dialogId < 0) {
										addSlot();
									} else {
										addSlot(dialogId);
									}
									setDialogId(null);
								}}>
									Add
								</button>
							</div>
						</div>
					</div>
				</div>
			}
			{bookingRemoveId && 
				<ConfirmDialog
					title={"Are you sure you want to remove the booking?"}
					message={"This action cannot be undone."}
					setRemoveId={setBookingRemoveId}
					confirmText={"Delete"}
					handleConfirm={() => {
						removeBooking(bookingRemoveId)
					}}
				/>
			}
			{/* <h3>{(!id) ? "Add Device" : "Edit Device"}</h3> */}
			<div className="card-style editDevice__card">
				<label>Device Name: </label>
				<input
					type='text'
					name='name'
					value={device.name || ''}
					required
					maxLength={30}
					onChange={e => {
						let newDevice = { ...device };
						newDevice.name = e.target.value;
						setDevice(newDevice);
					}} />
				<Spacer height='20px' />
				<label>Remarks: </label>
				<TextField
					label=' '
					value={device.remarks || ''}
					fullWidth={true}
					onChange={e => {
						let newDevice = { ...device };
						newDevice.remarks = e.target.value;
						setDevice(newDevice);
					}}
				/>
				<Spacer height='20px' />
				{!loading &&
					<div className='editDevice__saveButtonDiv'>
						<button type="submit" onClick={() => navigate('/devices')}>
							Cancel
						</button>
						<button type="submit" onClick={() => {
							saveDevice();
						}}>
							{(!id) ? "Add Device" : "Save changes"}
						</button>
					</div>
				}
			</div>
			<div className='card-style editDevice__card'>
				<div>
					<h4>Slots</h4>
					{loading &&
						<div className='centered-div'>
							<CircularProgress />
						</div>
					}
					{!loading &&
						<div>
							{!id &&
								<button onClick={() => {
									setDialogId(-1);
								}}> + Add Slot</button>
							}
							<table className='table'>
								<thead>
									<tr>
										<th>No.</th>
										<th>Start time</th>
										<th>End time</th>
									</tr>
								</thead>
								<tbody>
									{slots && Children.toArray(
										slots.map((slot, index) => (
											<tr key={slot.id}>
												<td>{index + 1}</td>
												<td>{getTimeString(slot.start_time)}</td>
												<td>{getTimeString(slot.end_time)}</td>
												{!id &&
													<td>
														<IconButton onClick={() => {
															let startTime = new Date();
															startTime.setHours(slot.start_time.split(':')[0]);
															startTime.setMinutes(slot.start_time.split(':')[1]);
															let endTime = new Date();
															endTime.setHours(slot.end_time.split(':')[0]);
															endTime.setMinutes(slot.end_time.split(':')[1]);

															setStartTime(startTime);
															setEndTime(endTime);
															setDialogId(slot.id);
														}}>
															<EditIcon />
														</IconButton>
													</td>
												}
												{!id &&
													<td>
														<IconButton onClick={() => {
															setSlots(slots.filter((s, i) => i !== index));
														}}>
															<DeleteIcon />
														</IconButton>
													</td>
												}
											</tr>
										)))}
								</tbody>
							</table>
						</div>
					}
				</div>
			</div>
			<Spacer height={20} />
			<div className='card-style editDevice__card'>
				{id &&
					<h4>Bookings</h4>
				}
				{loading &&
					<div className='centered-div'>
						<CircularProgress />
					</div>
				}
				{!loading && id && !(bookings.length > 0) &&
					<div>
						No bookings yet!
					</div>
				}
				{!loading && id && bookings.length > 0 &&
					<div>
						<input
							type="text"
							value={search}
							onChange={e => setSearch(e.target.value)}
							placeholder="Search"
							style={{
								maxWidth: '500px',
							}}
						/>
						<ShowMoreWrapper
							isTable={true}
							columns={['User', 'Date', 'Slot']}
							list={bookings}
							initial_length={10}
							builder={(booking, index) => {
								if (!(
									matchSearch(booking.email, search)
									|| matchSearch(getDateString(booking.booking_date), search)
									|| matchSearch(
										getTimeString(booking.slot.start_time)
										+ " - "
										+ getTimeString(booking.slot.end_time), search)
								))
									return null;
							
								return <tr key={index}>
									<td>{booking.email}</td>
									<td>{getDateString(booking.booking_date)}</td>
									<td>
										<span className="time-style">
											{getTimeString(booking.slot.start_time) + " - " + getTimeString(booking.slot.end_time)}
										</span>
									</td>
									<td>
										<IconButton onClick={() => {
											setBookingRemoveId(booking.id);
										}}>
											<DeleteIcon />
										</IconButton>
									</td>
								</tr>
							}}
						/>
					</div>
					}
				</div>
		</div>
	);
}

export default EditDevice;
