import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
} from 'firebase/auth'
import { Timestamp } from 'firebase/firestore'
import { createContext, useState, useEffect, useContext, ReactNode } from 'react'

import { auth, handleError } from '@/lib'
import { userService } from '@/services'
import { User } from '@/types'

interface AuthContextType {
  user: User | null
  loading: boolean
  error: string | null
  // eslint-disable-next-line no-unused-vars
  signIn: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  // eslint-disable-next-line no-unused-vars
  updateUser: (data: Partial<User>) => Promise<void>
  // eslint-disable-next-line no-unused-vars
  resetPassword: (email: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const signIn = async (email: string, password: string) => {
    try {
      setError(null)
      await signInWithEmailAndPassword(auth, email, password)
    } catch (error) {
      setError(handleError(error))
    }
  }

  const logout = async () => {
    try {
      setError(null)
      await signOut(auth)
    } catch (error) {
      setError(handleError(error))
    }
  }

  const resetPassword = async (email: string) => {
    try {
      setError(null)
      await sendPasswordResetEmail(auth, email)
    } catch (error) {
      setError(handleError(error))
    }
  }

  const updateUser = async (data: Partial<User>) => {
    if (!user) {
      return
    }

    try {
      setError(null)
      const updatedUser = await userService.updateUser(user.uid, {
        ...data,
        updatedAt: Timestamp.now(),
      })

      setUser(updatedUser)
    } catch (error) {
      setError(handleError(error))
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async user => {
      if (!user) {
        setUser(null)
        setLoading(false)
        return
      }

      const currentUser = await userService.getUser(user.uid)
      setUser(currentUser)
    })

    return () => unsubscribe()
  }, [])

  const value = {
    user,
    loading,
    error,
    signIn,
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
