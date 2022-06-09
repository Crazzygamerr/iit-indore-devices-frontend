import { useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { useAuth } from '../Auth';
import "bootstrap/dist/css/bootstrap.min.css";

const divStyle = {
	padding: '1%',
	width: '100%',
	maxWidth: '300px',
};

export default function Signup() {
	const emailRef = useRef();
	const passwordRef = useRef();
	const { user } = useAuth();
	const location = useLocation();
	
  async function handleSubmit(e) {
    e.preventDefault()

    const email = emailRef.current.value
		const password = passwordRef.current.value
		
		if (location.pathname === '/signup') {			
			supabase.auth.signUp({ email, password }).then(() => {
				window.location.href = '/';
			}).catch((error) => {
				console.log(error);
			});
		} else {
			if (password === "") {
				supabase.auth.signIn({ email })
					.then(() => {
						window.location.href = '/';
					}).catch((error) => {
						console.log(error);
					});
			} else {
				supabase.auth.signIn({ email, password })
					.then(() => {
						window.location.href = '/';
					}).catch((error) => {
						console.log(error);
					});
			}
		}
  }
	
	useEffect(() => {
		if (user) {
			window.location.href = '/';
		}
	}, [user]);
	
  return (
		<div style={divStyle}>
			<h3>{location.pathname === "/signup" ? "Sign Up" : "Sign In"}</h3>
			<form onSubmit={handleSubmit}>
				<div className='form-group'>
					<label>Email</label>
					<input id="input-email" className='form-control' type="email" ref={emailRef} />
				</div>
				<br />
				<div>
					<label htmlFor="input-password">Password</label>
					<input id="input-password" className='form-control' type="password" ref={passwordRef} />
				</div>
				<br />
        <button type="submit" className='btn btn-primary'>{location.pathname === "/signup" ? "Sign Up" : "Sign In"}</button>
      </form>
      <br />
			{ location.pathname === "/signup" ? (
				<p>
    	    Already have an account? <Link to="/signin">Log In</Link>
				</p>
			) : (
					<p>
						Don't have an account? <Link to="/signup">Sign Up</Link>
					</p>
				)
			}
    </div>
  )
}