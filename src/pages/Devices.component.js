
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

const Devices = () => {
	const navigate = useNavigate();
	const { user } = useAuth();
	
	const [devices, setDevices] = useState([]);
	const [loading, setLoading] = useState(true);
	
	useEffect(() => {

		supabase.from("devices")
			.select(`
				id,
				name,
				equipment: equipment_id (name)
				`)
			.then(response => {
				console.log(response.data);
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
			{loading && <CenteredDiv>
				<CircularProgress />
			</CenteredDiv>}
			{!loading &&
				<div style={{
					width: 'min-content',
					whiteSpace: 'nowrap'
				}}>
					<table>
						<thead>
							<tr>
								<th>Device Name</th>
								<th>Equipment</th>
							</tr>
						</thead>
						<tbody>
							{devices.map(currentDevice => {
								return (
									<tr key={currentDevice.id}>
										<td>{currentDevice.name}</td>
										<td>{currentDevice.equipment.name}</td>
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
				</div>
			}
		</div>
	);
}

export default Devices;
