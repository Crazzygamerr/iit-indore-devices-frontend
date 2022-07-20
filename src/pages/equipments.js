import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../Utils/supabaseClient';

import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { CircularProgress, IconButton } from '@mui/material';
import { getTimeString } from '../Utils/utilities';
import ShowMoreWrapper from '../components/showMoreWrapper/showMoreWrapper';
import ConfirmDialog from '../components/confirmDialog';

export default function EquipmentList() {
	const [equipment, setEquipment] = useState([]);
	const [loading, setLoading] = useState(true);
	const [length, setLength] = useState(10);
	const [removeId, setRemoveId] = useState(null);

	const navigate = useNavigate();
	
	function removeEquipment(id) {
		supabase
			.from("equipment")
			.delete()
			.eq("id", id)
			.then(response => {
				setEquipment(equipment.filter(equip => equip.equipment_id !== id));
				setRemoveId(null);
			}).catch(error => console.log(error))
	}

	useEffect(() => {
		supabase.rpc("get_slots_by_equipment")
			.then(response => {
				setEquipment(response.data);
				console.log(response.data);
				setLoading(false);
			})
			.catch(error => console.log(error));

	}, []);

	return (
		<div
			style={{
				padding: '1%',
				overflowX: 'auto',
			}}>
			{removeId &&
				<ConfirmDialog
					title={`Are you sure you want to remove '${equipment.find(eq => eq.equipment_id === removeId).equipment_name}'?`}
					message="All data, devices & bookings will be lost."
					setRemoveId={setRemoveId}
					handleConfirm={() => removeEquipment(removeId)}
				/>
			}
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
				<ShowMoreWrapper
					length={length}
					setLength={setLength}
					list_length={equipment.length}>
					<div style={{
						overflowX: 'auto',
					}}>
						<table>
							<thead>
								<tr>
									<th>Name</th>
									<th>Slots</th>
								</tr>
							</thead>
							<tbody>
								{equipment.map((equipment_item, index) => {
					
									if (index >= length) return null;
					
									return <tr key={equipment_item.equipment_id}>
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
													setRemoveId(equipment_item.equipment_id);
												}}>
												<DeleteIcon />
											</IconButton>
										</td>
									</tr>
								})}
							</tbody>
						</table>
					</div>
				</ShowMoreWrapper>
			}
		</div>
	);
}