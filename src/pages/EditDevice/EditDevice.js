import { Children, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../../Utils/supabaseClient';

import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { CircularProgress, IconButton, Switch, TextField } from '@mui/material';
import ConfirmDialog from '../../components/confirmDialog';
import ShowMoreWrapper from '../../components/showMoreWrapper/showMoreWrapper';
import SlotDialog from '../../components/slotDialog';
import { Spacer } from '../../components/spacer';
import Toast from '../../components/toast/toast';
import { getDateString, getTimeString } from '../../Utils/utilities';
import './EditDevice.scss';

const EditDevice = () => {
	const [device, setDevice] = useState({
		name: "",
		remarks: "",
		has_queue: false,
		for_all: true,
	});
	const [slots, setSlots] = useState([]);
	const [bookings, setBookings] = useState([]);
	const [users, setUsers] = useState([]);
	const [emailList, setEmailList] = useState([]);
	const [loading, setLoading] = useState(true);

	const [userDialog, setUserDialog] = useState(false);
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
				setBookings(bookings.filter(b => b.id !== id));
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
				has_queue: device.has_queue,
				for_all: device.for_all,
			});

		if (error) {
			setToastDetails({
				message: "An error occurred",
				isError: true
			});
			return;
		}

		if (!id) {
			if (!device.has_queue) {
				setSlots(slots.map(slot => {
					slot.device_id = data[0].id;
					if (!slot.id) {
						delete slot.id;
					}
					return slot;
				}));

				await supabase.from("slots")
					.insert(slots)
					.then(res => { })
					.catch(err => console.log(err));
			}
			
			setEmailList(emailList.map(email => {
				email.device_id = data[0].id;
				delete email.id;
				return email;
			}));

			await supabase.from("email_list")
				.insert(emailList)
				.then(res => {
					navigate("/devices");
					// console.log(res);
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
		async function fetchData() {
			if (id) {
				const { data: deviceRes, error: deviceErr } = await supabase
					.from("slots_by_device_view")
					.select("*")
					.eq("id", id);
				setDevice(deviceRes[0]);
				setSlots(deviceRes[0].slots);

				// Add slot for each booking
				if (deviceRes[0].bookings) {
					var temp = deviceRes[0].bookings;
					temp.forEach(booking => {
						booking.slot = deviceRes[0].slots.find(slot => slot.id === booking.slot_id);
					});
					temp.sort((a, b) => {
						return Date.parse(b.booking_date) - Date.parse(a.booking_date);
					});
					setBookings(temp);
				}

				const { data: emailRes, error: emailErr } = await supabase
					.from("email_list")
					.select("*")
					.eq("device_id", id);
				setEmailList(emailRes);

				if (deviceErr || emailErr) {
					console.log(deviceErr, emailErr);
					return;
				}
			}
			const { data: userRes, error: userErr } = await supabase.from("users").select("*");
			setUsers(userRes);

			if (userErr)
				console.log(userErr);
			else
				setLoading(false);
		}

		fetchData();
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
			{userDialog &&
				<div className='dialog-backdrop'>
					<div className='dialog-container' style={{ minHeight: '300px' }}>
						<h5>Add User</h5>
						<ShowMoreWrapper
							columns={[""]}
							list={users.filter(user => emailList.find(listItem => listItem.email === user.email) === undefined)}
							initial_length={5}
							condition={(user) => [user.email]}
							builder={(user, index) => (
								<tr key={user.email}>
									<td>{user.email}</td>
									<td>
										<IconButton
											aria-label="add"
											onClick={async () => {
												var temp = {
													email: user.email,
													device_id: id,
													is_queue: false,
												};
												setEmailList([...emailList, temp]);

												if (id) await supabase.from("email_list").insert(temp);
											}}
										>
											<AddIcon />
										</IconButton>
									</td>
								</tr>
							)}
						/>
						<button
							onClick={() => {
								setUserDialog(false);
							}}
						> Close </button>
					</div>
				</div>
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
				<Spacer height='10px' />
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
				{id &&
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
				}
			</div>
			<div className='card-style editDevice__card'>
				<h4>Access Control</h4>
				<div className='editDevice__queue'>
					<Switch
						checked={device.for_all}
						onChange={async() => {
							let newDevice = { ...device };
							newDevice.for_all = !device.for_all;
							setDevice(newDevice);
							if (id) {
								await supabase.from("devices").update({ for_all: newDevice.for_all }).eq('id', id);
							}
						}}
						name="hasQueue"
						inputProps={{ 'aria-label': 'secondary checkbox' }}
					/>
					<p>Available for all </p>
				</div>
				{!device.for_all &&
					<div>
						<h5>Users</h5>
						<button onClick={() => {
							setUserDialog(true);
						}}> Add User</button>
						<Spacer height='20px' />
						<ShowMoreWrapper
							columns={[""]}
							list={emailList}
							initial_length={10}
							condition={(listItem) => [listItem.email]}
							builder={(listItem, index) => (
								<tr key={listItem.email}>
									<td>{listItem.email}</td>
									<td>
										<IconButton onClick={async () => {
											setEmailList(emailList.filter(l => l.email !== listItem.email));
											if (id) {
												await supabase.from('email_list')
													.delete()
													.eq('id', listItem.id);
											}
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
							}}>Add Slot</button>
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
								return <tr key={booking.id}>
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
			{!id &&
				<div className='card-style editDevice__card'>
					<h4>Add Device?</h4>
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
			}
		</div>
	);
}

export default EditDevice;
