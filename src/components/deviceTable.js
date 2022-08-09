import React, { useContext, useMemo, useState } from "react";
import { TableContext } from "../Utils/utilities";
import DeviceCard from "./deviceCard";
import ShowMoreWrapper from "./showMoreWrapper/showMoreWrapper";

export default function DeviceTable() {
	
	const { devices, searchForToday } = useContext(TableContext);
	
	const [length, setLength] = useState(10);

	return (
		<div style={{
			overflowX: 'auto',
		}}>
			<ShowMoreWrapper
				length={searchForToday ? length : length/5}
				setLength={(l) => setLength(length + l)}
				list_length={devices.length}>
				<div>
					{devices.length !== 0 &&
						devices.map((device_item, device_index) => {
							return <div key={device_item.id}>
									{(device_index >= (searchForToday ? length : length/5))
										? <></>
										: <DeviceCard
												device={device_item}
												length={searchForToday ? 1 : 5}
											/>
									}
								</div>
						})
					}
				</div>
			</ShowMoreWrapper>
		</div>
	);

} 