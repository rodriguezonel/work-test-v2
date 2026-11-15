export type User = {
  id: number
  name: string
  email: string
  company: { name: string }
}

export type Post = {
  id: number | string
  userId: number
  title: string
  body: string
  local?: boolean
}

export type NewPost = Pick<Post, 'userId' | 'title' | 'body'>

const BASE = 'https://jsonplaceholder.typicode.com'

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, init)
  if (!res.ok) throw new Error(`HTTP ${res.status} en ${path}`)
  return res.json() as Promise<T>
}

export const fetchUsers = () => request<User[]>('/users')

export const fetchPosts = (userId: number) =>
  request<Post[]>(`/posts?userId=${userId}`)

export const createPost = (post: NewPost) =>
  request<Post>('/posts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(post),
  })
