import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import App from '../App'
import { renderWithProviders } from './utils'

async function selectUser(name: RegExp) {
  const user = userEvent.setup()
  renderWithProviders(<App />)
  await user.click(await screen.findByRole('button', { name }))

  return user
}

describe('publicaciones por usuario', () => {
  it('muestra las regiones de usuarios y publicaciones', async () => {
    renderWithProviders(<App />)
    await screen.findAllByRole('listitem')

    expect(screen.getByRole('region', { name: /usuarios/i })).toBeInTheDocument()
    expect(
      screen.getByRole('region', { name: /publicaciones/i }),
    ).toBeInTheDocument()
  })

  it('muestra las publicaciones del usuario seleccionado', async () => {
    await selectUser(/leanne graham/i)

    expect(screen.getByRole('heading', { name: /publicaciones/i })).toBeInTheDocument()
    expect(await screen.findByText('Post de Leanne sobre React')).toBeInTheDocument()
    expect(screen.getByText('Segundo post de Leanne')).toBeInTheDocument()
  })

  it('cambia de publicaciones al elegir otro usuario', async () => {
    const user = await selectUser(/leanne graham/i)
    expect(await screen.findByText('Post de Leanne sobre React')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /ervin howell/i }))

    expect(await screen.findByText('Post de Ervin sobre testing')).toBeInTheDocument()
    expect(screen.queryByText('Post de Leanne sobre React')).not.toBeInTheDocument()
  })

  it('avisa cuando el usuario no tiene publicaciones', async () => {
    await selectUser(/clementine bauch/i)

    expect(
      await screen.findByText('Este usuario no tiene publicaciones.'),
    ).toBeInTheDocument()
  })
})
