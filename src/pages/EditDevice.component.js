import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { useParams } from 'react-router-dom';

import { TextField, Button, IconButton, CircularProgress } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { Spacer } from '../components/spacer.component';
import { getDateString } from '../components/utils';

import './editDevice.css';

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

const timeStyle = {
	boxShadow: '4px 4px 8px 0 rgba(0, 0, 0, 0.4)',
	padding: '2%',
	borderRadius: '25px',
	width: '100%',	
	fontSize: '0.75em',
	marginRight: '4%',
}

const EditDevice = () => {
	const [device, setDevice] = useState({name: ""});
	const [startTime, setStartTime] = useState(Date.now());
	const [endTime, setEndTime] = useState(Date.now() + 3600000);
	const [equipment, setEquipment] = useState([]);
	const [loading, setLoading] = useState(true);
	
	const { id } = useParams();
	
	async function saveDevice() {
		// var ret_id;
		await supabase.from("devices")
			.upsert(device)
			.then(res => {
				window.location = '/';
			})
			.catch(err => console.log(err));
		
		/* if (!id) {
			setSlots(slots.map(slot => {
				slot.device_id = ret_id;
				return slot;
			}));
			await supabase.from("slots")
				.insert(slots)
				.then(res => window.location = "/")
				.catch(err => console.log(err));
		} else {
			window.location = "/";
		} */
	}
	
	/* async function addSlot() {
		const startTimeString = new Date(startTime).toLocaleTimeString('en-US', { hour12: false }).substring(0, 5);
		const endTimeString = new Date(endTime).toLocaleTimeString('en-US', { hour12: false }).substring(0, 5);
						
		if (id) {
			supabase.from("slots").insert({
				start_time: startTimeString,
				end_time: endTimeString,
				device_id: device.id,
			}).then(res => {
				setSlots([...slots, {
					start_time: startTimeString,
					end_time: endTimeString,
					device_id: device.id,
				}]);
			}).catch(err => console.log(err));
		} else {
			setSlots([...slots, {
				start_time: startTimeString,
				end_time: endTimeString,
			}]);
		}
	} */
	
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
		
		supabase.from("slots")
			.select(`
				id,
				start_time,
				end_time,
				equipment: equipment_id(
					id,
					name
				)
			`)
			.order("start_time")
			.then(response => {
				var temp_equipment = [];
				response.data.forEach(slot => {
					if (!temp_equipment.some(equipment => equipment.id === slot.equipment.id)) {
						temp_equipment.push({
							id: slot.equipment.id,
							name: slot.equipment.name,
							slots: [],
						});
					}
					
					temp_equipment.find(equipment => equipment.id === slot.equipment.id).slots.push({
						id: slot.id,
						start_time: slot.start_time,
						end_time: slot.end_time,
					});
				});
				setEquipment(temp_equipment);
				setLoading(false);
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
			{/* <div style={cardStyle}>
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
					<Button variant='contained' onClick={() => {addSlot();}}>
						Add Slot
					</Button>
				</div>
			</div> */}
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
				{ !loading &&
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
								<tr key={equipment.id}>
									<td>
										<input
											type="radio"
											name="equipment"
											checked={device.equipment_id == equipment.id}
											value={equipment.id}
											onChange={e => {
												let newDevice = { ...device };
												newDevice.equipment_id = e.target.value;
												setDevice(newDevice);
											}} />
									</td>
									<td>{equipment.name}</td>
									<td>
										{equipment.slots.map(slot => (
											<span key={slot.id} style={timeStyle}>
												{getDateString(slot.start_time) + " - " + getDateString(slot.end_time)}
											</span>
										))}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				}
				{/* radio buttons to select equipment */}
				{/* <h4>Slots</h4>
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
										if (id) {
											supabase.from("slots")
												.delete().eq("id", slot.id)
												.then(res => {
													setSlots(slots.filter((s, i) => i !== index));
												}).catch(err => console.log(err));
										} else {
											setSlots(slots.filter((s, i) => i !== index));
										}
										}}>
										<DeleteIcon />
									</IconButton>
								</td>
							</tr>
						))}
					</tbody>
				</table> */}
			</div>
			<div style={{
				marginTop: '20px',
			}}>
				<Button type="submit" variant='contained' onClick={saveDevice}>
					{(!id) ? "Add Device" : "Save changes"}
				</Button>
			</div>
		</div>
	);
}

export default EditDevice;