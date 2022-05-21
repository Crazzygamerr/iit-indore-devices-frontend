
import React, { useState, useEffect } from "react";

import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Auth";

import { Container } from "react-bootstrap";
import { Button, Spinner } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Home.component.css";


function removeDevice(id) {
	supabase.from("devices")
		.delete()
		.eq("id", id)
		.then(response => {
			console.log(response);
			window.location.reload();
		})
		.catch(function (error) {
			console.log(error);
		});
}

const Home = () => {
	const navigate = useNavigate();
	const [devices, setDevices] = useState([]);
	const [loading, setLoading] = useState(true);
	const { user } = useAuth();
	
	useEffect(() => {
		supabase.from("devices").select()
			.then(response => {
				setDevices(response.data);
				setLoading(false);
			})
			.catch(function (error) {
				console.log(error);
				setLoading(false);
			});
	}, []);
	
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
					</tr>
				</thead>
				<tbody>
					{devices.map(function (currentDevice, i) {
						return (
							<tr key={i}>
								<td>{currentDevice.name}</td>
								<td>{currentDevice.type}</td>
								<td className="fit">
									<Button onClick={() => navigate("/bookDevice/" + currentDevice.id)}>
											Book
										</Button>
								</td>
								{ user.isAdmin &&
									<td className="fit">
										<Button onClick={() => navigate("/editDevice/" + currentDevice.id)}>
												Edit
											</Button>
									</td>
								}
								{ user.isAdmin &&
									<td className="fit">
										<Button onClick={() => removeDevice(currentDevice.id)}>
											Remove
										</Button>
									</td>
								}
							</tr>
						)
					})}
				</tbody>
			</table> }
		</Container>
	);
}

export default Home;
