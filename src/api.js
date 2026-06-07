// In production (Vercel), API is served from the same origin under /api
// In development, point to the local FastAPI server
const BASE = import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD ? '' : 'http://localhost:8000')

function authHeader(token) {
  return token ? { Authorization: `Bearer ${token}` } : {}
}

async function request(method, path, body, token) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json', ...authHeader(token) },
    body: body ? JSON.stringify(body) : undefined,
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.detail || 'Request failed')
  return data
}

export const api = {
  signup: (email, password, name) =>
    request('POST', '/auth/signup', { email, password, name }),

  login: (email, password) =>
    request('POST', '/auth/login', { email, password }),

  getProfile: (token) =>
    request('GET', '/profiles/me', null, token),

  saveProfile: (profileData, token) =>
    request('POST', '/profiles/', profileData, token),

  getApplications: (token) =>
    request('GET', '/applications/', null, token),

  submitApplication: (appData, token) =>
    request('POST', '/applications/', appData, token),
}
