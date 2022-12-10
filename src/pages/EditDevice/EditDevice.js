import { Children, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../../Utils/supabaseClient';

import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { CircularProgress, IconButton, Switch, TextField } from '@mui/material';
import { Spacer } from '../../components/spacer';
import { getDateString, getTimeString, matchSearch } from '../../Utils/utilities';
import ShowMoreWrapper from '../../components/showMoreWrapper/showMoreWrapper';
import ConfirmDialog from '../../components/confirmDialog';
import Toast from '../../components/toast/toast';
import './EditDevice.scss';
import SlotDialog from '../../components/slotDialog';

const EditDevice = () => {
	const [device, setDevice] = useState({
		name: "",
		remarks: "",
		has_queue: false,
		for_all: true,
	});
	const [slots, setSlots] = useState([]);
	const [bookings, setBookings] = useState([]);
	const [emailList, setEmailList] = useState([]);
	const [loading, setLoading] = useState(true);
	
	const [addUserDialog, setAddUserDialog] = useState(true);
	const [bookingRemoveId, setBookingRemoveId] = useState(null);
	const [slotDialog, setSlotDialog] = useState(null);
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
		//! Allow duplicate device names for now
		// if (!id) {
		// 	const { data, error } = await supabase
		// 		.from("devices")
		// 		.select()
		// 		.eq("name", device.name);
		// 	if (error) {
		// 		setToastDetails({ message: "An error occurred", isError: true });
		// 		return;
		// 	}
		// 	if (data.length > 0) {
		// 		setToastDetails({ message: "Device already exists", isError: true });
		// 		return;
		// 	}
		// }
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
		
		if (!id && !device.has_queue) {
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
	
	async function addSlot(slot_id, startTime, endTime) {
		const startTimeString = new Date(startTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).substring(0, 5);
		const endTimeString = new Date(endTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).substring(0, 5);
		if (slot_id === -1) {
			setSlots([...slots, {
				id: slots.length + 1,
				start_time: startTimeString,
				end_time: endTimeString,
				device_id: id,
			}]);
		} else {
			slots.find(slot => slot.id === slot_id).start_time = startTimeString
			slots.find(slot => slot.id === slot_id).end_time = endTimeString
			setSlots([...slots]);
		}
	}
	
	useEffect(() => {
		if (id) {
			supabase.rpc("get_device",
				{
					param_id: id,
				})
				.then(response => {
					console.log(response);
					setDevice(response.data);
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
	
	if (loading) {
		return <div className='loadingDiv'>
			<CircularProgress />
		</div>;
	}
	return (
		<div className='editDevice'>
			
			<Toast toastDetails={toastDetails} />
			{slotDialog &&
				<SlotDialog
					addSlot={addSlot}
					slot={slotDialog}
					setSlotDialogId={setSlotDialog}
				/>
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
			
			<h3>{(!id) ? "Add Device" : "Edit Device"}</h3>
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
				{!id &&
					<div className='editDevice__queue'>
						<Switch
							checked={device.has_queue}
							onChange={() => {
								let newDevice = { ...device };
								newDevice.has_queue = !device.has_queue;
								setDevice(newDevice);
							}}
							name="hasQueue"
							inputProps={{ 'aria-label': 'secondary checkbox' }}
						/>
						<p>Device has a queue </p>
					</div>
				}
			</div>
			<div className='card-style editDevice__card'>
				<h4>Allowed Users</h4>
				<div className='editDevice__queue'>
					<Switch
						checked={device.for_all}
						onChange={() => {
							let newDevice = { ...device };
							newDevice.for_all = !device.for_all;
							setDevice(newDevice);
						}}
						name="hasQueue"
						inputProps={{ 'aria-label': 'secondary checkbox' }}
					/>
					<p>Available for all </p>
				</div>
				{!device.for_all &&
					<div>
						<button
							onClick={() => {
								setSlotDialog({});
							}}
						>
							Add User
						</button>
						<ShowMoreWrapper
							columns={["No.", "Name", "Email"]}
							list={emailList.filter(user => user.is_queue === false)}
							initial_length={10}
							builder={(user, index) => (
								<tr key={user.id}>
									<td>{index + 1}</td>
									<td>{user.name}</td>
									<td>{user.email}</td>
									<td>
										<IconButton onClick={() => {
											setEmailList(emailList.where('id', '!=', user.id));
										}}>
											<DeleteIcon />
										</IconButton>
									</td>
								</tr>
							)}
						/>
					</div>
				}
			</div>
			{!device.has_queue &&
				<div className='card-style editDevice__card'>
					<h4>Slots</h4>
					<div>
						{!id &&
							<button onClick={() => {
								setSlotDialog({});
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
														setSlotDialog(slot);
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
				</div>
			}
			{id &&
				<div className='card-style editDevice__card'>
					<h4>Bookings</h4>
					{!(bookings.length > 0) &&
						<div>
							No bookings yet!
						</div>
					}
					{bookings.length > 0 &&
						<ShowMoreWrapper
							columns={['User', 'Date', 'Slot']}
							list={bookings}
							initial_length={10}
							condition={(booking) => [booking.email, getDateString(booking.booking_date), getTimeString(booking.slot.start_time, booking.slot.end_time)]}
							builder={(booking, index) => {								
								return <tr key={index}>
									<td>{booking.email}</td>
									<td>{getDateString(booking.booking_date)}</td>
									<td>
										{getTimeString(booking.slot.start_time, booking.slot.end_time)}
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
						}
				</div>
			}
			<div className='card-style editDevice__card'>
				<h4>{(id) ? "Save" : "Add" } Device?</h4>
				<div className='editDevice__saveButtonDiv'>
					<button type="submit" onClick={() => navigate('/devices')}>
						Cancel
					</button>
					<button type="submit" onClick={() => {
						saveDevice();
					}}>
						Confirm
					</button>
				</div>
			</div>
		</div>
	);
}

export default EditDevice;
