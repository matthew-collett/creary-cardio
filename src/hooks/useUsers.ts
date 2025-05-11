import { useState, useEffect } from 'react'

import { userService } from '@/lib/services'
import { User } from '@/types'

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true)
      try {
        const { success, data } = await userService.list()
        if (success) {
          setUsers(data)
        }
      } finally {
        setLoading(false)
      }
    }
    fetchUsers()
  }, [])

  return { users, loading }
}
