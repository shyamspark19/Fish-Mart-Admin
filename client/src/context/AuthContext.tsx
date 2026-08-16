import React, { createContext, useEffect, useState } from 'react'
import * as authService from '../services/authService'
import { supabase, supabaseSignIn, isSupabaseConfigured } from '../services/supabaseClient'

interface AuthContextValue {
  user: any | null
  token: string | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  authSource: 'supabase' | 'backend' | 'demo' | null
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(() => {
    try {
      const raw = localStorage.getItem('fm_user')
      return raw ? JSON.parse(raw) : null
    } catch (e) {
      return null
    }
  })
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('fm_token'))
  const [authSource, setAuthSource] = useState<'supabase' | 'backend' | 'demo' | null>(() => {
    return (localStorage.getItem('fm_auth_source') as any) || null
  })

  useEffect(() => {
    async function load() {
      const storedUserRaw = localStorage.getItem('fm_user')
      const storedAuthSource = localStorage.getItem('fm_auth_source') || authSource

      if (token && storedUserRaw && !user) {
        try {
          setUser(JSON.parse(storedUserRaw))
        } catch (e) {}
      }

      if (token) {
        if ((storedAuthSource === 'supabase' || !storedAuthSource) && isSupabaseConfigured()) {
          try {
            const { data } = await supabase.auth.getUser()
            if (data.user) {
              const u = {
                id: data.user.id,
                email: data.user.email,
                name: data.user.user_metadata?.name || data.user.email?.split('@')[0],
                role: 'ADMIN'
              }
              setUser(u)
              localStorage.setItem('fm_user', JSON.stringify(u))
              return
            }
          } catch (e) {
            console.warn('Supabase session load warning:', e)
          }
        }

        try {
          const resp = await authService.me(token)
          if (resp?.user) {
            setUser(resp.user)
            localStorage.setItem('fm_user', JSON.stringify(resp.user))
            return
          }
        } catch (err) {
          // Keep active local user state if Express backend is unreachable
        }
      }
    }
    load()
  }, [token])

  const login = async (email: string, password: string) => {
    let lastError: any = null

    // Attempt 1: Supabase Auth if configured
    if (isSupabaseConfigured()) {
      try {
        const data = await supabaseSignIn(email, password)
        if (data?.user && data?.session) {
          const u = {
            id: data.user.id,
            email: data.user.email,
            name: data.user.user_metadata?.name || email.split('@')[0],
            role: 'ADMIN'
          }
          const tkn = data.session.access_token
          setToken(tkn)
          setUser(u)
          setAuthSource('supabase')
          localStorage.setItem('fm_token', tkn)
          localStorage.setItem('fm_user', JSON.stringify(u))
          localStorage.setItem('fm_auth_source', 'supabase')
          return
        }
      } catch (supaErr: any) {
        console.warn('Supabase login attempt error:', supaErr?.message || supaErr)
        lastError = supaErr
      }
    }

    // Demo Fallback for Admin account
    if (email === 'admin@fishmart.test' && password === 'Admin123!') {
      const demoUser = {
        id: 'demo_admin_1',
        name: 'Fish Mart Admin',
        email,
        role: 'ADMIN'
      }
      const demoToken = `demo_token_${Date.now()}`
      setToken(demoToken)
      setUser(demoUser)
      setAuthSource('demo')
      localStorage.setItem('fm_token', demoToken)
      localStorage.setItem('fm_user', JSON.stringify(demoUser))
      localStorage.setItem('fm_auth_source', 'demo')
      return
    }

    // Attempt 2: Express Backend API
    try {
      const resp = await authService.login({ email, password })
      if (resp.token) {
        setToken(resp.token)
        setUser({ ...resp.user, role: 'ADMIN' })
        setAuthSource('backend')
        localStorage.setItem('fm_token', resp.token)
        localStorage.setItem('fm_user', JSON.stringify({ ...resp.user, role: 'ADMIN' }))
        localStorage.setItem('fm_auth_source', 'backend')
        return
      }
    } catch (backendErr: any) {
      console.warn('Backend API login attempt error:', backendErr?.response?.data?.message || backendErr?.message)
      if (!lastError) lastError = backendErr
    }

    const msg = lastError?.message || lastError?.response?.data?.message || 'Authentication failed. Please check your credentials.'
    throw new Error(msg)
  }

  const logout = () => {
    if (authSource === 'supabase' && isSupabaseConfigured()) {
      supabase.auth.signOut().catch(() => {})
    }
    setUser(null)
    setToken(null)
    setAuthSource(null)
    authService.setAuthToken(null)
    localStorage.removeItem('fm_token')
    localStorage.removeItem('fm_user')
    localStorage.removeItem('fm_auth_source')
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout, authSource }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider
