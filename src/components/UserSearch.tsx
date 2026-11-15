type UserSearchProps = {
  value: string
  onChange: (value: string) => void
}

export function UserSearch({ value, onChange }: UserSearchProps) {
  return (
    <div className="user-search">
      <label className="user-search__label" htmlFor="user-search">
        Buscar usuario
      </label>
      <input
        id="user-search"
        className="user-search__input"
        type="search"
        placeholder="Nombre…"
        autoComplete="off"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  )
}
