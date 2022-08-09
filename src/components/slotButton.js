import React, { useContext } from "react";
import { getDateString, getTimeString, TableContext } from "../Utils/utilities";

export default function SlotButton({
	device,
	slot,
	date
}) {

	const {
		setDialog,
	} = useContext(TableContext);

	var booking = null;
	if (device.bookings) {
		booking = device.bookings.find(b => {
			if (!b)
				return false;
			return b.slot_id === slot.id
				&& getDateString(b.booking_date) === getDateString(date);
		})
	}

	const s_date_time = new Date(date.getFullYear(), date.getMonth(), date.getDate(), slot.start_time.split(":")[0], slot.start_time.split(":")[1], slot.start_time.split(":")[2]);

	if (booking) {
		const b_date = new Date(booking.booking_date);
		const b_date_time = new Date(b_date.getFullYear(), b_date.getMonth(), b_date.getDate(), slot.start_time.split(":")[0], slot.start_time.split(":")[1], slot.start_time.split(":")[2]);

		return <div
			style={{
				display: "flex",
			}}>
			<button
				className="slot-red"
				onClick={() => {
					setDialog({
						device_name: device.device,
						start_time: getTimeString(slot.start_time),
						end_time: getTimeString(slot.end_time),
						booking_date: date,
						device_id: device.id,
						slot_id: slot.id,
						booked: true,
						email: booking.email,
						canUnbook: (b_date_time > new Date()),
					})
				}}
			/>
		</div>
	} else if (s_date_time < new Date()) {
		return <div className="slot-grey"></div>
	} else {
		return <div
			style={{
				display: "flex",
			}}>
			<button
				className="slot-green"
				onClick={() => {
					setDialog({
						device_name: device.device,
						start_time: getTimeString(slot.start_time),
						end_time: getTimeString(slot.end_time),
						booking_date: date,
						device_id: device.id,
						slot_id: slot.id,
						booked: false,
					})
				}}
			/>
		</div>
	}

}