import { useState, useEffect, useMemo } from 'react'

import { userService } from '@/lib/services'
import { User } from '@/types'

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true)
      const { success, data } = await userService.list()
      if (success) {
        setUsers(data)
      }
      setLoading(false)
    }
    fetchUsers()
  }, [])

  const userMap = useMemo(() => new Map(users.map(u => [u.id, u])), [users])

  return { users, userMap, loading }
}
