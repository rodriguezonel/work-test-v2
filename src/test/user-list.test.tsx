import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import App from '../App'
import { renderWithProviders } from './utils'

describe('lista de usuarios', () => {
  it('muestra los diez usuarios de la api', async () => {
    renderWithProviders(<App />)

    expect(screen.getByRole('status')).toHaveTextContent('Cargando usuarios…')

    expect(await screen.findAllByRole('listitem')).toHaveLength(10)
    expect(screen.getByText('Leanne Graham')).toBeInTheDocument()
    expect(screen.getByText('Sincere@april.biz')).toBeInTheDocument()
  })

  it('marca como seleccionado el usuario pulsado', async () => {
    const user = userEvent.setup()
    renderWithProviders(<App />)

    const leanne = await screen.findByRole('button', { name: /leanne graham/i })
    expect(leanne).toHaveAttribute('aria-pressed', 'false')

    await user.click(leanne)

    expect(leanne).toHaveAttribute('aria-pressed', 'true')
  })
})
