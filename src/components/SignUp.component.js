import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import "bootstrap/dist/css/bootstrap.min.css";

export default function Signup() {
  const emailRef = useRef()
  const passwordRef = useRef()

  async function handleSubmit(e) {
    e.preventDefault()

    const email = emailRef.current.value
		const password = passwordRef.current.value
		
    const { error } = await supabase.auth.signUp({ email, password })

    if (error) {
			console.log(error);
    } else {
      window.location.href = '/'
    }
  }

  return (
		<>
			<h1> Sign Up </h1>
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
        <button type="submit" className='btn btn-primary'>Sign up</button>
      </form>
      <br />
      <p>
        Already have an account? <Link to="/signin">Log In</Link>
      </p>
    </>
  )
}