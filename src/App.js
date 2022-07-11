import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from './Utils/Auth';
import MyNavbar from './components/navbar/navbar.component';
import { AdminRoute, PrivateRoute } from './components/PrivateRoute.component';

import Devices from "./pages/Devices.component";
import EditDevice from "./pages/EditDevice.component";
import Home from './pages/home.component';

import EditEquipment from "./pages/editEquipment.component";
import Equipments from "./pages/equipments.component";

import Bookings from "./pages/bookings.component";
import NotFound from './pages/NotFound.component';
import ResetPassword from "./pages/resetPassword.component";
import SignUp from './pages/SignUp.component';

import './styles.css';

function App() {
	return (
		<BrowserRouter>
			<AuthProvider>
				<div>
					<MyNavbar />
					<Routes>
						<Route path="/signin" element={<SignUp />} />
						<Route path="/signup" element={<SignUp />} />
						<Route path="/reset-password" element={<ResetPassword />} />

						<Route path="/" element={<PrivateRoute />}>
							<Route path="/" element={<Home />} />
							<Route path="/bookings" element={<Bookings />} />
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
