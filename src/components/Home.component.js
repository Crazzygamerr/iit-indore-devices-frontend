
import React, { useState, useEffect } from "react";

import { Container } from "react-bootstrap";

import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Button, Spinner } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

import "./Home.component.css";

function removeDevice(id) {
	axios
		.delete("http://localhost:5000/api/devices/" + id)
		.then(res => console.log(res.data))
		.catch(err => console.log(err));
}

const Home = () => {
	const navigate = useNavigate();
	const [devices, setDevices] = useState([]);
	const [loading, setLoading] = useState(true);
	
	useEffect(() => {
		axios.get('http://localhost:5000/api/devices/')
			.then(response => {
				setDevices(response.data);
				setLoading(false);
			})
			.catch(function (error) {
				console.log(error);
				setLoading(false);
			})
	});
	
	return (
		<Container fluid>
			<h1>Device List</h1>
			{loading && <Spinner animation="border" role="status">
				<span className="visually-hidden">Loading...</span>
			</Spinner> }
			{ !loading && <table className='table'>
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
									<Button onClick={() => removeDevice(currentDevice._id)}>
										Remove
									</Button>
								</td>
							</tr>
						)
					})}
				</tbody>
			</table> }
		</Container>
	);
}

export default Home;
