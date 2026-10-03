import { createContext, useState, useEffect } from 'react'
import { authService } from '../services/authService'
import { cache } from '../lib/cache'

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      const userData = authService.getCurrentUser()
      setUser(userData)
    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    cache.clear() // never show another user's cached data
    const response = await authService.login(email, password)
    const userData = authService.getCurrentUser()
    setUser(userData)
    return response
  }

  const register = async (email, password) => {
    const response = await authService.register(email, password)
    return response
  }

  const logout = () => {
    authService.logout()
    cache.clear()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}