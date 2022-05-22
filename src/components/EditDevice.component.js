import React, { useEffect, useState } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import { supabase } from '../supabaseClient';
import { useParams } from 'react-router-dom';
import { useAuth } from '../Auth';
import { Button } from 'react-bootstrap';

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
		<div>
			<h1>{ (isNew) ? "Add Device" : "Edit Device" }</h1>
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
					<input type='submit' value={ (isNew) ? "Add Device" : "Save changes" } className='btn btn-primary' />
				</div>
			</form>
			<br />
			<h2>Booked slots</h2>
			<ul>
				{device && device.slots.map((slot, index) => (
					<li key={index}>
						{(slot.email === user.email ? "You" : slot.email) + ": "}
						{new Date(slot.date).toLocaleDateString() + "  " + new Date(slot.date).toLocaleTimeString()}
						<Button onClick={() => {
							const newSlots = device.slots.filter(s => s !== slot);
							supabase.from("devices")
								.update({
									slots: newSlots,
								})
								.eq("id", id)
								.then(res => {window.location.reload()})
								.catch(err => console.log(err));
						}
						}>Remove</Button>
					</li>
				))}
			</ul>
		</div>
	);
}

export default EditDevice;