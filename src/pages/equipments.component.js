import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { CircularProgress, IconButton } from '@mui/material';
import { getTimeString } from '../components/utils';

const timeStyle = {
	boxShadow: '4px 4px 8px 0 rgba(0, 0, 0, 0.4)',
	padding: '2%',
	borderRadius: '25px',
	fontSize: '0.75em',
	marginRight: '4%',
	display: 'inline-block',
}

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
				// width: "min-content",
				whiteSpace: "nowrap",
				padding: '1%',
			}}
		>
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
								<td style={{
									// overflow: "auto",
									// width: "min-content",
								}}>
									{equipment_item.slots &&
										equipment_item.slots.map(slot => (
											<span key={slot.id} style={timeStyle}>
												{getTimeString(slot.start_time) + " - " + getTimeString(slot.end_time)}
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