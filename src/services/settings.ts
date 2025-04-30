import { doc, getDoc, updateDoc, Timestamp } from 'firebase/firestore'

import { dateToMinutes, db, timeToMinutes } from '@/lib'
import { Settings } from '@/types'

type isAllowedResponse = {
  allowed: boolean
  reason: string | null
}

const settingsDoc = doc(db, 'settings', 'calendar')

export const settingsService = {
  async getCalendarSettings(): Promise<Settings> {
    const doc = await getDoc(settingsDoc)
    return doc.data() as Settings
  },

  async updateCalendarSettings(settings: Partial<Omit<Settings, 'updatedAt'>>): Promise<Settings> {
    await updateDoc(settingsDoc, {
      ...settings,
      updatedAt: Timestamp.now(),
    })

    return this.getCalendarSettings()
  },

  async isAllowed(start: Date, end: Date): Promise<isAllowedResponse> {
    const settings = await this.getCalendarSettings()
    const timeSlot = Math.round((end.getTime() - start.getTime()) / 60000)

    if (timeSlot > settings.maxDuration) {
      return {
        allowed: false,
        reason: `Booking exceeds maximum duration of ${settings.maxDuration} minutes`,
      }
    }

    if (
      dateToMinutes(start) < timeToMinutes(settings.openingTime) ||
      dateToMinutes(end) > timeToMinutes(settings.closingTime)
    ) {
      return {
        allowed: false,
        reason: `Booking must be between ${settings.openingTime} and ${settings.closingTime}`,
      }
    }

    const maxBookingDate = new Date()
    maxBookingDate.setDate(maxBookingDate.getDate() + settings.advanceBookingDays)

    if (start > maxBookingDate) {
      return {
        allowed: false,
        reason: `Bookings can only be made up to ${settings.advanceBookingDays} days in advance`,
      }
    }

    return { allowed: true, reason: null }
  },
}
