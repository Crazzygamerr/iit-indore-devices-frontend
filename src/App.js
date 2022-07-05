import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from './Auth';
import MyNavbar from './components/navbar.component';
import { AdminRoute, PrivateRoute } from './components/PrivateRoute.component';

import Devices from "./pages/Devices.component";
import EditDevice from "./pages/EditDevice.component";
import Home from './pages/home.component';

import EditEquipment from "./pages/editEquipment.component";
import Equipments from "./pages/equipments.component";

import NotFound from './pages/NotFound.component';
import SignUp from './pages/SignUp.component';

import './styles.css';

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
							{/* <Route path="/bookDevice/:id" element={<BookDevice />} /> */}

							<Route path="/" element={<AdminRoute />}>

								<Route path="/devices" element={<Devices />} />
								<Route path="/addDevice" element={<EditDevice />} />
								<Route path="/editDevice/:id" element={<EditDevice />} />

								<Route path="/equipments" element={<Equipments />} />
								<Route path="/addEquipment" element={<EditEquipment />} />
								<Route path="/editEquipment/:id" element={<EditEquipment />} />
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
