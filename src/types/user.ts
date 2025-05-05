import { User as FirebaseUser } from '@firebase/auth'
import { Timestamp } from 'firebase/firestore'

export interface User extends FirebaseUser {
  color: string
  updatedAt: Timestamp
  isAdmin: boolean
}
