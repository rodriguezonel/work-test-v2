import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import { describe, expect, it } from 'vitest'
import App from '../App'
import { server } from './server'
import { renderWithProviders } from './utils'

const BASE = 'https://jsonplaceholder.typicode.com'

describe('errores y reintento', () => {
  it('muestra el error de usuarios y recarga al reintentar', async () => {
    server.use(
      http.get(`${BASE}/users`, () =>
        HttpResponse.json({ message: 'boom' }, { status: 500 }),
      ),
    )

    const user = userEvent.setup()
    renderWithProviders(<App />)

    expect(
      await screen.findByText('No se pudieron cargar los usuarios.'),
    ).toBeInTheDocument()

    server.resetHandlers()
    await user.click(screen.getByRole('button', { name: /reintentar/i }))

    expect(await screen.findAllByRole('listitem')).toHaveLength(10)
    expect(screen.getByText('Leanne Graham')).toBeInTheDocument()
  })

  it('aísla el error de publicaciones de la lista de usuarios', async () => {
    server.use(
      http.get(`${BASE}/posts`, () =>
        HttpResponse.json({ message: 'boom' }, { status: 500 }),
      ),
    )

    const user = userEvent.setup()
    renderWithProviders(<App />)
    await user.click(
      await screen.findByRole('button', { name: /leanne graham/i }),
    )

    const postsPanel = screen.getByRole('region', { name: /publicaciones/i })
    expect(
      await within(postsPanel).findByText(
        'No se pudieron cargar las publicaciones.',
      ),
    ).toBeInTheDocument()

    const usersPanel = screen.getByRole('region', { name: /usuarios/i })
    expect(within(usersPanel).getAllByRole('listitem')).toHaveLength(10)

    server.resetHandlers()
    await user.click(
      within(postsPanel).getByRole('button', { name: /reintentar/i }),
    )

    expect(
      await within(postsPanel).findByText('Post de Leanne sobre React'),
    ).toBeInTheDocument()
  })
})
