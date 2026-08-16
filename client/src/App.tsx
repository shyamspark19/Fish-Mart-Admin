import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Login from './pages/Login'
import AdminDashboard from './pages/AdminDashboard'
import { AuthProvider } from './context/AuthContext'

export default function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-[#070F1E] text-slate-100 font-sans flex flex-col justify-between">
        <div>
          <Navbar />
          <main className="p-4 sm:p-6 max-w-7xl mx-auto">
            <Routes>
              <Route path="/" element={<Navigate to="/admin" replace />} />
              <Route path="/login" element={<Login />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="*" element={<Navigate to="/admin" replace />} />
            </Routes>
          </main>
        </div>

        {/* Fish Mart Footer */}
        <footer className="bg-slate-900 border-t border-cyan-500/20 py-8 px-4 text-center text-xs text-slate-400">
          <div className="max-w-6xl mx-auto space-y-3">
            <div className="flex items-center justify-center gap-2 text-base font-black text-cyan-400">
              <span>🐟</span>
              <span>FISH MART — ADMIN PORTAL</span>
            </div>
            <p className="text-slate-400">
              Internal Admin Dashboard · Products, Orders & Analytics Management
            </p>
            <div className="text-[11px] text-slate-500">
              © 2026 Fish Mart Inc. All rights reserved. Restricted to authorized administrators only.
            </div>
          </div>
        </footer>
      </div>
    </AuthProvider>
  )
}