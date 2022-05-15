import React, { Component } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import axios from 'axios';

export default class AddDevice extends Component {
	constructor(props) {
		super(props);
		
		this.onChangeName = this.onChangeName.bind(this);
		this.onChangeType = this.onChangeType.bind(this);
		
		this.state = {
			deviceName: '',
			deviceType: '',
			deviceSlots: [],
		};
	}
	
	onChangeName(e) {
		this.setState({
			deviceName: e.target.value,
		});
	}
	
	onChangeType(e) {
		this.setState({
			deviceType: e.target.value,
		});
	}
	
	onSubmit(e) {
		e.preventDefault();
		
		const newDevice = {
			deviceName: this.state.deviceName,
			deviceType: this.state.deviceType,
			deviceSlots: this.state.deviceSlots,
		};
		
		console.log(newDevice);
		axios.post('http://localhost:5000/devices/add', newDevice)
		
		window.location = '/';
	}
	
	render() {
		return (
			<div>
				<h1>Add Device</h1>
				<form onSubmit={this.onSubmit.bind(this)}>
					<div className='form-group'>
						<label>Device Name: </label>
						<input type='text' className='form-control' value={this.state.deviceName} onChange={this.onChangeName} />
					</div>
					<br />
					<div className='form-group'>
						<label>Device Type: </label>
						<input type='text' className='form-control' value={this.state.deviceType} onChange={this.onChangeType} />
					</div>
					<br />
					<div className='form-group'>
						<input type='submit' value='Add Device' className='btn btn-primary' />
					</div>
				</form>
			</div>
		)
	}
}