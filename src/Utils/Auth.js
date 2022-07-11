import React, { useState, useEffect, useContext } from 'react';
import { supabase } from './supabaseClient';

const AuthContext = React.createContext();

export function AuthProvider({ children }) {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);
	
	const checkAndSetUser = async (session) => {
		if (session) {
			supabase
				.from('users').then(response => {
					setUser({ ...session.user, isAdmin: response.data[0].isAdmin });
					setLoading(false);
				})
				.catch(function (error) {
					console.log(error);
					setUser(null);
				});
		} else {
			setUser(null);
			setLoading(false);
		}
	};
	
	useEffect(() => {
		const session = supabase.auth.session();
		
		checkAndSetUser(session);
		
		const { data: listener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
				checkAndSetUser(session);
      }
    )
		
		return () => {
			listener.unsubscribe()
		};
	}, []);
	
	const value = {
		user,
	};
	
	return (
		<AuthContext.Provider value={{ user }}>
			{!loading && children}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	return useContext(AuthContext);
}