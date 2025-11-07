import axios from 'axios'

// axios instance - Vite proxy handles /api
const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
})

// Register
export async function register({ username, password, role = 'USER' }) {
  const res = await api.post('/auth/register', { username, password, role })
  return res.data
}

// Login
export async function login({ username, password }) {
  const res = await api.post('/auth/login', { username, password })
  return res.data // { token: "..." }
}

// Logout (calls backend logout and clears local token)
export async function logout() {
  const token = getToken()
  if (token) {
    try {
      await api.post('/auth/logout', null, { headers: { Authorization: `Bearer ${token}` } })
    } catch (e) { /* ignore */ }
  }
  localStorage.removeItem('jwt')
}

export function saveToken(token) {
  localStorage.setItem('jwt', token)
}

export function getToken() {
  return localStorage.getItem('jwt')
}

// Helper for authenticated fetch with axios
export function authFetch(path, options = {}) {
  const token = getToken()
  const headers = { ...(options.headers || {}), Authorization: token ? `Bearer ${token}` : undefined }
  return api.request({ url: path, ...options, headers })
}

// Parse current user from JWT (client-side only, never trust it server-side)
export function getCurrentUser() {
  const token = getToken()
  if (!token) return null
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    return { username: payload.sub, roles: payload.roles || [] }
  } catch (e) {
    return null
  }
}
