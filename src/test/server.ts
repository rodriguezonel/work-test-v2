import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { usersFixture } from './fixtures'

const BASE = 'https://jsonplaceholder.typicode.com'

export const server = setupServer(
  http.get(`${BASE}/users`, () => HttpResponse.json(usersFixture)),
)
