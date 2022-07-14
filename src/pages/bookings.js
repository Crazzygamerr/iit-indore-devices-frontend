import React, { useEffect, useState } from 'react';
import { useAuth } from '../Utils/Auth';
import { getDateString, getTimeString } from '../Utils/utilities';
import { supabase } from '../Utils/supabaseClient';
import ShowMoreWrapper from '../components/showMoreWrapper/showMoreWrapper';

export default function Bookings() {
	const { user } = useAuth();
	const [upcomingBookings, setUpcomingBookings] = useState([]);
	const [upcomingLength, setUpcomingLength] = useState(10);
	const [pastBookings, setPastBookings] = useState([]);
	const [pastLength, setPastLength] = useState(10);

	useEffect(() => {
		supabase.from('bookings')
			.select(`
				id, 
				booking_date,
				device: devices(
					id,
					name,
					equipment: equipment(
						id,
						name
					)
				),
				slot: slots(
					id,
					start_time,
					end_time
				)
			`)
			.eq('email', user.email)
			.then(response => {
				const upcoming = [];
				const past = [];
				response.data.forEach(booking => {
					const d = new Date(booking.booking_date + " " + booking.slot.end_time);

					if (d > new Date()) {
						upcoming.push(booking);
					} else {
						past.push(booking);
					}
				});
				setUpcomingBookings(upcoming);
				setPastBookings(past);
				// console.log(past, upcoming);
			}).catch(error => console.log(error));
	}, [user]);

	return (
		<div style={{ padding: '10px' }}>
			<h3>Bookings</h3>
			<div>
				<h5>Upcoming</h5>
				{upcomingBookings.length === 0 &&
					<div className='centered-div'>
						<p>No upcoming bookings</p>
					</div>
				}
				{upcomingBookings.length !== 0 &&
					<ShowMoreWrapper
						length={upcomingLength}
						setLength={setUpcomingLength}
						list_length={upcomingBookings.length}>
						<BookingTable
							bookings={upcomingBookings}
							length={upcomingLength}
							isUpcoming={true}
							setUpcomingBookings={setUpcomingBookings}
						/>
					</ShowMoreWrapper>
				}
			</div>
			<br />
			<div>
				<h5>Past Bookings</h5>
				{pastBookings.length === 0 &&
					<div className='centered-div'>
						<p>No past bookings</p>
					</div>
				}
				{pastBookings.length !== 0 &&
					<ShowMoreWrapper
						length={pastLength}
						setLength={setPastLength}
						list_length={pastBookings.length}>
						<BookingTable
							bookings={pastBookings}
							length={pastLength}
						/>
					</ShowMoreWrapper>
				}
			</ div>
		</div>
	);
}

// define a component that renders a table of devices
function BookingTable({
	bookings,
	length,
	isUpcoming,
	setUpcomingBookings
}) {
	return (
		<table>
			<thead>
				<tr>
					<th>Device</th>
					<th>Equipment</th>
					<th>Slot</th>
					<th>Date</th>
				</tr>
			</thead>
			<tbody>
				{bookings.map((booking, index) => {
					
					if (index >= length) return null;
					
					return <tr key={booking.id}>
						<td>{booking.device.name}</td>
						<td>{booking.device.equipment.name}</td>
						<td>{getDateString(booking.booking_date)}</td>
						<td>{getTimeString(booking.slot.start_time)} - {getTimeString(booking.slot.end_time)}</td>
						{isUpcoming &&
							<td>
								<button onClick={() => {
									supabase.from('bookings')
										.delete()
										.eq('id', booking.id)
										.then(response => {
											setUpcomingBookings(bookings.filter(b => b.id !== booking.id));
										}).catch(error => console.log(error));
								}}>Cancel</button>
							</td>
						}
					</tr>
				})}
			</tbody>
		</table>
	);
}