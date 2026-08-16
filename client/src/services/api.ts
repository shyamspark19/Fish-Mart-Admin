import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL

const api = axios.create({
  baseURL: API_URL ? (API_URL.endsWith('/api') ? API_URL : API_URL + '/api') : '/api',
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true
})

export default api
