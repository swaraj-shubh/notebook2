import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import Login from '../pages/Auth/Login'
import Register from '../pages/Auth/Register'
import Dashboard from '../pages/Dashboard/Dashboard'
import CreateNote from '../pages/Dashboard/CreateNote'
import EditNote from '../pages/Dashboard/EditNote'
import AdminDashboard from '../pages/Admin/AdminDashboard'
import NotFound from '../pages/NotFound'
import ServerLoading from '@/pages/Loading/ServerLoading'

const PrivateRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useAuth()
  
  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>
  
  if (!user) return <Navigate to="/login" />
  
  if (adminOnly && user.role !== 'admin') return <Navigate to="/dashboard" />
  
  return children
}

// login/register: already logged in -> straight to dashboard
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth()
  if (loading) return null
  return user ? <Navigate to="/dashboard" replace /> : children
}

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
      
      <Route path="/dashboard" element={
        <PrivateRoute>
          <Dashboard />
        </PrivateRoute>
      } />
      
      <Route path="/create-note" element={
        <PrivateRoute>
          <CreateNote />
        </PrivateRoute>
      } />
      
      <Route path="/edit-note/:id" element={
        <PrivateRoute>
          <EditNote />
        </PrivateRoute>
      } />
      
      <Route path="/admin" element={
        <PrivateRoute adminOnly={true}>
          <AdminDashboard />
        </PrivateRoute>
      } />
      
      {/* old admin URLs now live as tabs inside /admin */}
      <Route path="/admin/users" element={<Navigate to="/admin?tab=users" replace />} />
      <Route path="/admin/notes" element={<Navigate to="/admin?tab=notes" replace />} />

      {/* <Route path="/" element={<Navigate to="/dashboard" />} /> */}
      <Route path="/" element={<ServerLoading />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default AppRoutes