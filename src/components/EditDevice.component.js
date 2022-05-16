import React, { useEffect, useState } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import axios from 'axios';
import { useParams } from 'react-router-dom';

const EditDevice = () => {
	const [name, setName] = useState('');
	const [type, setType] = useState('');
	const [slots, setSlots] = useState([]);
	
	const { id } = useParams();
	const [isNew, setIsNew] = useState(true);
	
	const handleChange = (event) => {
		const { name, value } = event.target;
		if (name === 'name') {
			setName(value);
		} else if (name === 'type') {
			setType(value);
		} 
	};
	
	const onSubmit = (e) => {
		e.preventDefault();
		
		const newDevice = {
			name: name,
			type: type,
			slots: slots,
		};
		
		if (isNew) {
			axios.post('http://localhost:5000/api/devices/add', newDevice)
				.then(res => window.location = '/')
				.catch(err => console.log(err));
		} else {
			axios.post('http://localhost:5000/api/devices/update/' + id, newDevice)
				.then(res => window.location = '/')
				.catch(err => console.log(err));
		}
		
	}
	
	useEffect(() => {
		if (!id) {
			return;
		}
		axios.get('http://localhost:5000/api/devices/' + id)
			.then(response => {
				setName(response.data.name);
				setType(response.data.type);
				setSlots(response.data.slots);
				
				setIsNew(false);
			})
			.catch(function (error) {
				console.log(error);
			})
	}, [id]);
	
	return (
		<div>
			<h1>{ (isNew) ? "Add Device" : "Edit Device" }</h1>
			<form onSubmit={onSubmit}>
				<div className='form-group'>
					<label>Device Name: </label>
					<input type='text' name='name' className='form-control' value={name} onChange={handleChange} />
				</div>
				<br />
				<div className='form-group'>
					<label>Device Type: </label>
					<input type='text' name='type' className='form-control' value={type} onChange={handleChange} />
				</div>
				<br />
				<div className='form-group'>
					<input type='submit' value={ (isNew) ? "Add Device" : "Edit Device" } className='btn btn-primary' />
				</div>
			</form>
		</div>
	);
}

export default EditDevice;