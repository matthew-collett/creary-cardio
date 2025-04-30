import { Timestamp } from 'firebase/firestore'

export type Settings = {
  openingTime: string
  closingTime: string
  maxDuration: number
  advanceBookingDays: number
  updatedAt: Timestamp
}
