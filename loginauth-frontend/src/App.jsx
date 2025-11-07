import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import AdminPage from './pages/AdminPage'
import AuditLogs from './pages/AuditLogs'
import ProtectedRoute from './components/ProtectedRoute'

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin" element={<ProtectedRoute requireRole="ROLE_ADMIN"><AdminPage /></ProtectedRoute>} />
        <Route path="/admin/audit" element={<ProtectedRoute requireRole="ROLE_ADMIN"><AuditLogs /></ProtectedRoute>} />
      </Routes>
    </Layout>
  )
}
