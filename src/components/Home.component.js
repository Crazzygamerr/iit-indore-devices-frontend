
import React, { Component } from "react";
import { View } from "react-native";

import { Container } from "react-bootstrap";

import axios from "axios";
import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";

export default class Home extends Component {
	constructor(props) {
		super(props);
		
		this.state = {
			devices: [],
		};
	}
	
	componentDidMount() {
		axios.get('http://localhost:5000/api/devices/')
			.then(response => {
				this.setState({ devices: response.data });
			})
			.catch(function (error) {
				console.log(error);
			})
	}
	
	render() {
		return (
			<Container fluid>
				<h1>Device List</h1>
				<table className='table'>
					<thead className='thead-light'>
						<tr>
							<th>Device Name</th>
							<th>Device Type</th>
							<th>Device Slots</th>
						</tr>
					</thead>
					<tbody>
						{this.state.devices.map(function (currentDevice, i) {
							return (
								<tr key={i}>
									<td>{currentDevice.name}</td>
									<td>{currentDevice.type}</td>
									<td>{currentDevice.slots}</td>
									<td>
										<View style={{ backgroundColor: "red",  justifyContent: "space-evenly"}}>
											<Link to={"/editDevice" + currentDevice._id}>
												<Button>
													Edit
												</Button>
											</Link>
											
											<Link to="/addDevice">
												<Button>
													Edit
												</Button>
											</Link>
										</View>
									</td>
								</tr>
							)
						})}
					</tbody>
				</table>
			</Container>
		);
	}
}
