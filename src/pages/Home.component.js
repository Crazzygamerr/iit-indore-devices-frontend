
import React, { useState, useEffect } from "react";

import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Auth";

import { Button, IconButton, CircularProgress } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import styled from "styled-components";

const CenteredDiv = styled.div`
	width: 100%;
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 1%;
	`;

const FitStyle = {
	whiteSpace: 'nowrap',
  width: '1%'
};
	
function removeDevice(id) {
	supabase.from("devices")
		.delete()
		.eq("id", id)
		.then(response => {
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
		<div style={{padding: "1%"}}>
			<h3>Device List</h3>
			{/* <Button onClick={() => {
				supabase.rpc("bookDevice", {
					device_id: 1,
					email: user.email,
					booking_time: Date.now(),
				}).then(response => {
					console.log(response);
				});
			}}>Call</Button> */}
			{loading && <CenteredDiv>
				<CircularProgress />
			</CenteredDiv>}
			{!loading &&
				<table className='table'>
					<thead className='thead-light'>
						<tr>
							<th>Device Name</th>
						</tr>
					</thead>
					<tbody>
						{devices.map(function (currentDevice, i) {
							return (
								<tr key={i}>
									<td>{currentDevice.name}</td>
									{ user && !user.isAdmin &&
										<td style={FitStyle}>
											<Button variant="contained" onClick={() => navigate("/bookDevice/" + currentDevice.id)}>
												Book
											</Button>
										</td>
									}
									{ user && user.isAdmin &&
										<td style={FitStyle}>
											<IconButton onClick={() => navigate("/editDevice/" + currentDevice.id)}>
													<EditIcon />
												</IconButton>
										</td>
									}
									{ user && user.isAdmin &&
										<td style={FitStyle}>
											<IconButton aria-label="delete" onClick={() => removeDevice(currentDevice.id)}>
												<DeleteIcon />
											</IconButton>
										</td>
									}
								</tr>
							)
						})}
					</tbody>
				</table>
			}
		</div>
	);
}

export default Home;
