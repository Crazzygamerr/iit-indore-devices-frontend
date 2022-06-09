import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { useParams } from 'react-router-dom';
import { useAuth } from '../Auth';

import { TextField, Button, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { Spacer } from '../components/spacer.component';

const divStyle = {
	padding: '1%',
	width: '100%',
	maxWidth: '300px',
};

const cardStyle = {
	boxShadow: '4px 4px 8px 0 rgba(0, 0, 0, 0.4)',
	padding: '5%',
	borderRadius: '5px',
	width: '100%',
};

const EditDevice = () => {
	const [name, setName] = useState('');
	const [device, setDevice] = useState(null);
	const [isNew, setIsNew] = useState(true);
	const [startTime, setStartTime] = useState(Date.now());
	const [endTime, setEndTime] = useState(Date.now() + 3600000);
	const [slots, setSlots] = useState([]);
	
	const { user } = useAuth();
	
	const { id } = useParams();
	
	async function saveDevice() {
		
		const newDevice = {
			name: name,
		};
		
		if (isNew) {
			await supabase.from("devices")
				.insert(newDevice)
				.then(res => setDevice(res.data[0]))
				.catch(err => console.log(err));
		} else {
			await supabase.from("devices")
				.update(newDevice)
				.eq("id", id)
				.catch(err => console.log(err));
		}
		
		setSlots(slots.map(slot => {
			slot.device_id = device.id;
			return slot;
		}));
		
		await supabase.from("slots")
			.insert(slots, { upsert: true })
			.then(res => window.location = '/')
			.catch(err => console.log(err));
		
	}
	
	useEffect(() => {
		if (!id) {
			return;
		}
		supabase.from("devices").select().eq("id", id)
			.then(response => {
				setName(response.data[0].name);
				setDevice(response.data[0]);
				setIsNew(false);
			})
			.catch(function (error) {
				console.log(error);
			});
		
		supabase.from("slots").select().eq("device_id", id)
			.then(response => {
				setSlots(response.data);
			});
		
	}, [id]);
	
	return (
		<div style={divStyle}>
			<h3>{ (isNew) ? "Add Device" : "Edit Device" }</h3>
			<div style={cardStyle}>
				<div>
					<label>Device Name: </label>
					<input type='text' name='name' className='form-control' value={name} onChange={e => setName(e.target.value)} />
				</div>
			</div>
			<br />
			<div style={cardStyle}>
				<h5>Add slot</h5>
				<Spacer height='10px' />
				<LocalizationProvider dateAdapter={AdapterDateFns}>
					<TimePicker
						renderInput={(props) => <TextField {...props} />}
						label="Start Time"
						value={startTime}
						onChange={(newValue) => {
							setStartTime(newValue);
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
							setEndTime(newValue);
						}}
					/>
				</LocalizationProvider>	
				<Spacer height='20px' />
				<div style={{display: 'flex', justifyContent: 'flex-end'}}>
					<Button variant='contained' onClick={() => {
						setSlots([...slots, {
							start_time: startTime,
							end_time: endTime,
						}]);
					}}>
						Add Slot
					</Button>
				</div>
			</div>
			<br />
			<div style={{
				width: "min-content",
				whiteSpace: "nowrap",
			}}>
				<h4>Slots</h4>
				<table className='table'>
					<thead>
						<tr>
							<th>Start time</th>
							<th>End time</th>
							<th>User</th>
						</tr>
					</thead>
					<tbody>
						{ slots.map((slot, index) => (
							<tr key={index}>
								<td>
									{new Date(slot.start_time).toLocaleTimeString(
										'en-US',
										{hour: 'numeric', minute: 'numeric', hour12: true}
									)}
								</td>
								<td>
									{new Date(slot.end_time).toLocaleTimeString(
										'en-US',
										{hour: 'numeric', minute: 'numeric', hour12: true}
									)}
								</td>
								<td>
									{( slot.email === user.email ? "You" : slot.email)}
									{(slot.email) && 
										<IconButton aria-label="delete" onClick={() => {
											setSlots(slots.map((s, i) => {
												if (i === index) {
													s.email = "";
												}
												return s;
											}
											));
										}}>
											<DeleteIcon fontSize="small" />
										</IconButton>
									}
								</td>
								<td>
									<IconButton onClick={() => {
										setSlots(slots.filter((s, i) => i !== index));
										}}>
										<DeleteIcon />
									</IconButton>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
			<div style={{ display: 'flex', justifyContent: 'flex-end', }}>
				<Button type="submit" variant='contained' onClick={saveDevice}>
					{(isNew) ? "Add Device" : "Save changes"}
				</Button>
			</div>
		</div>
	);
}

export default EditDevice;