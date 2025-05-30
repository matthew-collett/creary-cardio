import { useRouteError, useNavigate } from 'react-router-dom'

import { Button } from '@/components/core'

export const GenericError = () => {
  const error = useRouteError() as Error
  const navigate = useNavigate()

  const handleReset = () => {
    navigate(0)
  }

  return (
    <div className="fixed inset-0 bg-background flex flex-col items-center justify-center gap-4 p-4">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold">Something went wrong</h1>
        <p>{error?.message || 'An unexpected error occurred. Please try again.'}</p>
      </div>
      <Button onClick={handleReset} className="!w-fit">
        Try Again
      </Button>
    </div>
  )
}
