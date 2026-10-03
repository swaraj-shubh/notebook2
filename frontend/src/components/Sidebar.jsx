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
    <aside className="fixed z-40 bg-card shadow-clay rounded-3xl bottom-3 left-3 right-3 flex md:flex-col md:justify-between md:right-auto md:bottom-auto md:top-22 md:w-64 md:h-[calc(100vh-6.25rem)]">
      <nav className="flex flex-1 justify-around gap-2 p-2 md:flex-col md:justify-start md:gap-0 md:p-0 md:py-4">
        {items.map((item) => {
          const Icon = item.icon
          const isActive = location.pathname === item.path
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`max-md:flex-1 max-md:justify-center max-md:text-center flex flex-col md:flex-row items-center md:space-x-3 px-2 md:px-6 md:mb-2 py-2 md:py-3 md:mx-4 rounded-2xl text-xs md:text-base transition-all duration-200 ${
                isActive
                  ? 'bg-accent text-on-accent shadow-clay-btn hover:bg-bark hover:text-[#eae5d3] hover:scale-105'
                  : 'text-ink-2 hover:bg-bark hover:text-[#eae5d3] hover:shadow-clay-sm hover:scale-105'
              }`}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="hidden md:block mb-4 px-4">
        <div className="border-t border-line pt-4">
          <p className="text-xs text-muted mb-2">
            Old version
          </p>

          <a
            href="https://notebook.shubhh.xyz"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between text-sm text-link hover:text-link-hover"
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