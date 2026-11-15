import { useQuery } from '@tanstack/react-query'
import { fetchUsers } from '../api/jsonplaceholder'

export function useUsers() {
  return useQuery({ queryKey: ['users'], queryFn: fetchUsers })
}
