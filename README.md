# prueba-v1

SPA en React + TypeScript que lista usuarios de [JSONPlaceholder](https://jsonplaceholder.typicode.com),
permite buscarlos por nombre y ver o crear sus publicaciones.

## Qué hace

- Lista los 10 usuarios de la API con buscador por nombre (filtrado en cliente, sin distinguir mayúsculas).
- Muestra las publicaciones del usuario seleccionado, con estados de carga, error y lista vacía.
- Permite crear una publicación con validación de título (máx. 120) y texto (máx. 1000).
- El post nuevo aparece al instante en la lista; si el POST falla, se revierte y se muestra el error.
- Los errores de usuarios y de publicaciones se pueden reintentar de forma independiente.

## Stack

| Pieza | Versión |
|---|---|
| React + TypeScript | 19.3 · 6.0 |
| Vite | 8.3 |
| TanStack Query | 5.107 |
| Vitest + Testing Library | 5.1 · 16.3 |
| MSW | 3.0 |

## Requisitos

- Node 20.19+ (o 22.12+)
- npm 11+

## Instalación y ejecución

```bash
npm install
npm run dev        # servidor de desarrollo en http://localhost:5173
```

Otros scripts:

```bash
npm run build          # tsc -b + build de producción en dist/
npm run preview        # sirve el build
npm run test           # tests en modo watch
npm run test:run       # una pasada
npm run test:coverage  # cobertura con v8 (texto + html en coverage/)
npm run lint           # ESLint
```

## Estructura

```
src/
  api/jsonplaceholder.ts    Cliente tipado de la API
  hooks/                    useUsers, usePosts, useCreatePost
  components/               UserSearch, UserList, PostList, PostForm, QueryState
  lib/validatePost.ts       Validación pura del formulario
  test/                     Setup de MSW, fixtures, utilidades y tests
```

## Decisiones técnicas

- **`POST /posts` siempre devuelve `id: 101`** y no persiste nada, así que el post optimista usa
  `crypto.randomUUID()` y se marca con `local: true` para no chocar como key.
- **Sin `invalidateQueries` tras crear**: un refetch borraría el post recién añadido. Se usa
  `setQueryData` sobre `['posts', userId]` con `staleTime: Infinity`.
- **Rollback**: se guarda el snapshot de la lista en `onMutate` y se restaura en `onError`.
- **Filtro en `App`**: `UserList` y `PostList` no conocen la búsqueda ni la caché; solo reciben datos.
- **`retry: false` en tests** para que los casos de error no esperen reintentos.

## Evolución del proyecto

| Fase | Qué se hizo |
|---|---|
| 1 | Proyecto Vite + React + TS y stack de tests (Vitest, Testing Library, MSW) |
| 2 | Lista de usuarios con carga, error y selección |
| 3 | Búsqueda por nombre con contador de resultados |
| 4 | Publicaciones del usuario seleccionado, con caché por `userId` |
| 5 | Layout de dos columnas: usuarios a la izquierda, publicaciones a la derecha |
| 6 | Formulario con validación y mutación optimista con rollback |
| 7 | Tests de error/reintento, cobertura y documentación |

## Tests

18 tests en 6 archivos, con cobertura del 100 % de sentencias y 98 % de ramas:

- Listado de usuarios y selección.
- Filtrado por nombre (mayúsculas, borrado, sin coincidencias).
- Publicaciones por usuario, cambio de usuario y estado vacío.
- Validación pura de títulos y textos.
- Formulario: errores, alta correcta y rollback ante fallo del POST.
- Error y reintento en usuarios y en publicaciones.
