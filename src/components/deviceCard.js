import React, { useContext } from "react";
import { addDaysToDate, getDateString, getTimeString, matchSearch, TableContext } from "../Utils/utilities";
import SlotButton from "./slotButton";

export default function DeviceCard({
	device,
	length = 1,
}) {
	
	const {
		search,
		date,
	} = useContext(TableContext);

	if (!matchSearch(device.device, search))
		return null;

	return <div
		className="card-style">
		<div style={{ marginBottom: "1%" }}>
			<h5>{device.device}</h5>
		</div>
		<table>
			<thead>
				<tr>
					<th>Date</th>
					{device.slots[0] != null && device.slots.map(slot => {
						return <th
							key={slot.id}
							style={{
								whiteSpace: "nowrap",
							}}>
							{getTimeString(slot.start_time)}
							<br />
							{getTimeString(slot.end_time)}
						</th>
					})
					}
				</tr>
			</thead>
			<tbody>
				{device != null &&
					[...Array(length).keys()].map(row => {
						return <tr key={row}>
							<td>{getDateString(date, false, row)}</td>
							{device.slots[0] != null && device.slots.map(slot => {
								return <td key={slot.id}>
									<SlotButton
										device={device}
										slot={slot}
										date={addDaysToDate(date, row)}
									/>
								</td>
							})}
						</tr>
					})
				}
			</tbody>
		</table>
	</div>

}