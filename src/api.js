const BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000'

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

  saveProfile: (profileData, token) =>
    request('POST', '/profiles/', profileData, token),

  submitApplication: (appData, token) =>
    request('POST', '/applications/', appData, token),
}
