import React from 'react';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import EditDevice from "./components/EditDevice.component";
import Home from "./components/Home.component";
import MyNavbar from './components/navbar.component';
import NotFound from './components/NotFound.component';
import SignUp from './components/SignUp.component';
import PrivateRoute from './components/PrivateRoute.component';
import { AuthProvider } from './Auth';
import BookDevice from './components/BookDevice.component';

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
