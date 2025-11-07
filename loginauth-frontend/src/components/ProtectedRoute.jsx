import React from 'react'
import { Navigate } from 'react-router-dom'
import { getToken, getCurrentUser } from '../services/auth'

export default function ProtectedRoute({ children, requireRole }) {
  const token = getToken()
  if (!token) return <Navigate to="/login" replace />

  if (requireRole) {
    const user = getCurrentUser()
    if (!user || !user.roles.includes(requireRole)) {
      return <Navigate to="/" replace />
    }
  }

  return children
}
