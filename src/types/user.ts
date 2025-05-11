import { User as FirebaseUser } from 'firebase/auth'
import { Timestamp } from 'firebase/firestore'

import { Resource } from '@/types'

export type User = Resource &
  FirebaseUser & {
    color: string
    updatedAt: Timestamp
    isAdmin: boolean
  }
