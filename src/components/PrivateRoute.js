import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../Utils/Auth';

export function PrivateRoute() {
	const { user } = useAuth();
	return user ? <Outlet /> : <Navigate to="/signin" />;
}

export function AdminRoute() {
	const { user } = useAuth();
	return user && user.isAdmin ? <Outlet /> : <Navigate to="/" />;
}