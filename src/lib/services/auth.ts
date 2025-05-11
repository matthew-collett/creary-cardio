import {
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updatePassword,
  User,
} from 'firebase/auth'

import { auth } from '@/lib'
import { handleError } from '@/lib/utils'
import { EmptyServiceResponse, ServiceResponse } from '@/types'

class AuthService {
  private executeOperation = async <R>(
    operation: () => Promise<ServiceResponse<R>>,
  ): Promise<ServiceResponse<R>> => {
    try {
      return await operation()
    } catch (error) {
      return { success: false, error: handleError(error) }
    }
  }

  login = async (email: string, password: string): Promise<ServiceResponse<User>> =>
    this.executeOperation(async () => {
      const { user } = await signInWithEmailAndPassword(auth, email, password)
      return {
        success: true,
        data: user,
      }
    })

  logout = async (): Promise<EmptyServiceResponse> =>
    this.executeOperation(async () => {
      await signOut(auth)
      return {
        success: true,
        data: null,
      }
    })

  resetPassword = async (email: string): Promise<EmptyServiceResponse> =>
    this.executeOperation(async () => {
      await sendPasswordResetEmail(auth, email)
      return {
        success: true,
        data: null,
      }
    })

  changePassword = async (
    email: string,
    currentPassword: string,
    newPassword: string,
  ): Promise<EmptyServiceResponse> =>
    this.executeOperation(async () => {
      const { user } = await signInWithEmailAndPassword(auth, email, currentPassword)
      await updatePassword(user, newPassword)
      return {
        success: true,
        data: null,
      }
    })
}

export const authService = new AuthService()
