import React, { useContext } from 'react'
import { Link, useNavigate, useLocation as useRouterLocation } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'
import BrandLogo from './BrandLogo'
import LanguageSelector from './LanguageSelector'

export default function Navbar() {
  const auth = useContext(AuthContext)
  const navigate = useNavigate()
  const routerLocation = useRouterLocation()
  const { t } = useLanguage()

  const isAuthPage = routerLocation.pathname === '/login'
  const isLandingPage = routerLocation.pathname === '/'
  const isLoggedIn = Boolean(auth?.user)

  const handleLogout = () => {
    auth?.logout()
    navigate('/login')
  }

  // Landing page has its own full-page layout — no shared navbar
  if (isLandingPage) return null

  // Minimal clean header for Login page
  if (isAuthPage) {
    return (
      <header className="bg-slate-900/95 backdrop-blur-md sticky top-0 z-30 border-b border-cyan-500/20 shadow-xl text-white font-sans py-3.5 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/">
            <BrandLogo size="md" />
          </Link>
          <div className="flex items-center gap-3">
            <LanguageSelector />
            <div className="flex items-center gap-1.5 px-3 py-1 bg-cyan-500/10 border border-cyan-500/30 rounded-full">
              <span className="text-[11px] font-bold uppercase tracking-widest text-cyan-400">
                {t('brand.adminPortal')}
              </span>
            </div>
          </div>
        </div>
      </header>
    )
  }

  // Full admin header
  return (
    <header className="bg-slate-900/95 backdrop-blur-md sticky top-0 z-30 border-b border-cyan-500/20 shadow-xl text-white font-sans">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div className="flex items-center gap-4">
          <Link to="/admin">
            <BrandLogo size="md" />
          </Link>
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-cyan-500/10 border border-cyan-500/30 rounded-full">
            <span className="text-[11px] font-bold uppercase tracking-widest text-cyan-400">
              {t('brand.adminPortal')}
            </span>
          </div>
        </div>

        {/* Right Navigation */}
        <nav className="flex items-center gap-3 sm:gap-4">
          {/* Language Switcher */}
          <LanguageSelector />

          {/* Admin Hub Link */}
          <Link
            to="/admin"
            className="px-3.5 py-1.5 bg-gradient-to-r from-cyan-500 to-sky-600 hover:from-cyan-600 hover:to-sky-700 text-white font-bold rounded-xl text-xs uppercase tracking-wider shadow-md shadow-cyan-500/20 transition-transform active:scale-95 flex items-center gap-1.5"
          >
            <span>{t('admin.dashboard')}</span>
          </Link>

          {/* User Info & Logout */}
          {isLoggedIn ? (
            <div className="flex items-center gap-2">
              <span className="hidden lg:inline text-xs font-bold bg-slate-800 border border-slate-700 px-3 py-1.5 rounded-full text-cyan-200">
                {auth?.user?.name || 'Administrator'}
              </span>
              <button
                onClick={handleLogout}
                className="text-xs font-bold text-rose-400 hover:text-rose-300 uppercase tracking-wider transition-colors px-2 py-1 rounded-lg hover:bg-rose-500/10"
              >
                {t('logout')}
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-cyan-500 to-sky-600 text-white px-4 py-2 rounded-xl hover:from-cyan-600 hover:to-sky-700 transition-transform active:scale-95 shadow-md shadow-cyan-500/20"
            >
              {t('admin.signIn')}
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}
