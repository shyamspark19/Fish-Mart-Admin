import React, { useContext } from 'react'
import { Navigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const auth = useContext(AuthContext)
  const isLoggedIn = Boolean(auth?.user)

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}
