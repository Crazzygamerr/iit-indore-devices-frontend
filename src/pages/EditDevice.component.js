import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../supabaseClient';

import { Button, CircularProgress } from '@mui/material';
import { getTimeString } from '../components/utils';
import { IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

import './editDevice.css';

const divStyle = {
	padding: '1%',
	width: '100%',
	maxWidth: '300px',
};

const timeStyle = {
	boxShadow: '4px 4px 8px 0 rgba(0, 0, 0, 0.4)',
	padding: '2%',
	borderRadius: '25px',
	width: '100%',
	fontSize: '0.75em',
	marginRight: '4%',
}

const EditDevice = () => {
	const [device, setDevice] = useState({ name: "" });
	const [equipment, setEquipment] = useState([]);
	const [bookings, setBookings] = useState([]);
	const [loading, setLoading] = useState(true);

	const { id } = useParams();

	async function saveDevice() {
		await supabase.from("devices")
			.upsert(device)
			.then(res => {
				window.location = '/';
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
		}

		supabase.rpc("get_slots_by_equipment")
			.then(response => {
				setEquipment(response.data);
				setLoading(false);
			})
			.catch(error => console.log(error));
		
		supabase.from("bookings")
			.select()
			.eq("device_id", id)
			.then(response => {
				setBookings(response.data);
			}).catch(error => console.log(error));

	}, [id]);

	return (
		<div style={divStyle}>
			<h3>{(!device) ? "Add Device" : "Edit Device"}</h3>
			<div className="card-style">
				<label>Device Name: </label>
				<input
					type='text'
					name='name'
					value={device.name}
					onChange={e => {
						let newDevice = { ...device };
						newDevice.name = e.target.value;
						setDevice(newDevice);
					}} />
			</div>
			<br />
			<div style={{
				width: "min-content",
				whiteSpace: "nowrap",
			}}>
				<h4>Equipment</h4>
				{loading &&
					<div>
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
												<span key={slot.id} style={timeStyle}>
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
			}}>
			<h4>Slots</h4>
			{loading &&
				<div>
					<CircularProgress />
				</div>
				}
				{!loading &&
					<table>
						<thead>
							<tr>
								<th>Slot</th>
								<th>User</th>
							</tr>
						</thead>
						<tbody>
							{bookings.map((booking, index) => (
								<tr key={index}>
									<td>
										<span style={timeStyle}>
											{/* {getTimeString(slot.start_time) + " - " + getTimeString(slot.end_time)} */}
										</span>
									</td>
									<td>{booking.email}</td>
									<td>
										<IconButton onClick={() => {
											// setSlots(slots.filter((s, i) => i !== index));
										}}>
											<DeleteIcon />
										</IconButton>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				}
				<div style={{
					marginTop: '20px',
				}}></div>
				<Button type="submit" variant='contained' onClick={saveDevice}>
					{(!id) ? "Add Device" : "Save changes"}
				</Button>
			</div>
		</div>
	);
}

export default EditDevice;