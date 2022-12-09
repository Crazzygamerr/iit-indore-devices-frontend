import React from 'react';
import { useAuth } from "../../Utils/Auth";
import { Nav, Navbar, NavDropdown } from 'react-bootstrap';
import { Container } from "react-bootstrap";
import { supabase } from "../../Utils/supabaseClient";
import 'bootstrap/dist/css/bootstrap.min.css';
// import './navbar.css';

export default function MyNavbar() {
	const { user } = useAuth();
	
	return (
		<Navbar collapseOnSelect bg="dark" variant="dark" expand="md">
			<Container fluid>
				<Navbar.Brand href="/">Slot Booking</Navbar.Brand>
				{user &&
					<Navbar.Toggle aria-controls="basic-navbar-nav" />
				}
				{user &&
					<Navbar.Collapse id="basic-navbar-nav">
						<Nav className="me-auto">
							{user.isAdmin &&
								<Nav>
									<Nav.Link href="/devices">Devices</Nav.Link>
								</Nav>
							}
							<Nav>
								<Nav.Link href="/bookings">Bookings</Nav.Link>
							</Nav>
						</Nav>
						<Nav className="">
							<NavDropdown title={user.email} id="basic-nav-dropdown">
								<NavDropdown.Item href="/reset-password">Reset Password</NavDropdown.Item>
								<NavDropdown.Item onClick={() => { supabase.auth.signOut() }}>Sign Out</NavDropdown.Item>
							</NavDropdown>
						</Nav>
					</Navbar.Collapse>
				}
			</Container>
		</Navbar>
	);
}
