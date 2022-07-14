import React, { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";
import { supabase } from "../Utils/supabaseClient";

import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { CircularProgress, IconButton } from "@mui/material";
import ShowMoreWrapper from "../components/showMoreWrapper/showMoreWrapper";

const FitStyle = {
	whiteSpace: 'nowrap',
	maxWidth: '1%'
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

	const [devices, setDevices] = useState([]);
	const [length, setLength] = useState(10);

	useEffect(() => {

		supabase.from("devices")
			.select(`
				id,
				name,
				equipment: equipment_id (name)
				`)
			.then(response => {
				setDevices(response.data);
			})
			.catch(function (error) {
				console.log(error);
			});

	}, []);

	return (
		<div style={{
			padding: "1%",
		}}>
			<h3>Device List</h3>
			{devices.length === 0 && <div className='centered-div'>
				<CircularProgress />
			</div>}
			<div>
				<button onClick={() => navigate("/addDevice")}>+ Add Device</button>
			</div>
			{devices.length !== 0 &&
				<ShowMoreWrapper
					length={length}
					setLength={setLength}
					list_length={devices.length}>
					<div style={{
						overflowX: 'auto',
					}}>
						<table>
							<thead>
								<tr>
									<th>Device Name</th>
									<th>Equipment</th>
								</tr>
							</thead>
							<tbody>
								{devices.map((currentDevice, index) => {
					
									if (index >= length) return null;
					
									return (
										<tr key={currentDevice.id}>
											<td>{currentDevice.name}</td>
											<td>{currentDevice.equipment.name}</td>
											<td style={FitStyle}>
												<IconButton onClick={() => navigate("/editDevice/" + currentDevice.id)}>
													<EditIcon />
												</IconButton>
											</td>
											<td style={FitStyle}>
												<IconButton aria-label="delete" onClick={() => removeDevice(currentDevice.id)}>
													<DeleteIcon />
												</IconButton>
											</td>
										</tr>
									)
								})}
							</tbody>
						</table>
					</div>
				</ShowMoreWrapper>
			}
		</div>
	);
}

export default Devices;