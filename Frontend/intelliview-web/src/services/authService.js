import api from '../lib/api'

export async function login(credentials) {
  const response = await api.post('/api/auth/login', credentials)
  return response.data
}

export async function register(data) {
  const response = await api.post('/api/auth/register', data)
  return response.data
}

export async function changePassword(passwords) {
  const response = await api.post('/api/auth/change-password', passwords)
  return response.data
}