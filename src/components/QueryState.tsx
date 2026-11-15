import type { ReactNode } from 'react'

type QueryStateProps = {
  isPending: boolean
  isError: boolean
  loadingLabel: string
  errorLabel: string
  onRetry: () => void
  children: ReactNode
}

export function QueryState({
  isPending,
  isError,
  loadingLabel,
  errorLabel,
  onRetry,
  children,
}: QueryStateProps) {
  if (isPending) {
    return (
      <p className="state" role="status">
        {loadingLabel}
      </p>
    )
  }

  if (isError) {
    return (
      <div className="state state--error" role="alert">
        <p>{errorLabel}</p>
        <button type="button" onClick={onRetry}>
          Reintentar
        </button>
      </div>
    )
  }

  return <>{children}</>
}
