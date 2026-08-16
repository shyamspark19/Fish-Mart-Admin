import React, { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import BrandLogo from '../components/BrandLogo'

export default function Login() {
  const auth = useContext(AuthContext)!
  const navigate = useNavigate()

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
    <div className="max-w-md mx-auto my-12 bg-slate-900 border border-amber-500/20 p-8 rounded-3xl shadow-2xl space-y-6 font-sans">
      {/* Brand Logo & Header */}
      <div className="flex flex-col items-center justify-center text-center space-y-3">
        <BrandLogo size="lg" />
        <div className="flex items-center gap-2 px-4 py-1.5 bg-amber-500/10 border border-amber-500/30 rounded-full">
          <span className="text-amber-400 text-sm">👑</span>
          <span className="text-xs font-black uppercase tracking-widest text-amber-400">Admin Portal Access</span>
        </div>
        <p className="text-xs font-semibold text-slate-400">Sign in to manage Fish Mart operations</p>
      </div>

      {errorMsg && (
        <div className="p-3.5 bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs font-bold rounded-xl text-center">
          {errorMsg}
        </div>
      )}

      <form onSubmit={submit} className="space-y-4">
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-300">Admin Email</label>
          <input
            type="email"
            required
            className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs font-semibold text-white focus:outline-none focus:border-amber-500 transition-colors"
            placeholder="admin@fishmart.test"
            value={email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-300">Password</label>
          <input
            type="password"
            required
            className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs font-semibold text-white focus:outline-none focus:border-amber-500 transition-colors"
            placeholder="••••••••"
            value={password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
          />
        </div>

        <button
          disabled={loading}
          className="w-full py-3.5 font-black text-xs uppercase tracking-wider rounded-xl shadow-lg transition-transform active:scale-95 bg-gradient-to-r from-amber-500 to-orange-600 text-slate-950 hover:from-amber-600 hover:to-orange-700 shadow-amber-500/20"
        >
          {loading ? 'Authenticating...' : '👑 Sign In to Admin Portal'}
        </button>
      </form>

      <div className="text-center text-[11px] text-slate-500 pt-2 border-t border-slate-800/80">
        Restricted access · Authorized administrators only
      </div>
    </div>
  )
}
