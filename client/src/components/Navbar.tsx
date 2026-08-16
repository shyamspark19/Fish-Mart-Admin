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
      <header className="bg-[#140F0D]/95 backdrop-blur-md sticky top-0 z-30 border-b border-orange-500/20 shadow-xl text-stone-100 font-sans py-3.5 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/">
            <BrandLogo size="md" />
          </Link>
          <div className="flex items-center gap-3">
            <LanguageSelector />
            <div className="flex items-center gap-1.5 px-3 py-1 bg-orange-500/10 border border-orange-500/30 rounded-full">
              <span className="text-[11px] font-bold uppercase tracking-widest text-orange-400">
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
    <header className="bg-[#140F0D]/95 backdrop-blur-md sticky top-0 z-30 border-b border-orange-500/20 shadow-xl text-stone-100 font-sans">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div className="flex items-center gap-4">
          <Link to="/admin">
            <BrandLogo size="md" />
          </Link>
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-orange-500/10 border border-orange-500/30 rounded-full">
            <span className="text-[11px] font-bold uppercase tracking-widest text-orange-400">
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
            className="px-3.5 py-1.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-stone-950 font-bold rounded-xl text-xs uppercase tracking-wider shadow-md shadow-orange-500/20 transition-transform active:scale-95 flex items-center gap-1.5 cursor-pointer"
          >
            <span>{t('admin.dashboard')}</span>
          </Link>

          {/* User Info & Logout */}
          {isLoggedIn ? (
            <div className="flex items-center gap-2">
              <span className="hidden lg:inline text-xs font-semibold bg-[#1F1814] border border-orange-500/20 px-3 py-1.5 rounded-full text-orange-200">
                {auth?.user?.name || 'Administrator'}
              </span>
              <button
                onClick={handleLogout}
                className="text-xs font-bold text-rose-400 hover:text-rose-300 uppercase tracking-wider transition-colors px-2 py-1 rounded-lg hover:bg-rose-500/10 cursor-pointer"
              >
                {t('logout')}
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-orange-500 to-amber-500 text-stone-950 px-4 py-2 rounded-xl hover:from-orange-400 hover:to-amber-400 transition-transform active:scale-95 shadow-md shadow-orange-500/20 cursor-pointer"
            >
              {t('admin.signIn')}
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}
