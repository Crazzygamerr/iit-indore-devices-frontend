import React from "react";
import { getDateString } from "../Utils/utilities";
import { useAuth } from "../Utils/Auth";

export default function BookingDialog({ 
	dialog, 
	setDialog,
	handleBooking,
}) {
	
	const { user} = useAuth();
	
	return <div className="dialog-backdrop">
		<div className="dialog-container">
			<h5>Slot Info</h5>
			<p>
				<b>Device name:</b> {dialog.device_name} <br />
				<b>Date:</b> {getDateString(dialog.booking_date)} <br />
				<b>Slot:</b> {dialog.start_time} - {dialog.end_time} <br />
				{dialog.booked && <b>Booked by: </b>}
				{dialog.booked && dialog.email}
			</p>
			<div className="centered-div" style={{
				flexDirection: 'row',
				justifyContent: "space-between"
			}}>
				<button onClick={() => setDialog(null)}>Close</button>
				{dialog.booked && dialog.email === user.email && dialog.canUnbook &&
					<button onClick={() => handleBooking(dialog.device_id, dialog.slot_id, dialog.booking_date, true)}>
						Unbook
					</button>
				}
				{!dialog.booked &&
					<button onClick={() => handleBooking(dialog.device_id, dialog.slot_id, dialog.booking_date)}>
						Book
					</button>
				}
			</div>
		</div>
	</div>;
}