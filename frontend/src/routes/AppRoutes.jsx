import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import Login from '../pages/Auth/Login'
import Register from '../pages/Auth/Register'
import Dashboard from '../pages/Dashboard/Dashboard'
import CreateNote from '../pages/Dashboard/CreateNote'
import EditNote from '../pages/Dashboard/EditNote'
import AdminDashboard from '../pages/Admin/AdminDashboard'
import Users from '../pages/Admin/Users'
import AdminNotes from '../pages/Admin/Notes'
import ServerLoading from '@/pages/Loading/ServerLoading'

const PrivateRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useAuth()
  
  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>
  
  if (!user) return <Navigate to="/login" />
  
  if (adminOnly && user.role !== 'admin') return <Navigate to="/dashboard" />
  
  return children
}

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
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
      
      <Route path="/admin/users" element={
        <PrivateRoute adminOnly={true}>
          <Users />
        </PrivateRoute>
      } />
      
      <Route path="/admin/notes" element={
        <PrivateRoute adminOnly={true}>
          <AdminNotes />
        </PrivateRoute>
      } />
      
      {/* <Route path="/" element={<Navigate to="/dashboard" />} /> */}
      <Route path="/" element={<ServerLoading />} />
    </Routes>
  )
}

export default AppRoutes