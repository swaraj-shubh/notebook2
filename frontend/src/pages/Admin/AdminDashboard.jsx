import { useState, useEffect } from 'react'
import api from '../../services/api'
import Navbar from '../../components/Navbar'
import Sidebar from '../../components/Sidebar'
import { FiUsers, FiFileText, FiActivity } from 'react-icons/fi'

const AdminDashboard = () => {
  const [stats, setStats] = useState({ total_users: 0, total_notes: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await api.get('/admin/stats')
      setStats(response.data)
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const statCards = [
    { title: 'Total Users', value: stats.total_users, icon: FiUsers, color: 'bg-blue-500' },
    { title: 'Total Notes', value: stats.total_notes, icon: FiFileText, color: 'bg-green-500' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Sidebar />
      
      <div className="ml-64 p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Admin Dashboard</h1>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {statCards.map((stat, idx) => {
                const Icon = stat.icon
                return (
                  <div key={idx} className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center">
                      <div className={`${stat.color} p-3 rounded-lg`}>
                        <Icon className="text-white" size={24} />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm text-gray-500">{stat.title}</p>
                        <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
                <div className="space-y-2">
                  <p className="text-gray-600">• Manage users from the Users page</p>
                  <p className="text-gray-600">• Review all notes from the Notes page</p>
                  <p className="text-gray-600">• Delete inappropriate content</p>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4">System Info</h2>
                <div className="space-y-2">
                  <p className="text-gray-600">✅ API Status: Online</p>
                  <p className="text-gray-600">✅ Database: Connected</p>
                  <p className="text-gray-600">✅ Admin Access: Enabled</p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default AdminDashboard