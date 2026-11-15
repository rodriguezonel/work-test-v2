import { QueryState } from './QueryState'
import { usePosts } from '../hooks/usePosts'

type PostListProps = {
  userId: number
}

export function PostList({ userId }: PostListProps) {
  const posts = usePosts(userId)
  const data = posts.data ?? []

  return (
    <section className="posts">
      <h2>Publicaciones</h2>

      <QueryState
        isPending={posts.isPending}
        isError={posts.isError}
        loadingLabel="Cargando publicaciones…"
        errorLabel="No se pudieron cargar las publicaciones."
        onRetry={() => void posts.refetch()}
      >
        {data.length === 0 ? (
          <p className="state">Este usuario no tiene publicaciones.</p>
        ) : (
          <ul className="post-list">
            {data.map((post) => (
              <li key={post.id} className="post">
                <h3 className="post__title">{post.title}</h3>
                <p className="post__body">{post.body}</p>
              </li>
            ))}
          </ul>
        )}
      </QueryState>
    </section>
  )
}
