import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../Utils/supabaseClient';

import DeleteIcon from '@mui/icons-material/Delete';
import { CircularProgress, IconButton } from '@mui/material';
import { getDateString, getTimeString, matchSearch } from '../Utils/utilities';
import ShowMoreWrapper from '../components/showMoreWrapper/showMoreWrapper';

const EditDevice = () => {
	const [device, setDevice] = useState({ name: "" });
	const [equipment, setEquipment] = useState([]);
	const [bookings, setBookings] = useState([]);
	const [loading, setLoading] = useState(true);
	const [search, setSearch] = useState("");
	const [length, setLength] = useState(10);

	const { id } = useParams();
	let navigate = useNavigate();

	async function saveDevice() {
		await supabase.from("devices")
			.upsert(device)
			.then(res => {
				navigate("/devices");
			})
			.catch(err => console.log(err));
	}

	useEffect(() => {
		if (id) {
			supabase.from("devices").select().eq("id", id)
				.then(response => {
					// setName(response.data[0].name);
					setDevice(response.data[0]);
				})
				.catch(function (error) {
					console.log(error);
				});

			supabase.from("bookings")
				.select(`
				id,
				booking_date,
				email,
				slot: slots (
					id,
					start_time,
					end_time
				)`)
				.eq("device_id", id)
				.order("booking_date", {ascending: false})
				.then(response => {
					console.log(response);
					setBookings(response.data);
				}).catch(error => console.log(error));
		}

		supabase.rpc("get_slots_by_equipment")
			.then(response => {
				setEquipment(response.data);
				if (!id) {
					setDevice({ name: "", equipment_id: response.data[0].equipment_id });
				}
				setLoading(false);
			})
			.catch(error => console.log(error));

	}, [id]);

	return (
		<div style={{
			padding: '1%',
		}}>
			<h3>{(!id) ? "Add Device" : "Edit Device"}</h3>
			<div
				className="card-style"
				style={{
					maxWidth: '300px',
				}}>
				<label>Device Name: </label>
				<input
					type='text'
					name='name'
					value={device.name}
					required
					maxLength={30}
					onChange={e => {
						let newDevice = { ...device };
						newDevice.name = e.target.value;
						setDevice(newDevice);
					}} />
			</div>
			<br />
			<div>
				<h4>Equipment</h4>
				{loading &&
					<div className='centered-div'>
						<CircularProgress />
					</div>
				}
				{!loading &&
					<table>
						<thead>
							<tr>
								<th></th>
								<th>Name</th>
								<th>Slots</th>
							</tr>
						</thead>
						<tbody>
							{equipment.map(equipment => (
								<tr key={equipment.equipment_id}>
									<td>
										<input
											type="radio"
											name="equipment"
											checked={device.equipment_id == equipment.equipment_id}
											value={equipment.equipment_id}
											onChange={e => {
												let newDevice = { ...device };
												newDevice.equipment_id = e.target.value;
												setDevice(newDevice);
											}} />
									</td>
									<td>{equipment.equipment_name}</td>
									<td>
										{equipment.slots &&
											equipment.slots.map(slot => (
												<span key={slot.id} className="time-style">
													{getTimeString(slot.start_time) + " - " + getTimeString(slot.end_time)}
												</span>
											))
										}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				}
			</div>
			<div style={{
				marginTop: '20px',
			}}></div>
			{id &&
				<h4>Bookings</h4>
			}
			{loading &&
				<div className='centered-div'>
					<CircularProgress />
				</div>
			}
			{!loading && id &&
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
						length={length}
						setLength={setLength}
						list_length={bookings.length}>
						<table>
							<thead>
								<tr>
									<th>User</th>
									<th>Date</th>
									<th>Slot</th>
								</tr>
							</thead>
							<tbody>
								{bookings.length > 0 && bookings.map((booking, index) => {
									
									if (index >= length) return null;
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
												supabase.from("bookings")
													.delete()
													.eq("id", booking.id)
													.then(response => {
														setBookings(bookings.filter(b => b.id != booking.id));
													}).catch(error => console.log(error));
											}}>
												<DeleteIcon />
											</IconButton>
										</td>
									</tr>
								})}
							</tbody>
						</table>
					</ShowMoreWrapper>
				</div>
			}
			<div style={{
				marginTop: '20px',
			}}></div>
			<button type="submit" variant='contained' onClick={saveDevice}>
				{(!id) ? "Add Device" : "Save changes"}
			</button>
		</div>
	);
}

export default EditDevice;