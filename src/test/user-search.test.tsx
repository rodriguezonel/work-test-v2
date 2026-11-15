import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import App from '../App'
import { renderWithProviders } from './utils'

async function renderApp() {
  const user = userEvent.setup()
  renderWithProviders(<App />)
  await screen.findAllByRole('listitem')

  return user
}

describe('búsqueda de usuarios', () => {
  it('filtra por nombre sin distinguir mayúsculas', async () => {
    const user = await renderApp()

    await user.type(screen.getByLabelText(/buscar usuario/i), 'LEANNE')

    expect(screen.getAllByRole('listitem')).toHaveLength(1)
    expect(screen.getByText('Leanne Graham')).toBeInTheDocument()
    expect(screen.getByText('1 de 10 usuarios')).toBeInTheDocument()
  })

  it('restaura la lista completa al borrar el texto', async () => {
    const user = await renderApp()
    const input = screen.getByLabelText(/buscar usuario/i)

    await user.type(input, 'leanne')
    expect(screen.getAllByRole('listitem')).toHaveLength(1)

    await user.clear(input)

    expect(screen.getAllByRole('listitem')).toHaveLength(10)
    expect(screen.getByText('10 de 10 usuarios')).toBeInTheDocument()
  })

  it('avisa cuando ningún usuario coincide', async () => {
    const user = await renderApp()

    await user.type(screen.getByLabelText(/buscar usuario/i), 'zzz')

    expect(screen.queryAllByRole('listitem')).toHaveLength(0)
    expect(screen.getByText(/ningún usuario coincide con «zzz»/i)).toBeInTheDocument()
  })
})
