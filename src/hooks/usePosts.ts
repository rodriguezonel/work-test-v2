import { useQuery } from '@tanstack/react-query'
import { fetchPosts } from '../api/jsonplaceholder'

export function usePosts(userId: number) {
  return useQuery({
    queryKey: ['posts', userId],
    queryFn: () => fetchPosts(userId),
    // La API no persiste los posts creados, así que evitamos refetch al enfocar.
    staleTime: Infinity,
  })
}
