import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from './Utils/Auth';
import MyNavbar from './components/navbar/navbar';
import { AdminRoute, PrivateRoute } from './components/PrivateRoute';

import Devices from "./pages/Devices";
import EditDevice from "./pages/EditDevice/EditDevice";
import Home from './pages/Home/Home';

import Bookings from "./pages/bookings";
import NotFound from './pages/NotFound';
import ResetPassword from "./pages/resetPassword";
import SignUp from './pages/Signup/SignUp';

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
