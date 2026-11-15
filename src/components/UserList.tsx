import type { User } from '../api/jsonplaceholder'

type UserListProps = {
  users: User[]
  selectedUserId: number | null
  onSelect: (userId: number) => void
  emptyMessage?: string
}

export function UserList({
  users,
  selectedUserId,
  onSelect,
  emptyMessage = 'No hay usuarios disponibles.',
}: UserListProps) {
  if (users.length === 0) {
    return <p className="state">{emptyMessage}</p>
  }

  return (
    <ul className="user-list">
      {users.map((user) => {
        const isSelected = user.id === selectedUserId

        return (
          <li key={user.id}>
            <button
              type="button"
              className={`user${isSelected ? ' user--selected' : ''}`}
              aria-pressed={isSelected}
              onClick={() => onSelect(user.id)}
            >
              <span className="user__name">{user.name}</span>
              <span className="user__email">{user.email}</span>
            </button>
          </li>
        )
      })}
    </ul>
  )
}
