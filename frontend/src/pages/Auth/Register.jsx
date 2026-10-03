import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import GuestButton from '../../components/GuestButton'
import toast from 'react-hot-toast'

const Register = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validation
    if (!email || !password) {
      toast.error('Please fill all fields')
      return
    }
    
    if (password !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }
    
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }
    
    setLoading(true)
    try {
      await register(email, password)
      navigate('/login')
    } catch (error) {
      // Error already handled in authService
      console.error('Registration failed:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-lg w-full mx-4 space-y-8 p-6 sm:p-10 bg-card shadow-clay rounded-3xl animate-pop-in">
        <div>
          <h2 className="text-center text-3xl font-bold text-ink">Register</h2>
          <p className="mt-2 text-center text-sm text-ink-2">
            Or{' '}
            <Link to="/login" className="text-link hover:text-link-hover">
              login to <span className='text-blue-700'>existing account</span>
            </Link>
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-ink-2">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 bg-field text-ink rounded-2xl shadow-clay-in focus:outline-none focus:ring-2 focus:ring-accent placeholder:text-muted mt-1"
              placeholder="you@example.com"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-ink-2">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 bg-field text-ink rounded-2xl shadow-clay-in focus:outline-none focus:ring-2 focus:ring-accent placeholder:text-muted mt-1"
              placeholder="Must be 6+ chars with uppercase & number"
            />
            <p className="text-xs text-muted mt-1">
              Password must contain at least 6 characters, one uppercase letter and one number
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-ink-2">Confirm Password</label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 bg-field text-ink rounded-2xl shadow-clay-in focus:outline-none focus:ring-2 focus:ring-accent placeholder:text-muted mt-1"
              placeholder="Confirm your password"
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full px-8 py-3 relative overflow-hidden font-semibold cursor-pointer transition-all duration-200 hover:-translate-y-0.5 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed rounded-2xl bg-accent text-on-accent shadow-clay-btn hover:bg-accent-hover hover:text-bark active:shadow-clay-press"
          >
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>
        <GuestButton />
        
        {/* Test credentials info */}
        {/* <div className="mt-4 p-3 bg-soft2 rounded-2xl">
          <p className="text-xs text-link">
            ℹ️ Test admin account: ?????@???????.??? / ????????
          </p>
        </div> */}
        <div className="mt-6 text-center">
          <p className="text-sm text-muted"> 
            Looking for the old version?{" "}
            <a
              href="https://notebook.shubhh.xyz"
              target="_blank"
              rel="noopener noreferrer"
              className="text-link hover:text-link-hover font-medium"
            >
              Open here ↗
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Register