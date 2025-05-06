import { Timestamp } from 'firebase/firestore'

import { Resource } from '@/types'

export type Booking = Resource & {
  userId: string
  title: string
  start: Timestamp
  end: Timestamp
  description: string | null
  rrule: string | null
}
