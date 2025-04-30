import { Timestamp } from 'firebase/firestore'

export type User = {
  uid: string
  email: string
  displayName: string | null
  photoURL: string | null
  colour: string | null
  updatedAt: Timestamp
}
