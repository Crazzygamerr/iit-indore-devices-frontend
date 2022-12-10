import React from 'react';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { Spacer } from './spacer';
import TextField from '@mui/material/TextField';

// type props = {
// 	addSlot: (id: number, startTime: number, endTime: number) => void,
// 	slot: any | null,
// 	setSlotDialogId: (id: string | null) => void,
// };

export default function SlotDialog({
	addSlot,
	slot,
	setSlotDialogId
}) {
	const [startTime, setStartTime] = React.useState(slot.id
		? new Date().setHours(slot.start_time.split(':')[0], slot.start_time.split(':')[1])
		: Date.now()
	);
	// const [endTime, setEndTime] = React.useState(Date.now() + 3600000);
	const [endTime, setEndTime] = React.useState(slot.id
		? new Date().setHours(slot.end_time.split(':')[0], slot.end_time.split(':')[1])
		: Date.now() + 3600000
	);
	
	return (
		<div className='dialog-backdrop'>
			<div className="dialog-container">
				<h5>{(slot.id) ? "Edit" : "Add"} slot</h5>
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
							setSlotDialogId(null);
						}}>
							Cancel
						</button>
						<button onClick={() => {
							console.log(slot);
							if (!slot.id) {
								addSlot(-1, startTime, endTime);
							} else {
								addSlot(slot.id, startTime, endTime);
							}
							setSlotDialogId(null);
						}}>
							{(slot.id) ? "Save" : "Add"}
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}