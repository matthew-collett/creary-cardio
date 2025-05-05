import { doc, getDoc, updateDoc, Timestamp } from 'firebase/firestore'

import { dateToMinutes, db, timeToMinutes, formatTime12 } from '@/lib'
import { Settings } from '@/types'

type isAllowedResponse = {
  allowed: boolean
  reason?: string
}

class SettingsService {
  private snap = doc(db, 'settings', 'calendar')

  async getSettings(): Promise<Settings> {
    const snap = await getDoc(this.snap)
    return snap.data() as Settings
  }

  async updateSettings(settings: Partial<Omit<Settings, 'updatedAt'>>): Promise<Settings> {
    await updateDoc(this.snap, {
      ...settings,
      updatedAt: Timestamp.now(),
    })

    return this.getSettings()
  }

  async isBookingAllowed(start: Date, end: Date): Promise<isAllowedResponse> {
    const settings = await this.getSettings()
    const timeSlot = Math.round((end.getTime() - start.getTime()) / 60000)

    if (timeSlot > settings.maxDurationMinutes) {
      return {
        allowed: false,
        reason: `Booking exceeds maximum duration of ${settings.maxDurationMinutes} minutes`,
      }
    }

    if (
      dateToMinutes(start) < timeToMinutes(settings.openingTime) ||
      dateToMinutes(end) > timeToMinutes(settings.closingTime)
    ) {
      return {
        allowed: false,
        reason: `Booking must be between ${formatTime12(settings.openingTime)} and ${formatTime12(settings.closingTime)}`,
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

    return { allowed: true }
  }
}

export const settingsService = new SettingsService()
