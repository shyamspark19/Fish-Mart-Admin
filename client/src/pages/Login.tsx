import React, { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'
import BrandLogo from '../components/BrandLogo'
import LanguageSelector from '../components/LanguageSelector'

export default function Login() {
  const auth = useContext(AuthContext)!
  const navigate = useNavigate()
  const { t } = useLanguage()

  const [email, setEmail] = useState('admin@fishmart.test')
  const [password, setPassword] = useState('Admin123!')
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg('')
    try {
      await auth.login(email, password)
      navigate('/admin')
    } catch (err: any) {
      setErrorMsg(err.message || err.response?.data?.message || 'Authentication failed. Please check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto my-10 bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl space-y-6 font-sans">
      {/* Brand Logo & Header */}
      <div className="flex flex-col items-center justify-center text-center space-y-3">
        <BrandLogo size="lg" />
        <div className="flex items-center gap-2 pt-1">
          <LanguageSelector variant="compact" />
        </div>
        <div className="px-3.5 py-1 bg-cyan-500/10 border border-cyan-500/30 rounded-full">
          <span className="text-[11px] font-bold uppercase tracking-widest text-cyan-400">
            {t('brand.adminPortal')}
          </span>
        </div>
        <p className="text-xs font-medium text-slate-400">
          {t('login.desc')}
        </p>
      </div>

      {errorMsg && (
        <div className="p-3.5 bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs font-semibold rounded-xl text-center">
          {errorMsg}
        </div>
      )}

      <form onSubmit={submit} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300">
            {t('login.emailLabel')}
          </label>
          <input
            type="email"
            required
            className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs font-medium text-white focus:outline-none focus:border-cyan-500 transition-colors"
            placeholder="admin@fishmart.test"
            value={email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300">
            {t('login.passLabel')}
          </label>
          <input
            type="password"
            required
            className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs font-medium text-white focus:outline-none focus:border-cyan-500 transition-colors"
            placeholder="••••••••"
            value={password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
          />
        </div>

        <button
          disabled={loading}
          className="w-full py-3.5 font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg transition-transform active:scale-95 bg-gradient-to-r from-cyan-500 to-sky-600 text-white hover:from-cyan-400 hover:to-sky-500 shadow-cyan-500/20 cursor-pointer disabled:opacity-50"
        >
          {loading ? t('login.authenticating') : t('login.submitBtn')}
        </button>
      </form>

      <div className="text-center text-[11px] text-slate-500 pt-2 border-t border-slate-800/80">
        {t('admin.restricted')}
      </div>
    </div>
  )
}
