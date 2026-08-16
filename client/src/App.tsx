import React, { useContext } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import Landing from './pages/Landing'
import Login from './pages/Login'
import AdminDashboard from './pages/AdminDashboard'
import { AuthProvider, AuthContext } from './context/AuthContext'
import { LanguageProvider, useLanguage } from './context/LanguageContext'

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

function AdminFooter() {
  const auth = useContext(AuthContext)
  const { t } = useLanguage()

  // Only show the shared footer on admin/login pages, not on landing (which has its own)
  if (!auth?.user) return null
  return (
    <footer className="bg-[#120E0B] border-t border-orange-500/20 py-6 px-4 text-center text-xs text-stone-400">
      <div className="max-w-6xl mx-auto space-y-2">
        <div className="flex items-center justify-center gap-2 text-sm font-bold text-orange-400">
          <span>{t('brand.title')} — {t('brand.adminPortal')}</span>
        </div>
        <div className="text-[11px] text-stone-500">
          © 2026 Fish Mart Inc. All rights reserved. {t('admin.restricted')}.
        </div>
      </div>
    </footer>
  )
}

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <div className="min-h-screen bg-[#0E0B09] text-stone-100 font-sans flex flex-col">
          <Navbar />
          <main className="flex-1">
            <AppRoutes />
          </main>
          <AdminFooter />
        </div>
      </AuthProvider>
    </LanguageProvider>
  )
}