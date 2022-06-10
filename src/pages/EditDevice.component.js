import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { useParams } from 'react-router-dom';

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
	const [device, setDevice] = useState({name: ""});
	const [startTime, setStartTime] = useState(Date.now());
	const [endTime, setEndTime] = useState(Date.now() + 3600000);
	const [slots, setSlots] = useState([]);
	const [dbSlots, setDbSlots] = useState([]);
	
	const { id } = useParams();
	
	async function saveDevice() {
		
		await supabase.from("devices")
			.upsert(device)
			.then(res => {
				console.log(res);
				setDevice(res.data[0]);
			})
			.catch(err => console.log(err));
		
		
		setSlots(slots.map(slot => {
			slot.device_id = device.id;
			return slot;
		}));
		
		//get slots present in slots but not in dbSlots
		var newSlots = slots.filter(slot => !slot.id);
		await supabase.from("slots")
			.insert(newSlots)
			.then(res => { })
			.catch(err => console.log(err));
		
		//get slots present in both slots and dbSlots
		/* var updatedSlots = slots.filter(slot => dbSlots.current.some(dbSlot => dbSlot.id === slot.id));
		await supabase.from("slots")
			.upsert(updatedSlots)
			.catch(err => console.log(err)); */
		
		//get slots present in dbSlots but not in slots
		/* var deletedSlots = dbSlots.filter(dbSlot => !slots.some(slot => slot.id === dbSlot.id));
		await supabase.from("slots")
			.delete()
			.in("id", deletedSlots.map(slot => slot.id))
			.then(res => {
				// window.location = '/';
				
			})
			.catch(err => console.log(err)); */
	}
	
	useEffect(() => {
		if (!id) {
			return;
		}
		supabase.from("devices").select().eq("id", id)
			.then(response => {
				// setName(response.data[0].name);
				setDevice(response.data[0]);
			})
			.catch(function (error) {
				console.log(error);
			});
		
		supabase.from("slots").select().eq("device_id", id)
			.then(response => {
				setSlots(response.data);
				setDbSlots(response.data);
			});
		
	}, [id]);
	
	return (
		<div style={divStyle}>
			<h3>{ (!device) ? "Add Device" : "Edit Device" }</h3>
			<div style={cardStyle}>
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
			<div style={cardStyle}>
				<h5>Add slot</h5>
				<Spacer height='10px' />
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
				<div style={{display: 'flex', justifyContent: 'flex-end'}}>
					<Button variant='contained' onClick={() => {
						
						const startTimeString = new Date(startTime).toLocaleTimeString('en-US', { hour12: false }).substring(0, 5);
						const endTimeString = new Date(endTime).toLocaleTimeString('en-US', { hour12: false }).substring(0, 5);
						
						setSlots([...slots, {
							start_time: startTimeString,
							end_time: endTimeString,
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
						</tr>
					</thead>
					<tbody>
						{ slots.map((slot, index) => (
							<tr key={index}>
								<td>
									{new Date('1970-01-01T' + slot.start_time + 'Z')
										.toLocaleTimeString('en-US',
											{timeZone:'UTC',hour12:true,hour:'numeric',minute:'numeric'}
										)}
								</td>
								<td>
									{new Date('1970-01-01T' + slot.end_time + 'Z')
										.toLocaleTimeString('en-US',
											{timeZone:'UTC',hour12:true,hour:'numeric',minute:'numeric'}
										)}
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
					{(!device) ? "Add Device" : "Save changes"}
				</Button>
			</div>
		</div>
	);
}

export default EditDevice;