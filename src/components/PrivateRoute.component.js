import React from 'react';
import { Route, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../Auth';

/* export default function PrivateRoute({ component: Component, ...rest }) {
	const { user } = useAuth();
	
	return (
		<Route
			{...rest}
			render={props =>
				user ? (
					<Component {...props} />
				) : (
					<Navigate to="/signin"/>
				)
			}
		></Route>
	);
} */

export default function PrivateRoute() {
	const { user } = useAuth();
	return user ? <Outlet /> : <Navigate to="/signin" />;
}