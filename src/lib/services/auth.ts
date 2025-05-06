import {
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  UserCredential,
} from '@firebase/auth'

import { auth } from '@/lib'
import { handleError } from '@/lib/utils'
import { ServiceResponse } from '@/types'

export class AuthService {
  executeOperation = async (
    operation: () => Promise<void> | Promise<UserCredential>,
  ): Promise<ServiceResponse<null>> => {
    try {
      await operation()
      return { success: true, data: null }
    } catch (error) {
      return { success: false, error: handleError(error) }
    }
  }

  login = async (email: string, password: string) =>
    this.executeOperation(() => signInWithEmailAndPassword(auth, email, password))

  logout = async () => this.executeOperation(() => signOut(auth))

  resetPassword = async (email: string) =>
    this.executeOperation(() => sendPasswordResetEmail(auth, email))
}

export const authService = new AuthService()
