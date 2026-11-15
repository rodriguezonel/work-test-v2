import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createPost, type NewPost, type Post } from '../api/jsonplaceholder'

export function useCreatePost(userId: number) {
  const queryClient = useQueryClient()
  const queryKey = ['posts', userId]

  return useMutation({
    mutationFn: (input: Pick<NewPost, 'title' | 'body'>) =>
      createPost({ ...input, userId }),

    onMutate: async (input) => {
      await queryClient.cancelQueries({ queryKey })
      const previous = queryClient.getQueryData<Post[]>(queryKey)

      const optimistic: Post = {
        ...input,
        userId,
        // El servidor devuelve siempre id 101, así que generamos uno local.
        id: crypto.randomUUID(),
        local: true,
      }

      queryClient.setQueryData<Post[]>(queryKey, (old = []) => [
        optimistic,
        ...old,
      ])

      return { previous }
    },

    onError: (_error, _input, context) => {
      // Sin previous, la lista aún no había cargado: dejarla vacía.
      queryClient.setQueryData<Post[]>(queryKey, context?.previous ?? [])
    },

    // Sin invalidate: la API no persiste y el refetch borraría el post local.
  })
}
