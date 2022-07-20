import React, { useContext } from "react";
import { getTimeString, matchSearch, TableContext } from "../Utils/utilities";
import SlotButton from "./slotButton";

export default function EquipmentCard({ 
	devicesPerEquipment,
	equipment_item,
	equipment_index,
	length,
}) {
	
	const {
		search,
		date,
		setDialog,
	} = useContext(TableContext);
	
	if ((devicesPerEquipment[equipment_index - 1] || 0) >= length) return null;
	if (!(matchSearch(equipment_item.equipment, search)
		|| equipment_item.devices.some(device => matchSearch(device.name, search))))
		return null;
	return <div
		className="card-style">
		<div style={{ marginBottom: "1%" }}>
			<h5>{equipment_item.equipment}</h5>
		</div>
		<table>
			<thead>
				<tr>
					<th>Device Name</th>
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
				{equipment_item.devices[0] != null &&
					equipment_item.devices.map((device, device_index) => {
						if ((devicesPerEquipment[equipment_index - 1] || 0) + device_index >= length) return null;
						if (!(matchSearch(device.name, search) || matchSearch(equipment_item.equipment, search))) return null;
						return <tr key={device.id}>
							<td>{device.name}</td>
							{equipment_item.slots[0] != null && equipment_item.slots.map(slot => {
								return <td key={slot.id}>
									<SlotButton
										equipment_item={equipment_item}
										device={device}
										slot={slot}
										date={date}
									/>
								</td>
							})
							}
						</tr>
					})
				}
			</tbody>
		</table>
	</div>
	
}