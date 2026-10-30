import client from './client'

export interface AuthResponse {
  token: string
  userId: string
  name: string
  email: string
}

export const login = (email: string, password: string) =>
  client.post<AuthResponse>('/v1/auth/login', { email, password }).then(r => r.data)

export const register = (name: string, email: string, password: string) =>
  client.post<AuthResponse>('/v1/auth/register', { name, email, password }).then(r => r.data)
