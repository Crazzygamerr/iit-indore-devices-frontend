import React, { useEffect, useState } from 'react';
import { useAuth } from '../Auth';
import { getDateString, getTimeString } from '../components/utils';
import { supabase } from '../supabaseClient';

export default function Bookings() {
	const { user } = useAuth();
	const [upcomingBookings, setUpcomingBookings] = useState([]);
	const [pastBookings, setPastBookings] = useState([]);

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
					<BookingTable
						bookings={upcomingBookings}
						isUpcoming={true}
						setUpcomingBookings={setUpcomingBookings}
					/>
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
					<BookingTable bookings={pastBookings} />
				}
			</ div>
		</div>
	);
}

// define a component that renders a table of devices
function BookingTable({ bookings, isUpcoming, setUpcomingBookings }) {
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
				{bookings.map(booking => (
					<tr key={booking.id}>
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
				))}
			</tbody>
		</table>
	);
}