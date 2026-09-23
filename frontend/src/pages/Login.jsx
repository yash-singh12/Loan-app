import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const [email, setEmail] = useState('admin@demo.com')
  const [password, setPassword] = useState('Admin@123')
  const [err, setErr] = useState('')
  const { login } = useAuth()
  const nav = useNavigate()

  async function submit(e) {
    e.preventDefault()
    setErr('')
    try {
      await login(email, password)
      nav('/')
    } catch (e) {
      console.log(e)
      setErr('Invalid credentials')
    }
  }

  return (
    <div className="center">
      <form className="card" onSubmit={submit}>
        <h2>Loan Admin Login</h2>
        <p className="muted">Admin: admin@demo.com / Admin@123<br />Viewer: viewer@demo.com / Viewer@123</p>
        {err != '' && <div className="error">{err}</div>}
        <label>Email
          <input value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <label>Password
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>
        <button type="submit">Login</button>
      </form>
    </div>
  )
}
