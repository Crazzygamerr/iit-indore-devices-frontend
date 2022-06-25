import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from './Auth';
import { PrivateRoute, AdminRoute } from './components/PrivateRoute.component';
import MyNavbar from './components/navbar.component';

import BookDevice from './pages/BookDevice.component';
import Devices from "./pages/Devices.component";
import EditDevice from "./pages/EditDevice.component";
import NotFound from './pages/NotFound.component';
import SignUp from './pages/SignUp.component';
import Home from './pages/home.component';

import './styles.css';
import EquipmentList from "./pages/equipmentList.component";

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
							<Route path="/devices" element={<Devices />} />
							<Route path="/bookDevice/:id" element={<BookDevice />} />
							
							<Route path="/" element={<AdminRoute />}>
								<Route path="/addDevice" element={<EditDevice />} />
								<Route path="/editDevice/:id" element={<EditDevice />} />
								<Route path="/equipment" element={ <EquipmentList /> } />
							</Route>
						</Route>
						<Route path="*" element={<NotFound />} />
					</Routes>
				</div>
			</AuthProvider>
		</BrowserRouter>
	);
}

export default App;
