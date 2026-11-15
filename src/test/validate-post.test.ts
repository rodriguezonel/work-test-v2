import { describe, expect, it } from 'vitest'
import { BODY_MAX_LENGTH, TITLE_MAX_LENGTH, validatePost } from '../lib/validatePost'

describe('validatePost', () => {
  it('exige título y texto', () => {
    expect(validatePost({ title: '', body: '' })).toEqual({
      title: 'El título es obligatorio',
      body: 'El texto es obligatorio',
    })
  })

  it('ignora espacios en blanco', () => {
    expect(validatePost({ title: '   ', body: '  ' })).toEqual({
      title: 'El título es obligatorio',
      body: 'El texto es obligatorio',
    })
  })

  it('acepta los límites exactos', () => {
    expect(
      validatePost({
        title: 'a'.repeat(TITLE_MAX_LENGTH),
        body: 'b'.repeat(BODY_MAX_LENGTH),
      }),
    ).toEqual({})
  })

  it('rechaza longitudes superiores a los límites', () => {
    expect(
      validatePost({
        title: 'a'.repeat(TITLE_MAX_LENGTH + 1),
        body: 'b'.repeat(BODY_MAX_LENGTH + 1),
      }),
    ).toEqual({
      title: `Máximo ${TITLE_MAX_LENGTH} caracteres`,
      body: `Máximo ${BODY_MAX_LENGTH} caracteres`,
    })
  })
})
