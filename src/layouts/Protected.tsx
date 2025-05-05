import { Navigate, Outlet } from 'react-router-dom'

import { LoadingScreen } from '@/components'
import { useAuth } from '@/context'

const Protected = () => {
  const { user, authLoading } = useAuth()

  if (authLoading) {
    return <LoadingScreen />
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}

export default Protected
