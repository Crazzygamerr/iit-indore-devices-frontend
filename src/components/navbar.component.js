import React from 'react';
import { useAuth } from "../Auth";
import { Nav, Navbar, NavDropdown } from 'react-bootstrap';
import { Container } from "react-bootstrap";
import { supabase } from "../supabaseClient";

// import './navbar.css';

export default function MyNavbar() {
	const { user } = useAuth();
	
	return (
		<Navbar collapseOnSelect bg="dark" variant="dark" expand="md">
			<Container fluid>
				<Navbar.Brand href="/">IIT Indore Devices</Navbar.Brand>
				<Navbar.Toggle aria-controls="basic-navbar-nav" />
				<Navbar.Collapse id="basic-navbar-nav">				
					<Nav className="me-auto">
						{ user && user.isAdmin &&
							<Nav>
								<Nav.Link href="/devices">Device List</Nav.Link>
								<Nav.Link href="/equipments">Equipment List</Nav.Link>
							</Nav>
						}
					</Nav>
					<Nav className="">
						{user ? (
							<NavDropdown title={user.email} id="basic-nav-dropdown">
								<NavDropdown.Item onClick={() => {supabase.auth.signOut()}}>Sign Out</NavDropdown.Item>
							</NavDropdown>
						) : (
							<></>
						)}
					</Nav>
				</Navbar.Collapse>
			</Container>
		</Navbar>
	);
	
	/* return (
		<nav className="navbar">
			<a href="/" className="brand-logo">IIT Indore Devices</a>
			<ul className="navbar-links">
				{user && user.isAdmin &&
					<li><a href="/addDevice">Add Device</a></li>
				}
				{user ? (
					<li><a href="/signout">Sign Out</a></li>
				) : (
					<li><a href="/signin">Sign In</a></li>
				)}
			</ul>
		</nav>
	); */

}
