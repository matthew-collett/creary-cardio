import { Timestamp } from 'firebase/firestore'

export type Booking = {
  id?: string
  userId: string
  title: string
  start: Timestamp
  end: Timestamp
  description?: string
  createdAt: Timestamp
  updatedAt: Timestamp
}
