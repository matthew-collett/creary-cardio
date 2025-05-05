import { useState, useEffect, useMemo } from 'react'

import { handleError } from '@/lib'
import { userService } from '@/lib/services'
import { User } from '@/types'

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true)
      setError(null)
      try {
        const all = await userService.getAllUsers()
        setUsers(all)
      } catch (err) {
        setError(handleError(err))
      } finally {
        setLoading(false)
      }
    }
    fetchUsers()
  }, [])

  const userLookup = useMemo(() => new Map(users.map(u => [u.uid, u])), [users])

  return { users, userLookup, loading, error }
}
