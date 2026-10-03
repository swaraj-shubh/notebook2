import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { FiGlobe } from 'react-icons/fi'

// Shared public account: everyone who continues as guest sees the same notes.
const GUEST = { email: 'unknown@unknown.com', password: '123456' }

const GuestButton = () => {
  const { login, register } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const handleClick = async () => {
    setLoading(true)
    try {
      try {
        await login(GUEST.email, GUEST.password)
      } catch {
        // first use: account doesn't exist yet
        await register(GUEST.email, GUEST.password)
        await login(GUEST.email, GUEST.password)
      }
      navigate('/dashboard')
    } catch (error) {
      console.error('Guest login failed:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="pt-2">
      <div className="flex items-center gap-3 text-xs text-muted mb-4">
        <span className="flex-1 border-t" /> or <span className="flex-1 border-t" />
      </div>
      <button type="button" onClick={handleClick} disabled={loading} className="w-full px-8 py-3 flex items-center justify-center gap-2 relative overflow-hidden font-semibold cursor-pointer transition-all duration-200 hover:-translate-y-0.5 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed rounded-2xl bg-soft text-ink-2 shadow-clay-btn hover:bg-bark hover:text-[#eae5d3] active:shadow-clay-press">
        <FiGlobe /> {loading ? 'Entering...' : 'Continue without login (Global Notebook)'}
      </button>
    </div>
  )
}

export default GuestButton
