import React, { useState } from "react";
import { getTimeString } from "../Utils/utilities";
import SlotButton from "./slotButton";

export default function DeviceByEqipmentTable({
	equipment,
	date,
	search,
	setDialog
}) {
	
	const [length, setLength] = useState(10);
	
	return <div>
		{equipment.length !== 0 &&
			equipment.map(equipment_item => {
					
					if (!(equipment_item.equipment.toLowerCase().includes(search.toLowerCase())
						|| equipment_item.devices.some(device => device.name.toLowerCase().includes(search.toLowerCase()))))
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
									equipment_item.devices.map(device => {
										
										if (!device.name.toLowerCase().includes(search.toLowerCase())) return null;

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
	</div>;
	
} 