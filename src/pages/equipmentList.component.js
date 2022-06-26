import { React, useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';

import { getDateString } from '../components/utils';
import { IconButton, CircularProgress } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

const timeStyle = {
	boxShadow: '4px 4px 8px 0 rgba(0, 0, 0, 0.4)',
	padding: '2%',
	borderRadius: '25px',
	width: '100%',	
	fontSize: '0.75em',
	marginRight: '4%',
}

export default function EquipmentList() {
	const [equipment, setEquipment] = useState([]);
	const [loading, setLoading] = useState(true);
	const [name, setName] = useState('');
	
	const navigate = useNavigate();

	useEffect(() => {
		supabase.rpc("get_slots_by_equipment")
			.then(response => {
				setEquipment(response.data);
				setLoading(false);
			})
			.catch(error => console.log(error));
		
	}, []);

	return (
		<div
			style={{
				width: "min-content",
				whiteSpace: "nowrap",
				padding: '1%',
			}}>
			<h3>Equipment</h3>
			{loading &&
				<div>
					<CircularProgress />
				</div>
			}
			{!loading &&
				<table>
					<thead>
						<tr>
							<th>Name</th>
						</tr>
					</thead>
					<tbody>
						{equipment.map(equipment_item => (
							<tr key={equipment_item.equipment_id}>
								<td>{equipment_item.equipment_name}</td>
								<td>
									{equipment_item.slots &&
										equipment_item.slots.map(slot => (
											<span key={slot.id} style={timeStyle}>
												{getDateString(slot.start_time) + " - " + getDateString(slot.end_time)}
											</span>
										))
									}
								</td>
								<td>
									<IconButton onClick={() => navigate("/editEquipment/" + equipment_item.equipment_id)}>
										<EditIcon />
									</IconButton>
								</td>
								<td>
									<IconButton
										onClick={() => {
											supabase
												.from("equipment")
												.delete()
												.eq("id", equipment_item.equipment_id)
												.then(response => {
													console.log(response);
													window.location.reload();
												}).catch(error => console.log(error))
										}}>
										<DeleteIcon />
									</IconButton>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			}
		</div>
	);
}