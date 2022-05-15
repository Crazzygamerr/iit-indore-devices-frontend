import React from 'react';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AddDevice from "./components/AddDevice.component";
import EditDevice from "./components/EditDevice.component";
import Home from "./components/Home.component";
import MyNavbar from './components/navbar.component';

function App() {
	return (
		<BrowserRouter>
			<div>
				<MyNavbar />
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/addDevice" element={<AddDevice />} />
					<Route path="/editDevice/:id" element={<EditDevice />} />
				</Routes>
			</div>
		</BrowserRouter>
	);
}

export default App;
