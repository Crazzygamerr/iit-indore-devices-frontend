import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { CircularProgress, IconButton } from '@mui/material';
import { getTimeString } from '../components/utils';

export default function EquipmentList() {
	const [equipment, setEquipment] = useState([]);
	const [loading, setLoading] = useState(true);

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
				padding: '1%',
				overflowX: 'auto',
			}}
		>
			<h3>Equipment</h3>
			{loading &&
				<div className='centered-div'>
					<CircularProgress />
				</div>
			}
			<div>
				<button onClick={() => navigate("/addEquipment")}>+ Add Equipment</button>
			</div>
			{!loading &&
				<table>
					<thead>
						<tr>
							<th>Name</th>
							<th>Slots</th>
						</tr>
					</thead>
					<tbody>
						{equipment.map(equipment_item => (
							<tr key={equipment_item.equipment_id}>
								<td>{equipment_item.equipment_name}</td>
								<td>
									{equipment_item.slots &&
										equipment_item.slots.map(slot => (
											<div key={slot.id} className="time-style">
												{getTimeString(slot.start_time) + " - " + getTimeString(slot.end_time)}
											</div>
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