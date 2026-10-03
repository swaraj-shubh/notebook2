import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import api from '../../services/api'
import Navbar from '../../components/Navbar'
import Sidebar from '../../components/Sidebar'
import { FiUsers, FiFileText, FiActivity, FiGrid } from 'react-icons/fi'
import Users from './Users'
import Notes from './Notes'
import { cache } from '../../lib/cache'

const TABS = [
  { id: 'overview', label: 'Overview', icon: FiGrid },
  { id: 'users', label: 'Users', icon: FiUsers },
  { id: 'notes', label: 'Notes', icon: FiFileText },
]

const AdminDashboard = () => {
  const [params, setParams] = useSearchParams()
  const tab = TABS.some((t) => t.id === params.get('tab')) ? params.get('tab') : 'overview'
  const [stats, setStats] = useState(cache.get('stats') ?? { total_users: 0, total_notes: 0 })
  const [loading, setLoading] = useState(!cache.has('stats'))

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await api.get('/admin/stats')
      setStats(response.data)
      cache.set('stats', response.data)
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const statCards = [
    { title: 'Total Users', value: stats.total_users, icon: FiUsers, color: 'bg-bark' },
    { title: 'Total Notes', value: stats.total_notes, icon: FiFileText, color: 'bg-success' },
  ]

  return (
    <div>
      <Navbar />
      <Sidebar />
      
      <div className="md:ml-70 animate-fade-up p-4 pb-32 md:p-7">
        <h1 className="text-3xl font-bold text-ink mb-6">Admin Panel</h1>

        <div className="flex flex-wrap gap-3 mb-8" role="tablist">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              role="tab"
              aria-selected={tab === id}
              onClick={() => setParams(id === 'overview' ? {} : { tab: id })}
              className={`flex items-center gap-2 px-5 py-2.5 relative overflow-hidden font-semibold cursor-pointer rounded-2xl transition-all duration-200 hover:-translate-y-0.5 active:scale-95 hover:bg-bark hover:text-[#eae5d3] ${
                tab === id ? 'bg-accent text-on-accent shadow-clay-btn' : 'bg-soft text-ink-2 shadow-clay-sm'
              }`}
            >
              <Icon size={18} /> {label}
            </button>
          ))}
        </div>

        {tab === 'users' && <Users />}
        {tab === 'notes' && <Notes />}
        {tab === 'overview' && (loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {statCards.map((stat, idx) => {
                const Icon = stat.icon
                return (
                  <div key={idx} className="bg-card shadow-clay rounded-3xl p-6">
                    <div className="flex items-center">
                      <div className={`${stat.color} p-3 rounded-2xl`}>
                        <Icon className="text-white" size={24} />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm text-muted">{stat.title}</p>
                        <p className="text-2xl font-bold text-ink">{stat.value}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-card shadow-clay rounded-3xl p-6">
                <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
                <div className="space-y-2">
                  <p className="text-ink-2">• Manage users from the Users tab</p>
                  <p className="text-ink-2">• Review all notes from the Notes tab</p>
                  <p className="text-ink-2">• Delete inappropriate content</p>
                </div>
              </div>
              
              <div className="bg-card shadow-clay rounded-3xl p-6">
                <h2 className="text-xl font-semibold mb-4">System Info</h2>
                <div className="space-y-2">
                  <p className="text-ink-2">✅ API Status: Online</p>
                  <p className="text-ink-2">✅ Database: Connected</p>
                  <p className="text-ink-2">✅ Admin Access: Enabled</p>
                </div>
              </div>
            </div>
          </>
        ))}
      </div>
    </div>
  )
}

export default AdminDashboard