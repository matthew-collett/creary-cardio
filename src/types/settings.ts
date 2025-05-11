import { Resource } from '@/types'

export type Settings = Resource & {
  openingTime: string
  closingTime: string
  maxDurationMinutes: number
  advanceBookingDays: number
}

export type IsAllowed = { allowed: true } | { allowed: false; reason: string }

/* TODO
--- need to do update password, also custom password reset form with cool redirect in 3. 2. 1....
- add other users
- deploy
- update index.html
*/
