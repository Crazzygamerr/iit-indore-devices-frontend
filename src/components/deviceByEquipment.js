import React, { useMemo, useState } from "react";
import { getTimeString, matchSearch } from "../Utils/utilities";
import SlotButton from "./slotButton";
import ShowMoreWrapper from "./showMoreWrapper/showMoreWrapper";

export default function DeviceByEqipmentTable({
	equipment,
	date,
	search,
	setDialog
}) {

	const [length, setLength] = useState(10);
	// get list of number of devices per equipment
	const devicesPerEquipment = useMemo(() => {
		var sum = 0;
		return equipment.map(equipment_item => {
			sum += equipment_item.devices.length;
			return sum;
		});
	}, [equipment]);

	return (
		<ShowMoreWrapper
			length={length}
			setLength={setLength}
			list_length={devicesPerEquipment[devicesPerEquipment.length - 1]}>
			<div>
				{equipment.length !== 0 &&
					equipment.map((equipment_item, equipment_index) => {
						
						if ((devicesPerEquipment[equipment_index - 1] || 0) >= length) return null;
						if (!(matchSearch(equipment_item.equipment, search)
							|| equipment_item.devices.some(device => matchSearch(device.name, search))))
							return null;
						return <div
							key={equipment_item.equipment_id}
							className="card-style"
							style={{ overflow: "auto" }}
						>
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
															setDialog={setDialog}
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
					})
				}
			</div>
		</ShowMoreWrapper>
	);

} 