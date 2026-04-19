import api from './api'
import toast from 'react-hot-toast'

export const authService = {
  async register(email, password) {
    try {
      // Make sure we're sending the exact format backend expects
      const response = await api.post('/auth/register', { 
        email: email, 
        password: password 
      })
      toast.success('Registration successful! Please login.')
      return response.data
    } catch (error) {
      console.error('Registration error:', error.response?.data)
      const message = error.response?.data?.detail || 'Registration failed'
      toast.error(message)
      throw error
    }
  },

  async login(email, password) {
    try {
      const response = await api.post('/auth/login', { 
        email: email, 
        password: password 
      })
      const { access_token } = response.data
      
      localStorage.setItem('token', access_token)
      
      // Decode token to get user info
      try {
        const payload = JSON.parse(atob(access_token.split('.')[1]))
        const user = { id: payload.sub, role: payload.role, email: email }
        localStorage.setItem('user', JSON.stringify(user))
      } catch (e) {
        console.error('Token decode error:', e)
      }
      
      toast.success('Login successful!')
      return response.data
    } catch (error) {
      console.error('Login error:', error.response?.data)
      const message = error.response?.data?.detail || 'Login failed'
      toast.error(message)
      throw error
    }
  },

  logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    toast.success('Logged out successfully')
  },

  getCurrentUser() {
    const userStr = localStorage.getItem('user')
    if (userStr) {
      return JSON.parse(userStr)
    }
    return null
  },

  getToken() {
    return localStorage.getItem('token')
  }
}