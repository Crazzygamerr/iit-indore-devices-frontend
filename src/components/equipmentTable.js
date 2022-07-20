import React, { useContext, useMemo, useState } from "react";
import { TableContext } from "../Utils/utilities";
import DeviceCard from "./deviceCard";
import EquipmentCard from "./equipmentCard";
import ShowMoreWrapper from "./showMoreWrapper/showMoreWrapper";

export default function EqipmentTable({
	searchByEquipment,
}) {
	
	const { equipment } = useContext(TableContext);
	
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
		<div style={{
			overflowX: 'auto',
		}}>
			<ShowMoreWrapper
				length={searchByEquipment ? length : length/5}
				setLength={(l) => setLength(length + l)}
				list_length={devicesPerEquipment[devicesPerEquipment.length - 1]}>
				<div>
					{equipment.length !== 0 &&
						equipment.map((equipment_item, equipment_index) => {
							
							if (searchByEquipment) {
								return <EquipmentCard
									key={equipment_item.equipment_id}
									devicesPerEquipment={devicesPerEquipment}
									equipment_item={equipment_item}
									equipment_index={equipment_index}
									length={length}
								/>
							} else if(equipment_item.devices[0] != null){
								return <div key={equipment_item.equipment_id}>
									{
										equipment_item.devices.map((device, device_index) => {
											if ((devicesPerEquipment[equipment_index - 1] || 0) >= length/5) return null;
											return <DeviceCard
												key={device.id}
												equipment_item={equipment_item}
												device={device}
											/>
										})
									}
								</div>
							} else {
								return null;
							}
							
						})
					}
				</div>
			</ShowMoreWrapper>
		</div>
	);

} 