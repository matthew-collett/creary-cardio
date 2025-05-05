import { Timestamp } from 'firebase/firestore'

export type Booking = {
  id?: string
  userId: string
  title: string
  start: Timestamp
  end: Timestamp
  description: string | null
  rrule: string | null
  createdAt: Timestamp
  updatedAt: Timestamp
}
