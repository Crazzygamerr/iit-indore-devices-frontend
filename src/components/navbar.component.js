//import { Nav, Navbar, NavDropdown } from 'react-bootstrap';
import "bootstrap/dist/css/bootstrap.min.css";
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav, Container } from "react-bootstrap";

export default class MyNavbar extends Component {
	render() {
		return (
			<Navbar collapseOnSelect bg="dark" variant="dark" expand="lg">
				<Container fluid>
					<Navbar.Brand href="/">IIT Indore Devices</Navbar.Brand>
					<Navbar.Toggle aria-controls="basic-navbar-nav" />
					<Navbar.Collapse id="basic-navbar-nav">
						<Nav className="me-auto">
							<Nav.Link href="/addDevice">Add Device</Nav.Link>
						</Nav>
					</Navbar.Collapse>
				</Container>
			</Navbar>
		);
	}
}
