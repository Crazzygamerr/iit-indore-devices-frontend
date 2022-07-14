import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { CircularProgress, IconButton, TextField } from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { Children, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Spacer } from '../components/spacer';
import { getTimeString } from '../Utils/utilities';
import { supabase } from '../Utils/supabaseClient';

// import './editDevice.css';

const divStyle = {
	padding: '1%',
	width: '100%',
	maxWidth: '300px',
};

const EditEquipment = () => {
	const [equipment, setEquipment] = useState({
		equipment_name: "",
		slots: [],
	});
	const [startTime, setStartTime] = useState(Date.now());
	const [endTime, setEndTime] = useState(Date.now() + 3600000);
	const [dialogId, setDialogId] = useState(null);
	const [loading, setLoading] = useState(true);

	const { id } = useParams();
	let navigate = useNavigate();

	async function saveDevice() {
		const { data, error } = await supabase
			.from("equipment")
			.upsert({
				id: id,
				name: equipment.equipment_name,
			});

		if (error) {
			console.log(error);
			return;
		}

		if (!id) {
			setEquipment({
				...equipment,
				slots: equipment.slots.map(slot => {
					slot.equipment_id = data[0].id;
					return slot;
				})
			});

			await supabase.from("slots")
				.insert(equipment.slots)
				.then(res => {
					navigate("/equipments");
				})
				.catch(err => console.log(err));
		} else {
			navigate("/equipments");
		}
	}

	async function addSlot(slot_id) {
		const startTimeString = new Date(startTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).substring(0, 5);
		const endTimeString = new Date(endTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).substring(0, 5);

		if (id) {
			const { data, error } = await supabase
				.from("slots")
				.upsert({
					id: slot_id,
					start_time: startTimeString,
					end_time: endTimeString,
					equipment_id: equipment.equipment_id,
				});
			console.log(data);
			if (error) {
				console.log(error);
				return;
			} else {
				if (slot_id) {
					var temp = equipment.slots;
					temp.find(slot => slot.id === slot_id).start_time = startTimeString;
					temp.find(slot => slot.id === slot_id).end_time = endTimeString;
					setEquipment({ ...equipment, slots: temp });
				} else {
					setEquipment({
						...equipment,
						slots: [...equipment.slots, {
							id: data[0].id,
							start_time: startTimeString,
							end_time: endTimeString,
							equipment_id: equipment.equipment_id,
						}],
					});
				}
			}
		} else {
			setEquipment({
				...equipment,
				slots: [...equipment.slots, {
					start_time: startTimeString,
					end_time: endTimeString,
				}],
			});
		}
	}

	useEffect(() => {
		if (id) {
			supabase.rpc("get_slots_by_equipment", {
				param_id: id,
			})
				.then(response => {
					setEquipment(response.data[0]);
					setLoading(false);
				})
				.catch(error => console.log(error));
		} else {
			setLoading(false);
		}
	}, [id]);

	return (
		<div style={divStyle}>
			{dialogId &&
				<div className='dialog-backdrop'>
					<div className="dialog-container">
						<h5>Add slot</h5>
						<LocalizationProvider dateAdapter={AdapterDateFns}>
							<TimePicker
								renderInput={(props) => <TextField {...props} />}
								label="Start Time"
								value={startTime}
								onChange={(newValue) => {
									setStartTime(newValue.getTime());
								}}
							/>
						</LocalizationProvider>
						<Spacer height='20px' />
						<LocalizationProvider dateAdapter={AdapterDateFns}>
							<TimePicker
								renderInput={(props) => <TextField {...props} />}
								label="End Time"
								value={endTime}
								onChange={(newValue) => {
									setEndTime(newValue.getTime());
								}}
							/>
						</LocalizationProvider>
						<Spacer height='20px' />
						<div style={{
							display: 'flex',
							justifyContent: 'end',
						}}>
							<div style={{
								display: 'flex',
								justifyContent: 'space-around',
								width: '50%',
							}}>
								<button onClick={() => {
									setDialogId(null);
								}}>
									Cancel
								</button>
								<button onClick={() => {
									if (dialogId < 0) {
										addSlot();
									} else {
										addSlot(dialogId);
									}
									setDialogId(null);
								}}>
									Add
								</button>
							</div>
						</div>
					</div>
				</div>
			}
			<h3>{(!equipment) ? "Add Equipment" : "Edit Equipment"}</h3>
			<div className="card-style">
				<label>Equipment Name: </label>
				<input
					type='text'
					name='name'
					required
					maxLength={30}
					value={equipment.equipment_name}
					onChange={e => {
						setEquipment({ ...equipment, equipment_name: e.target.value });
					}} />
			</div>
			<br />
			<div style={{
				width: "min-content",
				whiteSpace: "nowrap",
			}}>
				<h4>Slots</h4>
				{loading &&
					<div className='centered-div'>
						<CircularProgress />
					</div>
				}
				{equipment &&
					<div>
						<button onClick={() => {
							setDialogId(-1);
						}}> + Add Slot</button>
						<table className='table'>
							<thead>
								<tr>
									<th>Start time</th>
									<th>End time</th>
								</tr>
							</thead>
							<tbody>
								{equipment.slots && Children.toArray(
									equipment.slots.map((slot, index) => (
										<tr key={slot.id}>
											<td>{getTimeString(slot.start_time)}</td>
											<td>{getTimeString(slot.end_time)}</td>
											<td>
												<IconButton onClick={() => {
													let startTime = new Date();
													startTime.setHours(slot.start_time.split(':')[0]);
													startTime.setMinutes(slot.start_time.split(':')[1]);
													let endTime = new Date();
													endTime.setHours(slot.end_time.split(':')[0]);
													endTime.setMinutes(slot.end_time.split(':')[1]);

													setStartTime(startTime);
													setEndTime(endTime);
													setDialogId(slot.id);
												}}>
													<EditIcon />
												</IconButton>
											</td>
											<td>
												<IconButton onClick={() => {
													if (id) {
														supabase.from("slots")
															.delete().eq("id", slot.id)
															.then(res => {
																setEquipment({
																	...equipment,
																	slots: equipment.slots.filter(s => s.id !== slot.id)
																});
															}).catch(err => console.log(err));
													} else {
														setEquipment({
															...equipment,
															slots: equipment.slots.filter((s, i) => i !== index)
														});
													}
												}}>
													<DeleteIcon />
												</IconButton>
											</td>
										</tr>
									)))}
							</tbody>
						</table>
					</div>
				}
			</div>
			<div style={{
				marginTop: '20px',
			}}>
				<button onClick={saveDevice}>
					{(!id) ? "Add Device" : "Save changes"}
				</button>
			</div>
		</div>
	);
}

export default EditEquipment;