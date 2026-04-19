import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { FiLogOut, FiUser, FiShield } from 'react-icons/fi'

const Navbar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/dashboard" className="flex items-center space-x-2">
              <img 
                src="/notebook.png" 
                alt="Notebook Logo" 
                className="h-8 w-8 object-contain"
              />
              <span className="text-xl font-bold text-gray-800">Notebook</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {user?.role === 'admin' && (
              <Link
                to="/admin"
                className="flex items-center space-x-1 text-gray-600 hover:text-gray-900"
              >
                <FiShield />
                <span>Admin</span>
              </Link>
            )}
            
            <div className="flex items-center space-x-2">
              <FiUser className="text-gray-600" />
              <span className="text-gray-700">{user?.email || 'User'}</span>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center cursor-pointer space-x-1 text-red-600 hover:text-red-700"
            >
              <FiLogOut />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar