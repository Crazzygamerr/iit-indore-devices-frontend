import React, { useContext } from "react";
import { addDaysToDate, getDateString, getTimeString, matchSearch } from "../Utils/utilities";
import SlotButton from "./slotButton";
import { TableContext } from "../Utils/utilities";

export default function DeviceCard({
	equipment_item,
	device,
}) {
	
	const {
		search,
		date,
	} = useContext(TableContext);
	
	if (!(matchSearch(equipment_item.equipment, search)
		|| matchSearch(device.name, search)))
		return null;
	
	return <div
		className="card-style">
		<div style={{ marginBottom: "1%" }}>
			<h5>{device.name}</h5>
			<p>Equipment: {equipment_item.equipment}</p>
		</div>
		<table>
			<thead>
				<tr>
					<th>Date</th>
					{equipment_item.slots[0] != null && equipment_item.slots.map(slot => {
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
					[0, 1, 2, 3, 4].map(row => {
						return <tr key={row}>
							<td>{getDateString(date, false, row)}</td>
							{equipment_item.slots[0] != null && equipment_item.slots.map(slot => {
								return <td key={slot.id}>
									<SlotButton
										equipment_item={equipment_item}
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