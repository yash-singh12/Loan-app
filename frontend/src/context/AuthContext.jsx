import { createContext, useContext, useEffect, useState } from 'react'
import api from '../api/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function checkLogin() {
      const token = localStorage.getItem('token')
      if (!token) {
        setLoading(false)
        return
      }
      try {
        const res = await api.get('/auth/me')
        setUser(res.data.user)
      } catch (e) {
        console.log(e)
        localStorage.removeItem('token')
      }
      setLoading(false)
    }
    checkLogin()
  }, [])

  async function login(email, password) {
    const res = await api.post('/auth/login', { email: email, password: password })
    localStorage.setItem('token', res.data.token)
    setUser(res.data.user)
  }

  function logout() {
    localStorage.removeItem('token')
    setUser(null)
  }

  let isAdmin = false
  if (user && user.role == 'admin') isAdmin = true

  return (
    <AuthContext.Provider value={{ user, login, logout, isAdmin, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
