import React, { useContext } from 'react'
import { Link, useNavigate, useLocation as useRouterLocation } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import BrandLogo from './BrandLogo'

export default function Navbar() {
  const auth = useContext(AuthContext)
  const navigate = useNavigate()
  const routerLocation = useRouterLocation()

  const isAuthPage = routerLocation.pathname === '/login'
  const isLoggedIn = Boolean(auth?.user)

  const handleLogout = () => {
    auth?.logout()
    navigate('/login')
  }

  // Minimal clean header for Login page
  if (isAuthPage) {
    return (
      <header className="bg-slate-900/95 backdrop-blur-md sticky top-0 z-30 border-b border-amber-500/20 shadow-xl text-white font-sans py-4 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <BrandLogo size="lg" />
          <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-500/10 border border-amber-500/30 rounded-full">
            <span className="text-amber-400 text-xs">👑</span>
            <span className="text-[11px] font-black uppercase tracking-widest text-amber-400">Admin Portal</span>
          </div>
        </div>
      </header>
    )
  }

  // Full admin header
  return (
    <header className="bg-slate-900/95 backdrop-blur-md sticky top-0 z-30 border-b border-amber-500/20 shadow-xl text-white font-sans">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div className="flex items-center gap-4">
          <Link to="/admin">
            <BrandLogo size="md" />
          </Link>
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/30 rounded-full">
            <span className="text-amber-400 text-xs">👑</span>
            <span className="text-[11px] font-black uppercase tracking-widest text-amber-400">Admin Portal</span>
          </div>
        </div>

        {/* Right Navigation */}
        <nav className="flex items-center gap-3 sm:gap-4">
          {/* Admin Hub Link */}
          <Link
            to="/admin"
            className="px-3.5 py-1.5 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-stone-950 font-black rounded-xl text-xs uppercase tracking-wider shadow-md shadow-orange-500/20 transition-transform active:scale-95 flex items-center gap-1.5"
          >
            <span>👑 Admin Hub</span>
          </Link>

          {/* User Info & Logout */}
          {isLoggedIn ? (
            <div className="flex items-center gap-2">
              <span className="hidden lg:inline text-xs font-bold bg-slate-800 border border-slate-700 px-3 py-1.5 rounded-full text-amber-200">
                👑 {auth?.user?.name}
              </span>
              <button
                onClick={handleLogout}
                className="text-xs font-bold text-rose-400 hover:text-rose-300 uppercase tracking-wider transition-colors px-2"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="text-xs font-extrabold uppercase tracking-wider bg-gradient-to-r from-amber-500 to-orange-600 text-slate-950 px-4 py-2 rounded-xl hover:from-amber-600 hover:to-orange-700 transition-transform active:scale-95 shadow-md shadow-amber-500/20"
            >
              Admin Sign In
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}
