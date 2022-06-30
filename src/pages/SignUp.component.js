import { useEffect, useRef} from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { useAuth } from '../Auth';
import './signup.css';

const noBorderDiv = {
	height: '5em',
	width: '100%',
	maxWidth: '300px',
	padding: '16px',
	border: '1px solid #d0d7de',
	borderRadius: '5px',
	backgroundColor: '#fff',
	textAlign: 'center',
}

export default function Signup() {
	const emailRef = useRef();
	const passwordRef = useRef();
	
	const { user } = useAuth();
	const location = useLocation();
	const navigate = useNavigate();
	
  async function handleSubmit(e) {
    e.preventDefault()

    const email = emailRef.current.value
		const password = passwordRef.current.value
		
		if (location.pathname === '/signup') {
			supabase.auth.signUp({ email, password }).then((response) => {
				navigate("/");
			}).catch((error) => {
				console.log(error);
			});
		} else {
			supabase.auth.signIn({ email, password })
				.then(() => {
					navigate("/");
				}).catch((error) => {
					console.log(error);
				});
		}
  }
	
	useEffect(() => {
		if (user) {
			navigate("/");
		}
	}, [user, navigate]);
	
  return (
		<div className='main-div'>
			<div style={{margin: '20px'}}></div>
			<h3>{location.pathname === "/signup" ? "Sign Up" : "Sign In"}</h3>
			<div className="github-grey-div">
				<form onSubmit={handleSubmit}>
					<div className='form-group'>
						<label>Email</label>
						<input
							id="input-email"
							type="email"
							required
							onInvalid={(e) => {e.target.setCustomValidity('Please enter a valid email address');}}
							onChange={(e) => {e.target.setCustomValidity('');}}
							ref={emailRef} />
					</div>
					<br />
					<div>
						<label htmlFor="input-password">
							Password
							{ location.pathname === "/signin" &&
								<Link
									className='forgot-password-link'
									to="" onClick={() => { }}>
									Forgot Password?
								</Link>
							}
						</label>
						<input
							id="input-password"
							type="password"
							required
							pattern=".{6,}"
							onInvalid={(e) => { e.target.setCustomValidity('Password must be at least 6 characters long'); }}
							onChange={(e) => { e.target.setCustomValidity(''); }}
							ref={passwordRef} />
					</div>
					<br />
					<button
						type="submit"
						style={{width: '100%',}}>
						{location.pathname === "/signup" ? "Sign Up" : "Sign In"}
					</button>
				</form>
			</div>
			<div style={noBorderDiv}>
				{ location.pathname === "/signup" ? (
					<p style={{marginTop: '10px'}}>
						Already have an account? <Link to="/signin">Log In</Link>
					</p>
				) : (
					<p style={{marginTop: '10px'}}>
						Don't have an account? <Link to="/signup">Sign Up</Link>
					</p>
					)
				}
			</div>
		</div>
  )
}