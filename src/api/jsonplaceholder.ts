export type User = {
  id: number
  name: string
  email: string
  company: { name: string }
}

const BASE = 'https://jsonplaceholder.typicode.com'

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, init)
  if (!res.ok) throw new Error(`HTTP ${res.status} en ${path}`)
  return res.json() as Promise<T>
}

export const fetchUsers = () => request<User[]>('/users')
