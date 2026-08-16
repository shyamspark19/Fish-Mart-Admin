import React, { useContext } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import Landing from './pages/Landing'
import Login from './pages/Login'
import AdminDashboard from './pages/AdminDashboard'
import { AuthProvider } from './context/AuthContext'
import { AuthContext } from './context/AuthContext'

// Redirect already-logged-in admins away from /login to /admin
function PublicRoute({ children }: { children: React.ReactNode }) {
  const auth = useContext(AuthContext)
  if (auth?.user) return <Navigate to="/admin" replace />
  return <>{children}</>
}

function AppRoutes() {
  return (
    <Routes>
      {/* Pre-login landing page */}
      <Route path="/" element={<Landing />} />

      {/* Login — redirect to /admin if already logged in */}
      <Route path="/login" element={
        <PublicRoute>
          <div className="p-4 sm:p-6 max-w-7xl mx-auto">
            <Login />
          </div>
        </PublicRoute>
      } />

      {/* Admin dashboard — protected, requires login */}
      <Route path="/admin" element={
        <ProtectedRoute>
          <div className="p-4 sm:p-6 max-w-7xl mx-auto">
            <AdminDashboard />
          </div>
        </ProtectedRoute>
      } />

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-[#050D1A] text-slate-100 font-sans flex flex-col">
        <Navbar />
        <main className="flex-1">
          <AppRoutes />
        </main>

        {/* Footer — hidden on landing page since Landing has its own */}
        <AdminFooter />
      </div>
    </AuthProvider>
  )
}

function AdminFooter() {
  const auth = useContext(AuthContext)
  // Only show the shared footer on admin/login pages, not on landing (which has its own)
  if (!auth?.user) return null
  return (
    <footer className="bg-slate-900 border-t border-cyan-500/20 py-6 px-4 text-center text-xs text-slate-400">
      <div className="max-w-6xl mx-auto space-y-2">
        <div className="flex items-center justify-center gap-2 text-sm font-black text-cyan-400">
          <span>🐟</span>
          <span>FISH MART — ADMIN PORTAL</span>
        </div>
        <div className="text-[11px] text-slate-500">
          © 2026 Fish Mart Inc. All rights reserved. Restricted to authorized administrators only.
        </div>
      </div>
    </footer>
  )
}