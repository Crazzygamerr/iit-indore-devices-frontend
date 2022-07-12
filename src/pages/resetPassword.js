import React, { useRef } from 'react';
import { useAuth } from '../Utils/Auth';
import { Spacer } from '../components/spacer';
import { supabase } from '../Utils/supabaseClient';
import { useNavigate } from 'react-router-dom';

export default function ResetPassword() {
	const password = useRef();
	const navigate = useNavigate();
	
	async function handleSubmit(e) {
		e.preventDefault();
		
		const { data, error } = await supabase.auth.update({
			password: password.current.value,
		});
		
		if (error) {
			console.log(error);
		} else {
			navigate('/');
		}
	}

	// useEffect(() => {
	// 	// setHash(window.location.hash);
	// }, []);

	// const handleSubmit = async (e) => {
	// 	e.preventDefault();

	// 	if (!hash) {
	// 		console.log('no hash');
	// 	} else if (hash) {
	// 		const hashArr = hash
	// 			.substring(1)
	// 			.split("&")
	// 			.map((param) => param.split("="));

	// 		let type;
	// 		let accessToken;
	// 		for (const [key, value] of hashArr) {
	// 			if (key === "type") {
	// 				type = value;
	// 			} else if (key === "access_token") {
	// 				accessToken = value;
	// 			}
	// 		}

	// 		if (
	// 			type !== "recovery" || !accessToken ||
	// 			typeof accessToken === "object"
	// 		) {
	// 			console.log("Invalid token");
	// 			return;
	// 		}
	// 	}
	// }

	return (
		<div className='centered-div'>
			<Spacer height='20px'/>
			<h3>Forgot Password</h3>
			<div className='github-grey-div'>
				<form onSubmit={handleSubmit}>
					<label>
						New Password:
					</label>
					<div style={{
						margin: '10px',
						maxWidth: '300px',
					}}>
						<input
							type="password"
							ref={password}
							required
							pattern=".{6,}"
							onInvalid={(e) => { e.target.setCustomValidity('Password must be at least 6 characters long'); }}
							onChange={(e) => { e.target.setCustomValidity(''); }}
						/>
					</div>
					<br />
					<button
						type="submit"
						style={{ width: '100%' }}>
						Submit</button>
				</form>
			</div>
		</div>
	);
}