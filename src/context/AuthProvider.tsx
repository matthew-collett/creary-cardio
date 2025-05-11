import { onAuthStateChanged } from 'firebase/auth'
import { createContext, useState, useEffect, useContext, ReactNode } from 'react'

import { auth } from '@/lib'
import { authService, userService } from '@/lib/services'
import { EmptyServiceResponse, ServiceResponse, UpdatedResource, User } from '@/types'

interface AuthContextType {
  user: User | null
  authLoading: boolean
  actionLoading: boolean
  login: (email: string, password: string) => Promise<ServiceResponse<User>>
  logout: () => Promise<EmptyServiceResponse>
  updateUser: (data: Partial<User>) => Promise<ServiceResponse<User>>
  resetPassword: (email: string) => Promise<EmptyServiceResponse>
  changePassword: (currentPassword: string, newPassword: string) => Promise<EmptyServiceResponse>
  uploadProfilePicture: (file: File) => Promise<ServiceResponse<User>>
  deleteProfilePicture: () => Promise<ServiceResponse<User>>
}

const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [authLoading, setAuthLoading] = useState<boolean>(true)
  const [actionLoading, setActionLoading] = useState<boolean>(false)

  const login = async (email: string, password: string): Promise<ServiceResponse<User>> => {
    setActionLoading(true)
    try {
      const loginResponse = await authService.login(email, password)
      if (!loginResponse.success) {
        return loginResponse
      }
      console.log(loginResponse)
      const response = await userService.get(loginResponse.data.uid)
      if (response.success) {
        setUser(response.data)
      }
      return response
    } finally {
      setActionLoading(false)
    }
  }

  const logout = async (): Promise<EmptyServiceResponse> => {
    setActionLoading(true)
    try {
      return await authService.logout()
    } finally {
      setActionLoading(false)
    }
  }

  const updateUser = async (data: UpdatedResource<User>): Promise<ServiceResponse<User>> => {
    setActionLoading(true)
    try {
      if (!user) {
        return { success: false, error: 'No user logged in' }
      }

      const response = await userService.update(user.id, data)
      if (response.success) {
        setUser({ ...user, ...data })
      }
      return response
    } finally {
      setActionLoading(false)
    }
  }

  const resetPassword = async (email: string): Promise<EmptyServiceResponse> => {
    setActionLoading(true)
    try {
      return await authService.resetPassword(email)
    } finally {
      setActionLoading(false)
    }
  }

  const changePassword = async (
    currentPassword: string,
    newPassword: string,
  ): Promise<EmptyServiceResponse> => {
    setActionLoading(true)
    try {
      if (!user || !user.email) {
        return { success: false, error: 'No user logged in' }
      }
      return await authService.changePassword(user.email, currentPassword, newPassword)
    } finally {
      setActionLoading(false)
    }
  }

  const uploadProfilePicture = async (file: File): Promise<ServiceResponse<User>> => {
    setActionLoading(true)
    try {
      if (!user) {
        return { success: false, error: 'No user logged in' }
      }
      const response = await userService.uploadProfilePicture(user.id, file)
      if (response.success) {
        setUser(response.data)
      }
      return response
    } finally {
      setActionLoading(false)
    }
  }

  const deleteProfilePicture = async (): Promise<ServiceResponse<User>> => {
    setActionLoading(true)
    try {
      if (!user) {
        return { success: false, error: 'No user logged in' }
      }
      const response = await userService.deleteProfilePicture(user.id)
      if (response.success) {
        setUser(response.data)
      }
      return response
    } finally {
      setActionLoading(false)
    }
  }

  useEffect(() => {
    return onAuthStateChanged(auth, async fbUser => {
      setAuthLoading(true)
      try {
        if (!fbUser) {
          setUser(null)
          return
        }

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
    changePassword,
    uploadProfilePicture,
    deleteProfilePicture,
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
