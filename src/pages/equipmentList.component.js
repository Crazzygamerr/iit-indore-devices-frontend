import { React, useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

import { getDateString } from '../components/utils';
import { IconButton, CircularProgress } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

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

	useEffect(() => {
		supabase.from("slots")
			.select(`
				id,
				start_time,
				end_time,
				equipment: equipment_id(
					id,
					name
				)
			`)
			.order("start_time")
			.then(response => {
				var temp_equipment = [];
				response.data.forEach(slot => {
					if (!temp_equipment.some(equipment => equipment.id === slot.equipment.id)) {
						temp_equipment.push({
							id: slot.equipment.id,
							name: slot.equipment.name,
							slots: [],
						});
					}
					
					temp_equipment.find(equipment => equipment.id === slot.equipment.id).slots.push({
						id: slot.id,
						start_time: slot.start_time,
						end_time: slot.end_time,
					});
				});
				setEquipment(temp_equipment);
				setLoading(false);
			});
		
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
				<div>
					<input
					type='text'
					name='name'
					value={name}
					onChange={e => {
						setName(e.target.value);
					}} />
					<button
					onClick={() => {
						supabase.from("equipment")
							.insert({
								name: name,
							})
							.then(response => window.location.reload())
							.catch(error => console.log(error));
					}}>
						 + Add Equipment
					</button>
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
							<tr key={equipment_item.id}>
								<td>{equipment_item.name}</td>
								<td>
									<IconButton
										onClick={() => {
											supabase
												.from("equipment")
												.delete()
												.eq("id", equipment_item.id)
												.then(response => {
													console.log(response);
													window.location.reload();
												}).catch(error => console.log(error))
										}}>
										<DeleteIcon />
									</IconButton>
								</td>
								<td>
									{equipment_item.slots.map(slot => (
										<span key={slot.id} style={timeStyle}>
											{getDateString(slot.start_time) + " - " + getDateString(slot.end_time)}
										</span>
									))}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			}
		</div>
	);
}