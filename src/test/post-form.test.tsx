import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import { beforeEach, describe, expect, it } from 'vitest'
import App from '../App'
import { server } from './server'
import { renderWithProviders } from './utils'

const BASE = 'https://jsonplaceholder.typicode.com'

const sentPosts: unknown[] = []

beforeEach(() => {
  sentPosts.length = 0
  server.use(
    http.post(`${BASE}/posts`, async ({ request }) => {
      sentPosts.push(await request.json())
      return HttpResponse.json({ id: 101 }, { status: 201 })
    }),
  )
})

async function openLeanne() {
  const user = userEvent.setup()
  renderWithProviders(<App />)
  await user.click(await screen.findByRole('button', { name: /leanne graham/i }))
  await screen.findByText('Post de Leanne sobre React')

  return user
}

describe('formulario de publicación', () => {
  it('muestra los dos errores y no envía nada si está vacío', async () => {
    const user = await openLeanne()

    await user.click(screen.getByRole('button', { name: /publicar/i }))

    expect(screen.getByText('El título es obligatorio')).toBeInTheDocument()
    expect(screen.getByText('El texto es obligatorio')).toBeInTheDocument()
    expect(sentPosts).toHaveLength(0)
  })

  it('crea la publicación y la coloca la primera', async () => {
    const user = await openLeanne()

    await user.type(screen.getByLabelText(/título/i), 'Mi primer post')
    await user.type(screen.getByLabelText(/texto/i), 'Contenido de prueba')
    await user.click(screen.getByRole('button', { name: /publicar/i }))

    const posts = await screen.findByRole('region', { name: /publicaciones/i })
    const items = within(posts).getAllByRole('listitem')

    expect(items[0]).toHaveTextContent('Mi primer post')
    expect(sentPosts).toEqual([
      { userId: 1, title: 'Mi primer post', body: 'Contenido de prueba' },
    ])
    expect(screen.getByLabelText(/título/i)).toHaveValue('')
  })

  it('revierte la publicación optimista si el POST falla', async () => {
    server.use(
      http.post(`${BASE}/posts`, () =>
        HttpResponse.json({ message: 'boom' }, { status: 500 }),
      ),
    )

    const user = await openLeanne()

    await user.type(screen.getByLabelText(/título/i), 'Post que falla')
    await user.type(screen.getByLabelText(/texto/i), 'Contenido')
    await user.click(screen.getByRole('button', { name: /publicar/i }))

    expect(
      await screen.findByText('No se pudo publicar. Inténtalo de nuevo.'),
    ).toBeInTheDocument()
    expect(screen.queryByText('Post que falla')).not.toBeInTheDocument()
    expect(screen.getByText('Post de Leanne sobre React')).toBeInTheDocument()
  })
})
