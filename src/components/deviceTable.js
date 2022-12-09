import React, { useContext } from "react";
import { addDaysToDate, getDateString, getTimeString, matchSearch, TableContext } from "../Utils/utilities";
import ShowMoreWrapper from "./showMoreWrapper/showMoreWrapper";
import SlotButton from "./slotButton";

export default function DeviceTable() {
	
	const {
		devices,
		searchForToday,
		search,
		date
	} = useContext(TableContext);
	const length = searchForToday ? 1 : 5;

	return (
		<div style={{
			overflowX: 'auto',
		}}>
			<ShowMoreWrapper
				list={devices}
				initial_length={10}
				builder={(device, device_index) => {
					if (!matchSearch(device.device, search)
						&& !matchSearch(device.remarks ?? "", search))
						return null;

					return <div
						className="card-style">
						<div style={{ marginBottom: "1%" }}>
							<h5>{device.device}</h5>
							{device.remarks &&
								<p style={{
									width: "100%",
									height: "1.5em",
									overflow: "hidden",
								}}
								>{device.remarks}</p>
							}
						</div>
						<table>
							<thead>
								<tr>
									<th>Date</th>
									{device.slots && device.slots[0] != null && device.slots.map(slot => {
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
											{device.slots && device.slots[0] != null && device.slots.map(slot => {
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
				}}
			/>
		</div>
	);

} 