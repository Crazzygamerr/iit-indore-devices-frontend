import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../Utils/Auth';
import { Spacer } from '../components/spacer.component';
import Toast from '../components/toast/toast.component';
import { checkIfEmailExists } from '../Utils/utilities';
import { supabase } from '../Utils/supabaseClient';
import './signup.css';

export default function Signup() {
	const emailRef = useRef();
	const forgotEmailRef = useRef();
	const passwordRef = useRef();

	const { user } = useAuth();
	const location = useLocation();
	const navigate = useNavigate();

	const [toastDetails, setToastDetails] = useState({
		title: '',
		description: '',
		isError: true,
	});
	const [showForgotDialog, setShowForgotDialog] = useState(false);

	async function forgotPassword(e) {
		e.preventDefault();
		const email = forgotEmailRef.current.value;

		if (!(await checkIfEmailExists(email))) {
			setToastDetails({
				title: 'Error',
				description: 'Email id does not exist.',
				isError: true,
			});
			return;
		}

		const { data, error } = await supabase.auth.signIn({
			email: email,
		});

		if (error) {
			setToastDetails({
				title: 'Error',
				description: error.message,
				isError: true,
			});
		} else {
			setToastDetails({
				title: 'Success',
				description: 'Check your email for a login link.',
				isError: false,
			});
			setShowForgotDialog(false);
		}
	}

	async function handleSubmit(e) {
		e.preventDefault()

		const email = emailRef.current.value
		const password = passwordRef.current.value

		let resError = null;
		if (location.pathname === '/signup') {

			if (await checkIfEmailExists(email)) {
				setToastDetails({
					title: 'Error',
					description: 'Email id already exists.',
					isError: true,
				});
				return;
			}

			const { error, user, session } = await supabase.auth.signUp({ email, password });

			if (user && !session) {
				resError = {
					description: 'You have successfully signed up. Please check your email to confirm your account.',
					isError: false
				};
			} else if (error || !user || !session) {
				resError = {
					title: 'Error',
					description: error.message || 'Something went wrong. Please try again later.',
					isError: true
				};
			} else {
				navigate("/");
			}
		} else {
			const { error, user, session } = await supabase.auth.signIn({ email, password });

			if (error || !user || !session) {
				resError = {
					title: 'Error',
					description: error.message || 'Something went wrong. Please try again later.',
					isError: true
				};
			} else {
				navigate("/");
			}
		}
		if (resError) {
			setToastDetails({
				title: resError.title,
				description: resError.description,
				isError: resError.isError
			});
		}
	}

	useEffect(() => {
		if (user) {
			navigate("/");
		}
	}, [user, navigate]);

	return (
		<div className='centered-div'>
			
			<Toast toastDetails={toastDetails} />

			{showForgotDialog &&
				<div className="dialog-backdrop">
					<div
						className="dialog-container"
						style={{
							maxWidth: '300px',
						}}
					>
						<h3>Forgot Password?</h3>
						<p>Enter your email id to recieve a link to get back into your account</p>
						<form onSubmit={forgotPassword}>
							<input
								type="email"
								placeholder="Email"
								ref={forgotEmailRef}
								required
								onInvalid={(e) => { e.target.setCustomValidity('Please enter a valid email address'); }}
								onChange={(e) => { e.target.setCustomValidity(''); }}
							/>
							<Spacer />
							<div
								style={{
									display: 'flex',
									justifyContent: 'space-between',
								}}>
								<button
									onClick={() => setShowForgotDialog(false)}>
									Cancel
								</button>
								<button
									type="submit"
								>Send</button>
							</div>
						</form>
					</div>
				</div>
			}

			<div style={{ margin: '20px' }}></div>
			<h3>{location.pathname === "/signup" ? "Sign Up" : "Sign In"}</h3>
			<div className="github-grey-div">
				<form onSubmit={handleSubmit}>
					<div className='form-group'>
						<label>Email</label>
						<input
							id="input-email"
							type="email"
							required
							onInvalid={(e) => { e.target.setCustomValidity('Please enter a valid email address'); }}
							onChange={(e) => { e.target.setCustomValidity(''); }}
							ref={emailRef} />
					</div>
					<br />
					<div>
						<label htmlFor="input-password">
							Password
							{location.pathname === "/signin" &&
								<Link
									className='forgot-password-link'
									to="" onClick={() => {
										setShowForgotDialog(true);
									}}>
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
						style={{ width: '100%', }}>
						{location.pathname === "/signup" ? "Sign Up" : "Sign In"}
					</button>
				</form>
			</div>
			<div className='plain-div'>
				{location.pathname === "/signup" ? (
					<p style={{ marginTop: '10px' }}>
						Already have an account? <Link to="/signin">Sign In</Link>
					</p>
				) : (
					<p style={{ marginTop: '10px' }}>
						Don't have an account? <Link to="/signup">Sign Up</Link>
					</p>
				)
				}
			</div>
		</div>
	)
}