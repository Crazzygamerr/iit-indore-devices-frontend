import React from 'react';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import EditDevice from "./pages/EditDevice.component";
import Home from "./pages/Home.component";
import MyNavbar from './components/navbar.component';
import NotFound from './pages/NotFound.component';
import SignUp from './pages/SignUp.component';
import PrivateRoute from './components/PrivateRoute.component';
import { AuthProvider } from './Auth';
import BookDevice from './pages/BookDevice.component';

/* admin sets slots, user books those
calendar view to select day, day view shows all slots

show all slots from all devices in a table

option to download data

6AM to 10PM - 1 hour

Generate email for slot booking

Unbook slot */

function App() {
	return (
		<BrowserRouter>
			<AuthProvider>
				<div>
					<MyNavbar />
					<Routes>
						<Route path="/signin" element={<SignUp />} />
						<Route path="/signup" element={<SignUp />} />
						
						<Route path="/" element={<PrivateRoute />}>
							<Route path="/" element={<Home />} />
							<Route path="/addDevice" element={<EditDevice />} />
							<Route path="/editDevice/:id" element={<EditDevice />} />
							<Route path="/bookDevice/:id" element={<BookDevice />} />
						</Route>
						<Route path="*" element={<NotFound />} />
					</Routes>
				</div>
			</AuthProvider>
		</BrowserRouter>
	);
}

export default App;
