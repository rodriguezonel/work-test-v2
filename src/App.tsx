import { useState } from 'react'
import { QueryState } from './components/QueryState'
import { UserList } from './components/UserList'
import { useUsers } from './hooks/useUsers'

function App() {
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null)
  const users = useUsers()

  return (
    <main className="app">
      <header className="app__header">
        <h1>Usuarios</h1>
        <p>Selecciona un usuario para ver sus publicaciones.</p>
      </header>

      <QueryState
        isPending={users.isPending}
        isError={users.isError}
        loadingLabel="Cargando usuarios…"
        errorLabel="No se pudieron cargar los usuarios."
        onRetry={() => void users.refetch()}
      >
        <UserList
          users={users.data ?? []}
          selectedUserId={selectedUserId}
          onSelect={setSelectedUserId}
        />
      </QueryState>
    </main>
  )
}

export default App
