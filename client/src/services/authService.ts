import api from './api'

export function setAuthToken(token: string | null) {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`
  } else {
    delete api.defaults.headers.common['Authorization']
  }
}

export async function register(data: { name: string; email: string; password: string; role?: string }) {
  const res = await api.post('/auth/register', data)
  if (res.data?.token) setAuthToken(res.data.token)
  return res.data
}

export async function login(data: { email: string; password: string }) {
  const res = await api.post('/auth/login', data)
  if (res.data?.token) setAuthToken(res.data.token)
  return res.data
}

export async function me(token?: string) {
  if (token) setAuthToken(token)
  const res = await api.get('/auth/me')
  return res.data
}

