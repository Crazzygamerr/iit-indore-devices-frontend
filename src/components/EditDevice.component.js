import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { useParams } from 'react-router-dom';
import { useAuth } from '../Auth';

import { Button, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const divStyle = {
	padding: '1%',
	width: '100%',
	maxWidth: '300px',
};

const EditDevice = () => {
	const [name, setName] = useState('');
	const [type, setType] = useState('');
	const [isNew, setIsNew] = useState(true);
	const [device, setDevice] = useState(null);
	const { user } = useAuth();
	
	const { id } = useParams();
	
	async function onSubmit(e) {
		e.preventDefault();
		
		const newDevice = {
			name: name,
			type: type
		};
		
		if (isNew) {
			await supabase.from("devices")
				.insert(newDevice)
				.then(res => window.location = '/')
				.catch(err => console.log(err));
		} else {
			await supabase.from("devices")
				.update(newDevice)
				.eq("id", id)
				.then(res => window.location = '/')
				.catch(err => console.log(err));
		}
	}
	
	useEffect(() => {
		if (!id) {
			return;
		}
		supabase.from("devices").select().eq("id", id)
			.then(response => {
				setName(response.data[0].name);
				setType(response.data[0].type);
				setDevice(response.data[0]);
				setIsNew(false);
			})
			.catch(function (error) {
				console.log(error);
			});
		
	}, [id]);
	
	return (
		<div style={divStyle}>
			<h3>{ (isNew) ? "Add Device" : "Edit Device" }</h3>
			<form onSubmit={onSubmit}>
				<div className='form-group'>
					<label>Device Name: </label>
					<input type='text' name='name' className='form-control' value={name} onChange={e => setName(e.target.value)} />
				</div>
				<br />
				<div className='form-group'>
					<label>Device Type: </label>
					<input type='text' name='type' className='form-control' value={type} onChange={e => setType(e.target.value)} />
				</div>
				<br />
				<div className='form-group'>
					<Button type="submit" variant='contained'>
						{(isNew) ? "Add Device" : "Save changes"}
					</Button>
				</div>
			</form>
			{!isNew && device && device.hasOwnProperty('slots') && device.slots.length > 0 &&
				<div style={{
					width: "min-content",
					whiteSpace: "nowrap"
				}}>
				<br />
				<h4>Booked slots</h4>
					<table className='table'>
						<thead>
							<tr>
								<th>User</th>
								<th>Date</th>
							</tr>
						</thead>
						<tbody>
							{device && device.slots.map((slot, index) => (
								<tr key={index}>
									<td>
										{(slot.email === user.email ? "You" : slot.email)}
									</td>
									<td>
										{new Date(slot.date).toLocaleDateString() + "  " + new Date(slot.date).toLocaleTimeString()}
									</td>
									<td>
										<IconButton onClick={() => {
											const newSlots = device.slots.filter(s => s !== slot);
											supabase.from("devices")
												.update({
													slots: newSlots,
												})
												.eq("id", id)
												.then(res => {window.location.reload()})
												.catch(err => console.log(err));
											}}>
											<DeleteIcon />
										</IconButton>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			}
		</div>
	);
}

export default EditDevice;