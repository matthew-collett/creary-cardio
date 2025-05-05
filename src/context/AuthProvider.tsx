import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
} from 'firebase/auth'
import { Timestamp } from 'firebase/firestore'
import { createContext, useState, useEffect, useContext, ReactNode } from 'react'

import { auth, handleError } from '@/lib'
import { userService } from '@/lib/services'
import { User } from '@/types'

interface AuthContextType {
  user: User | null
  authLoading: boolean
  actionLoading: boolean
  error: string | null
  clearError: () => void
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  updateUser: (data: Partial<User>) => Promise<boolean>
  resetPassword: (email: string) => Promise<boolean>
}

const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [authLoading, setAuthLoading] = useState<boolean>(true)
  const [actionLoading, setActionLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const login = async (email: string, password: string) => {
    setActionLoading(true)
    setError(null)
    try {
      await signInWithEmailAndPassword(auth, email, password)
    } catch (error) {
      setError(handleError(error))
    } finally {
      setActionLoading(false)
    }
  }

  const logout = async () => {
    setActionLoading(true)
    setError(null)
    try {
      await signOut(auth)
    } catch (error) {
      setError(handleError(error))
    } finally {
      setActionLoading(false)
    }
  }

  const resetPassword = async (email: string): Promise<boolean> => {
    setActionLoading(true)
    setError(null)
    try {
      await sendPasswordResetEmail(auth, email)
      return true
    } catch (error) {
      setError(handleError(error))
    } finally {
      setActionLoading(false)
    }
    return false
  }

  const updateUser = async (data: Partial<User>): Promise<boolean> => {
    setActionLoading(true)
    setError(null)

    if (!user) {
      return false
    }

    try {
      const updatedUser = await userService.updateUser(user.uid, {
        ...data,
        updatedAt: Timestamp.now(),
      })

      setUser(updatedUser)
      return true
    } catch (error) {
      setError(handleError(error))
    } finally {
      setActionLoading(false)
    }
    return false
  }

  useEffect(() => {
    return onAuthStateChanged(auth, async fbUser => {
      try {
        setAuthLoading(true)
        if (!fbUser) {
          setUser(null)
          setAuthLoading(false)
          return
        }
        const dbUser = await userService.getUser(fbUser.uid)
        setUser(dbUser)
      } finally {
        setAuthLoading(false)
      }
    })
  }, [])

  const value = {
    user,
    authLoading,
    actionLoading,
    error,
    clearError: () => setError(null),
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
