import { useMemo, useState } from 'react'
import { QueryState } from './components/QueryState'
import { UserList } from './components/UserList'
import { UserSearch } from './components/UserSearch'
import { useUsers } from './hooks/useUsers'

function App() {
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null)
  const [search, setSearch] = useState('')
  const users = useUsers()

  const term = search.trim().toLowerCase()
  const visibleUsers = useMemo(() => {
    const allUsers = users.data ?? []
    if (!term) return allUsers

    return allUsers.filter((user) => user.name.toLowerCase().includes(term))
  }, [users.data, term])

  return (
    <main className="app">
      <header className="app__header">
        <h1>Usuarios</h1>
        <p>Selecciona un usuario para ver sus publicaciones.</p>
      </header>

      <UserSearch value={search} onChange={setSearch} />

      {users.data && (
        <p className="user-search__count" aria-live="polite">
          {visibleUsers.length} de {users.data.length} usuarios
        </p>
      )}

      <QueryState
        isPending={users.isPending}
        isError={users.isError}
        loadingLabel="Cargando usuarios…"
        errorLabel="No se pudieron cargar los usuarios."
        onRetry={() => void users.refetch()}
      >
        <UserList
          users={visibleUsers}
          selectedUserId={selectedUserId}
          onSelect={setSelectedUserId}
          emptyMessage={
            term
              ? `Ningún usuario coincide con «${search.trim()}».`
              : undefined
          }
        />
      </QueryState>
    </main>
  )
}

export default App
