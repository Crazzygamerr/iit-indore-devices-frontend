import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useAuth } from '../Auth';

export default function ForgotPassword() {
	const [password, setPassword] = useState();
	const [hash, setHash] = useState(null);
	
	const { user } = useAuth();
	
	useEffect(() => {
		// setHash(window.location.hash);
	}, []);
	
	const handleSubmit = async (e) => {
		e.preventDefault();
		
		if (!hash) {
			console.log('no hash');
		} else if (hash) {
			/* const hashArr = hash
				.substring(1)
				.split("&")
				.map((param) => param.split("="));

			let type;
			let accessToken;
			for (const [key, value] of hashArr) {
				if (key === "type") {
					type = value;
				} else if (key === "access_token") {
					accessToken = value;
				}
			}

			if (
				type !== "recovery" ||
				!accessToken ||
				typeof accessToken === "object"
			) {
				console.log("Invalid token");
				return;
			} */
		}
	}
	
	return (
		<div style={{padding: '1%'}}>
			<h3>Forgot Password</h3>
			<form onSubmit={handleSubmit}>
				<label>
					Password:
					<input type="password" value={password} onChange={e => setPassword(e.target.value)} />
				</label>
				<br />
				<button type="submit">Submit</button>
			</form>
		</div>
	);
}