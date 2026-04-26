import { Link, useLocation } from 'react-router-dom'
import { FiHome, FiPlus, FiList, FiShield, FiExternalLink } from 'react-icons/fi'
import { useAuth } from '../hooks/useAuth'

const Sidebar = () => {
  const location = useLocation()
  const { user } = useAuth()

  const menuItems = [
    { path: '/dashboard', icon: FiHome, label: 'Dashboard' },
    { path: '/create-note', icon: FiPlus, label: 'Create Note' },
  ]

  const adminItems = [
    { path: '/admin', icon: FiShield, label: 'Admin Dashboard' },
    { path: '/admin/users', icon: FiList, label: 'Manage Users' },
    { path: '/admin/notes', icon: FiList, label: 'Manage Notes' },
  ]

  const items = user?.role === 'admin' ? [...menuItems, ...adminItems] : menuItems

  return (
    <aside className="w-64 bg-white shadow-lg h-screen fixed left-0 top-0 mt-16 flex flex-col justify-between">
      <nav className="mt-8">
        {items.map((item) => {
          const Icon = item.icon
          const isActive = location.pathname === item.path
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-3 px-6 py-3 mx-4 rounded-lg transition duration-200 ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="mb-24 px-4">
        <div className="border-t pt-4">
          <p className="text-xs text-gray-500 mb-2">
            Old version
          </p>

          <a
            href="https://notebook.shubhh.xyz"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between text-sm text-blue-600 hover:text-blue-500"
          >
            <span>Open Notebook v1</span>
            <FiExternalLink size={16} />
          </a>
        </div>
      </div>

    </aside>
  )
}

export default Sidebar