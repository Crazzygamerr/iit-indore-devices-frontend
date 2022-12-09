import React, { useContext, useMemo, useState } from "react";
import { TableContext } from "../Utils/utilities";
import DeviceCard from "./deviceCard";
import ShowMoreWrapper from "./showMoreWrapper/showMoreWrapper";

export default function DeviceTable() {
	
	const { devices, searchForToday } = useContext(TableContext);

	return (
		<div style={{
			overflowX: 'auto',
		}}>
			<ShowMoreWrapper
				list={devices}
				initial_length={10}
				builder={(device_item, device_index) => {
					return <div key={device_item.id}>
						<DeviceCard
							device={device_item}
							length={searchForToday ? 1 : 5}
						/>
					</div>
				}}
			/>
		</div>
	);

} 