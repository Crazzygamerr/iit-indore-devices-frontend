import React, { Component } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import axios from 'axios';

export default class AddDevice extends Component {
	constructor(props) {
		super(props);
		
		this.onChangeName = this.onChangeName.bind(this);
		this.onChangeType = this.onChangeType.bind(this);
		
		this.state = {
			name: '',
			type: '',
			slots: [],
		};
	}
	
	onChangeName(e) {
		this.setState({
			name: e.target.value,
		});
	}
	
	onChangeType(e) {
		this.setState({
			type: e.target.value,
		});
	}
	
	onSubmit(e) {
		e.preventDefault();
		
		const newDevice = {
			name: this.state.name,
			type: this.state.type,
			slots: this.state.slots,
		};
		
		axios.post('http://localhost:5000/api/devices/add', newDevice)
		
		window.location = '/';
	}
	
	render() {
		return (
			<div>
				<h1>Add Device</h1>
				<form onSubmit={this.onSubmit.bind(this)}>
					<div className='form-group'>
						<label>Device Name: </label>
						<input type='text' className='form-control' value={this.state.name} onChange={this.onChangeName} />
					</div>
					<br />
					<div className='form-group'>
						<label>Device Type: </label>
						<input type='text' className='form-control' value={this.state.type} onChange={this.onChangeType} />
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