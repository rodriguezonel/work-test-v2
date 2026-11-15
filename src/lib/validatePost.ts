export type PostErrors = Partial<Record<'title' | 'body', string>>

export const TITLE_MAX_LENGTH = 120
export const BODY_MAX_LENGTH = 1000

export function validatePost(input: { title: string; body: string }): PostErrors {
  const errors: PostErrors = {}
  const title = input.title.trim()
  const body = input.body.trim()

  if (!title) errors.title = 'El título es obligatorio'
  else if (title.length > TITLE_MAX_LENGTH) {
    errors.title = `Máximo ${TITLE_MAX_LENGTH} caracteres`
  }

  if (!body) errors.body = 'El texto es obligatorio'
  else if (body.length > BODY_MAX_LENGTH) {
    errors.body = `Máximo ${BODY_MAX_LENGTH} caracteres`
  }

  return errors
}
