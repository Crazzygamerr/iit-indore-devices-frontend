
import React, { useState, useEffect } from "react";

import { Container } from "react-bootstrap";

import axios from "axios";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import "bootstrap/dist/css/bootstrap.min.css";

import "./Home.component.css";

const removeDevice = () => {
	//axios.delete("http://localhost:5000/api/devices/1");
	
};

const Home = () => {
	const navigate = useNavigate();
	const [devices, setDevices] = useState([]);
	
	useEffect(() => {
		axios.get('http://localhost:5000/api/devices/')
			.then(response => {
				setDevices(response.data);
			})
			.catch(function (error) {
				console.log(error);
			})
	});
	
	return (
		<Container fluid>
			<h1>Device List</h1>
			<table className='table' >
				<thead className='thead-light'>
					<tr>
						<th>Device Name</th>
						<th>Device Type</th>
						<th>Device Slots</th>
					</tr>
				</thead>
				<tbody>
					{devices.map(function (currentDevice, i) {
						return (
							<tr key={i}>
								<td>{currentDevice.name}</td>
								<td>{currentDevice.type}</td>
								<td>{currentDevice.slots}</td>
								<td className="fit">
									<Button onClick={() => navigate("/editDevice/" + currentDevice._id)}>
											Edit
										</Button>
								</td>
								<td className="fit">
									<Button onClick={() => removeDevice()}>
										Remove
									</Button>
								</td>
							</tr>
						)
					})}
				</tbody>
			</table>
		</Container>
	);
}

export default Home;
