import { Service } from '@/lib/services'
import { dateToMinutes, timeToMinutes, addDays, midnight, today, formatTime12 } from '@/lib/utils'
import { IsAllowed, ServiceResponse, Settings, UpdatedResource } from '@/types'

class SettingsService extends Service<Settings> {
  constructor() {
    super('settings')
  }

  getSettings = async (): Promise<ServiceResponse<Settings>> => this.get('calendar')

  updateSettings = async (
    settings: UpdatedResource<Settings>,
  ): Promise<ServiceResponse<Settings>> => this.update('calendar', settings)

  isBookingAllowed = async (start: Date, end: Date): Promise<ServiceResponse<IsAllowed>> =>
    this.executeOperation<IsAllowed>(async () => {
      const settingsResponse = await this.getSettings()
      if (!settingsResponse.success) {
        throw new Error(settingsResponse.error)
      }

      const settings = settingsResponse.data
      const timeSlot = Math.round((end.getTime() - start.getTime()) / 60000)
      const openingTime12 = formatTime12(settings.openingTime)
      const closingTime12 = formatTime12(settings.closingTime)

      if (timeSlot > settings.maxDurationMinutes) {
        return {
          success: true,
          data: {
            allowed: false,
            reason: `Booking exceeds maximum duration of ${settings.maxDurationMinutes} minutes`,
          },
        }
      }

      if (
        dateToMinutes(start) < timeToMinutes(settings.openingTime) ||
        dateToMinutes(end) > timeToMinutes(settings.closingTime)
      ) {
        return {
          success: true,
          data: {
            allowed: false,
            reason: `Booking must be between ${openingTime12.time} ${openingTime12.period} and ${closingTime12.time} ${closingTime12.period}`,
          },
        }
      }

      if (midnight(start) > addDays(midnight(today), settings.advanceBookingDays)) {
        return {
          success: true,
          data: {
            allowed: false,
            reason: `Bookings can only be made up to ${settings.advanceBookingDays} days in advance`,
          },
        }
      }

      return {
        success: true,
        data: { allowed: true },
      }
    })
}

export const settingsService = new SettingsService()
