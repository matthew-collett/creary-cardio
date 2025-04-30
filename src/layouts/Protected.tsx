import { Navigate, Outlet } from 'react-router-dom'

import { Loader } from '@/components'
import { useAuth } from '@/context'

const Protected = () => {
  const { user, loading } = useAuth()

  if (loading) {
    return <Loader />
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}

export default Protected
