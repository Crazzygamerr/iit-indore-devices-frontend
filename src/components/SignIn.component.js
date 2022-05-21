import { useRef } from 'react'
import { supabase } from '../supabaseClient'
import { Link } from 'react-router-dom'

export default function SignIn() {
  const emailRef = useRef()
  const passwordRef = useRef()

  async function handleSubmit(e) {
    e.preventDefault()

    const email = emailRef.current.value
		const password = passwordRef.current.value
		
		var error;
		if (password == "") {
			error = await supabase.auth.signIn({ email });
		} else {
			error = await supabase.auth.signIn({ email, password });
		}

    if (error) {
			alert('error signing in');
			console.log(error);
    } else {
			window.location.href = '/';
    }
  }

  return (
		<>
			<h1>Sign In</h1>
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
        <button type="submit" className='btn btn-primary'>Sign ip</button>
      </form>
      <br />
			<p>
        Don't have an account? <Link to="/signup">Sign Up</Link>
      </p>
    </>
  )
}