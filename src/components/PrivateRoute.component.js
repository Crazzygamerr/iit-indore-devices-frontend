import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../Auth';

export default function PrivateRoute() {
	const { user } = useAuth();
	return user ? <Outlet /> : <Navigate to="/signin" />;
}