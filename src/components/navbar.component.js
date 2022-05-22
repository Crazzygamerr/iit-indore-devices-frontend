//import { Nav, Navbar, NavDropdown } from 'react-bootstrap';
import { AppBar, Toolbar } from "@mui/material";
import "bootstrap/dist/css/bootstrap.min.css";
import React from 'react';
import { Nav, Navbar, NavDropdown } from 'react-bootstrap';
import { Container } from "react-bootstrap";
import { useAuth } from "../Auth";
import { supabase } from "../supabaseClient";

export default function MyNavbar() {
	const { user } = useAuth();
	
	return (
		<Navbar collapseOnSelect bg="dark" variant="dark" expand="lg">
			<Container fluid>
				<Navbar.Brand href="/">IIT Indore Devices</Navbar.Brand>
				<Navbar.Toggle aria-controls="basic-navbar-nav" />
				<Navbar.Collapse id="basic-navbar-nav">
					<Nav className="me-auto">
						<Nav.Link href="/addDevice">Add Device</Nav.Link>
					</Nav>
					<Nav className="ml-auto">
						{user ? (
							<NavDropdown title={user.email} id="basic-nav-dropdown">
								{/* <NavDropdown.Item onClick={() => { console.log(user) }}>ConsoleLog</NavDropdown.Item> */}
								<NavDropdown.Item onClick={() => {supabase.auth.signOut()}}>Sign Out</NavDropdown.Item>
							</NavDropdown>
						) : (
							<Nav.Link href="/signin">Sign In</Nav.Link>
						)}
					</Nav>
				</Navbar.Collapse>
			</Container>
		</Navbar>
	);
	
	// return (
	// 	<AppBar position="static">
	// 		<Toolbar>
				
	// 		</Toolbar>
	// 	</AppBar>
	// );

}
