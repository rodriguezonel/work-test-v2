import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { postsFixture, usersFixture } from './fixtures'

const BASE = 'https://jsonplaceholder.typicode.com'

export const server = setupServer(
  http.get(`${BASE}/users`, () => HttpResponse.json(usersFixture)),

  http.get(`${BASE}/posts`, ({ request }) => {
    const userId = Number(new URL(request.url).searchParams.get('userId'))
    return HttpResponse.json(postsFixture.filter((post) => post.userId === userId))
  }),

  http.post(`${BASE}/posts`, async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>
    return HttpResponse.json({ ...body, id: 101 }, { status: 201 })
  }),
)
