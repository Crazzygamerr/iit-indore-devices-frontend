import React, { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "../../Utils/supabaseClient";

import { CircularProgress } from "@mui/material";

import EqipmentTable from "../../components/equipmentTable";
import HomeSearchFilter from "../../components/homeSearchFilter/homeSearchFilter";
import Toast from "../../components/toast/toast";
import { getDateString, TableContext } from "../../Utils/utilities";
import "./home.css";
import BookingDialog from "../../components/bookingDialog";

/* 
// remove add devices from nav
// no refresh after booking
// Change device list to devices
// equipment list overlap
// no booking for past date
// email sign in error handling
// unbook slot
// My bookings
// forgot password
// pagination
// Add confirmation dialogs
sort filter search
 */

/* 
To be discussed:
Added name length limit - 30 characters
OAuth
Download data format
Device Equipment change behaviour - delete bookings?
 */
export default function Home() {
	const [equipment, setEquipment] = useState([]);
	const [date, setDate] = useState(new Date());
	const [search, setSearch] = useState("");
	const [dialog, setDialog] = useState(null);
	const [toastDetails, setToastDetails] = useState({ description: '', isError: true });
	const [searchByEquipment, setSearchByEquipment] = useState(true);
	
	const context = useMemo(() => ({
		equipment,
		date,
		search,
		setDialog,
	}), [equipment, date, search, setDialog]);

	async function handleBooking(device_id, slot_id, isUnbook) {
		const { data, error } = await supabase.rpc((isUnbook) ? "unbook_device" : "bookdevice", {
			b_date: getDateString(date, true),
			s_id: slot_id,
			d_id: device_id,
		});
		setDialog(null);
		
		if (error) {
			setToastDetails({ description: error.message, isError: true });
		} else if (data.id == null) {
			if (isUnbook) {
				setToastDetails({ description: "Unable to unbook device", isError: true });
			} else {
				setToastDetails({ description: "Unable to book slot", isError: true });
			}
		} else {
			let temp_equipment = equipment;
			const index = temp_equipment.findIndex(
				eq => eq.devices.some(
					device => device.id == data.device_id
				));
			if (index !== -1) {
				if (isUnbook) {
					temp_equipment[index].bookings = temp_equipment[index].bookings.filter(
						booking => booking.id != data.id
					);
				} else {
					temp_equipment[index].bookings.push(data);
				}
			}
			setEquipment([...temp_equipment]);
		}
	}

	const getBookings = useCallback(
		async function get_b(
			temp_equipment
		) {
			await supabase.from("bookings")
				.select()
				// .eq("booking_date", getDateString(date, true))
				.gte("booking_date", getDateString(date, true))
				.lt("booking_date", getDateString(date, true, 5))
				.then(response => {
					response.data.forEach(booking => {
						const index = temp_equipment.findIndex(
							eq => eq.devices.some(
								device => device.id === booking.device_id
							)
						);
						if (index !== -1) {
							temp_equipment[index].bookings.push(booking);
						}
					});
					setEquipment(temp_equipment);
				}).catch(error => {
					// console.log(error);
					setToastDetails({ description: error.message, isError: true });
				});
		}, [date]);

	useEffect(() => {
		const temp_equipment = [];
		async function getAllByEquipment() {
			supabase.rpc("get_all_by_equipment")
				.then(response => {
					response.data.forEach(element => element.bookings = []);
					temp_equipment.push(...response.data);
				})
				.catch(error => {
					// console.error(error);
					setToastDetails({ description: error.message, isError: true });
				});

			await getBookings(temp_equipment);
		}

		getAllByEquipment();
	}, [date, getBookings]);

	return (
		<div style={{ padding: "10px" }}>

			<Toast toastDetails={toastDetails} />

			{dialog &&
				<BookingDialog
					dialog={dialog}
					handleBooking={handleBooking}
					setDialog={setDialog}
				/>
			}
			
			<h3>Home</h3>
			<div style={{
				padding: "10px",
			}}>
				<input
					type="text"
					placeholder="Search"
					className="search-input"
					onChange={(e) => {
						setSearch(e.target.value);
					}}
				/>
			</div>

			<HomeSearchFilter
				date={date}
				setDate={setDate}
				searchByEquipment={searchByEquipment}
				setSearchByEquipment={setSearchByEquipment}
			/>

			{equipment.length === 0 &&
				<div className="centered-div">
					<CircularProgress />
				</div>
			}
			{/* <button onClick={() => {
				supabase.rpc("get_all_by_device", {
					b_date: getDateString(date, true)
				}).then(response => {
					console.log(response);
				});
			}}>Call</button> */}

			<TableContext.Provider value={context}>
				<EqipmentTable
					searchByEquipment={searchByEquipment}
				/>
			</TableContext.Provider>

		</div>
	);
}
