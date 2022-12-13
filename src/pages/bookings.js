import React, { useEffect, useState } from 'react';
import { useAuth } from '../Utils/Auth';
import { getDateString, getTimeString } from '../Utils/utilities';
import { supabase } from '../Utils/supabaseClient';
import ShowMoreWrapper from '../components/showMoreWrapper/showMoreWrapper';

export default function Bookings() {
	const { user } = useAuth();
	const [upcomingBookings, setUpcomingBookings] = useState([]);
	const [pastBookings, setPastBookings] = useState([]);

	useEffect(() => {
		supabase
			.rpc('get_bookings')
			.then(response => {
				const upcoming = [];
				const past = [];
				console.log(response);
				response.data.forEach(booking => {
					var isUpcoming;
					if (booking.slot) {
						isUpcoming = new Date(booking.booking_date + " " + booking.slot.end_time) > new Date();
					} else {
						isUpcoming = !booking.is_completed;
					}

					if (isUpcoming) {
						upcoming.push(booking);
					} else {
						past.push(booking);
					}
					
				});
				past.sort((a, b) => b.id - a.id);
				upcoming.sort((a, b) => a.id - b.id);
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
					<div style={{
						overflowX: 'auto',
					}}>
						<BookingTable
							bookings={upcomingBookings}
							isUpcoming={true}
							setUpcomingBookings={setUpcomingBookings}
						/>
					</div>
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
					<div style={{
						overflowX: 'auto',
					}}>
						<BookingTable
							bookings={pastBookings}
						/>
					</div>
				}
			</ div>
		</div>
	);
}

// define a component that renders a table of devices
function BookingTable({
	bookings,
	isUpcoming,
	setUpcomingBookings,
}) {
	return (
		<ShowMoreWrapper
			columns={['Device', 'Date', 'Slot']}
			list={bookings}
			initial_length={10}
			builder={(booking, length) => {
				return <tr key={booking.id}>
					<td>{booking.device.name}</td>
					<td>{getDateString(booking.booking_date)}</td>
					<td>{(booking.slot)
						? getTimeString(booking.slot.start_time, booking.slot.end_time)
						: 'N/A'
					}</td>
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
			}}
		/>
	);
}