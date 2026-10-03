import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useState } from 'react'
import { FiLogOut, FiUser, FiShield, FiSun, FiMoon } from 'react-icons/fi'

const Navbar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [dark, setDark] = useState(document.documentElement.dataset.theme === 'dark')

  const toggleTheme = () => {
    const next = dark ? 'light' : 'dark'
    document.documentElement.dataset.theme = next
    localStorage.setItem('theme', next)
    setDark(!dark)
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="sticky top-3 z-50 mx-3 mt-3 bg-card rounded-3xl shadow-clay">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/dashboard" className="flex items-center gap-2 px-3 py-2 rounded-2xl hover:bg-soft hover:text-hover-ink transition-all duration-200">
              <img 
                src="/notebook.png" 
                alt="Notebook Logo" 
                className="h-8 w-8 object-contain"
              />
              <span className="text-xl font-bold text-ink">Notebook 2.0</span>
            </Link>
          </div>

          <div className="flex items-center gap-2 sm:gap-4 ml-auto">
            {user?.role === 'admin' && (
              <Link
                to="/admin"
                className="flex items-center gap-1.5 px-3 py-2 rounded-2xl text-ink-2 hover:text-hover-ink hover:bg-soft hover:shadow-clay-sm hover:-translate-y-0.5 active:scale-95 transition-all duration-200"
              >
                <FiShield />
                <span className="hidden sm:inline">Admin</span>
              </Link>
            )}
            
            <div className="flex items-center gap-2 px-3 py-2">
              <FiUser className="text-ink-2" />
              <span className="hidden md:inline text-ink-2">{user?.email || 'User'}</span>
            </div>

            <button
              onClick={toggleTheme}
              className="relative overflow-hidden flex items-center cursor-pointer p-2 rounded-xl text-ink-2 hover:text-hover-ink hover:bg-soft hover:shadow-clay-sm hover:-translate-y-0.5 active:scale-95 transition-all duration-200"
              title={dark ? 'Switch to light mode' : 'Switch to dark mode'}
              aria-label="Toggle theme"
            >
              {dark ? <FiSun size={18} /> : <FiMoon size={18} />}
            </button>

            <button
              onClick={handleLogout}
              className="relative overflow-hidden flex items-center gap-1.5 px-3 py-2 rounded-2xl font-semibold cursor-pointer bg-[#d9776a] text-black shadow-clay-btn hover:bg-[#e08a7e] hover:text-black hover:-translate-y-0.5 active:scale-95 active:shadow-clay-press transition-all duration-200"
            >
              <FiLogOut />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar