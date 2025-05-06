import { onAuthStateChanged } from 'firebase/auth'
import { createContext, useState, useEffect, useContext, ReactNode } from 'react'

import { auth } from '@/lib'
import { authService, userService } from '@/lib/services'
import { handleError } from '@/lib/utils'
import { UpdatedResource, User } from '@/types'

type AuthResponse = {
  success: boolean
  error?: string
}

interface AuthContextType {
  user: User | null
  authLoading: boolean
  actionLoading: boolean
  login: (email: string, password: string) => Promise<AuthResponse>
  logout: () => Promise<AuthResponse>
  updateUser: (data: Partial<User>) => Promise<AuthResponse & { data?: User }>
  resetPassword: (email: string) => Promise<AuthResponse>
}

const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [authLoading, setAuthLoading] = useState<boolean>(true)
  const [actionLoading, setActionLoading] = useState<boolean>(false)

  const login = async (email: string, password: string) => authService.login(email, password)

  const logout = async () => authService.logout()

  const resetPassword = async (email: string) => authService.resetPassword(email)

  const updateUser = async (data: UpdatedResource<User>) => {
    setActionLoading(true)

    if (!user) {
      setActionLoading(false)
      return { success: false, error: 'No user logged in' }
    }

    try {
      const response = await userService.update(user.uid, data)
      if (response.success) {
        setUser({ ...user, ...data })
      }
      setActionLoading(false)
      return response
    } catch (error) {
      setActionLoading(false)
      return {
        success: false,
        error: handleError(error),
      }
    }
  }

  useEffect(() => {
    return onAuthStateChanged(auth, async fbUser => {
      setAuthLoading(true)
      if (!fbUser) {
        setUser(null)
        setAuthLoading(false)
        return
      }

      try {
        const response = await userService.get(fbUser.uid)
        if (response.success) {
          setUser(response.data)
        }
      } finally {
        setAuthLoading(false)
      }
    })
  }, [])

  const value = {
    user,
    authLoading,
    actionLoading,
    login,
    updateUser,
    logout,
    resetPassword,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
