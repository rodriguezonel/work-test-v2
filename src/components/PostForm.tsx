import { useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { useCreatePost } from '../hooks/useCreatePost'
import { validatePost, type PostErrors } from '../lib/validatePost'

type PostFormProps = {
  userId: number
}

export function PostForm({ userId }: PostFormProps) {
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [errors, setErrors] = useState<PostErrors>({})
  const titleInput = useRef<HTMLInputElement>(null)
  const createPost = useCreatePost(userId)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const nextErrors = validatePost({ title, body })
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    createPost.mutate(
      { title: title.trim(), body: body.trim() },
      {
        onSuccess: () => {
          setTitle('')
          setBody('')
          setErrors({})
          titleInput.current?.focus()
        },
      },
    )
  }

  return (
    <form className="post-form" onSubmit={handleSubmit} noValidate>
      <div className="field">
        <label className="field__label" htmlFor="post-title">
          Título
        </label>
        <input
          id="post-title"
          ref={titleInput}
          className="field__input"
          type="text"
          value={title}
          aria-invalid={errors.title ? true : undefined}
          aria-describedby={errors.title ? 'post-title-error' : undefined}
          onChange={(event) => setTitle(event.target.value)}
        />
        {errors.title && (
          <p className="field__error" id="post-title-error" role="alert">
            {errors.title}
          </p>
        )}
      </div>

      <div className="field">
        <label className="field__label" htmlFor="post-body">
          Texto
        </label>
        <textarea
          id="post-body"
          className="field__input"
          rows={3}
          value={body}
          aria-invalid={errors.body ? true : undefined}
          aria-describedby={errors.body ? 'post-body-error' : undefined}
          onChange={(event) => setBody(event.target.value)}
        />
        {errors.body && (
          <p className="field__error" id="post-body-error" role="alert">
            {errors.body}
          </p>
        )}
      </div>

      {createPost.isError && (
        <p className="field__error" role="alert">
          No se pudo publicar. Inténtalo de nuevo.
        </p>
      )}

      <button
        type="submit"
        className="button"
        disabled={createPost.isPending}
        aria-busy={createPost.isPending}
      >
        {createPost.isPending ? 'Enviando…' : 'Publicar'}
      </button>
    </form>
  )
}
