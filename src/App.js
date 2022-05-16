import React from 'react';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import EditDevice from "./components/EditDevice.component";
import Home from "./components/Home.component";
import MyNavbar from './components/navbar.component';
import NotFound from './components/NotFound.component';

function App() {
	return (
		<BrowserRouter>
			<div>
				<MyNavbar />
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/addDevice/" element={<EditDevice />} />
					<Route path="/editDevice/:id" element={<EditDevice />} />
					<Route path="*" element={<NotFound />} />
				</Routes>
			</div>
		</BrowserRouter>
	);
}

export default App;
