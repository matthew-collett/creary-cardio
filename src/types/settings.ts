import { Timestamp } from 'firebase/firestore'

export type Settings = {
  openingTime: string
  closingTime: string
  maxDurationMinutes: number
  advanceBookingDays: number
  updatedAt: Timestamp
}

/* TODO
- be able to update and delete bookings
- modularize that fucking page somehow
- make account page
--- need to do update password, also custom password reset form with cool redirect in 3. 2. 1....
- add other users
- deploy

*/
