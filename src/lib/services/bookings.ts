import { where, Timestamp } from 'firebase/firestore'

import { Service } from '@/lib/services'
import { Booking, ServiceResponse } from '@/types'

class BookingService extends Service<Booking> {
  constructor() {
    super('bookings')
  }

  getUserBookings = async (userId: string): Promise<ServiceResponse<Booking[]>> =>
    this.query(where('userId', '==', userId))

  getUserPastBookingsCount = async (userId: string): Promise<ServiceResponse<number>> =>
    this.count(where('userId', '==', userId), where('end', '<', Timestamp.now()))

  getUserUpcomingBookingsCount = async (userId: string): Promise<ServiceResponse<number>> =>
    this.count(where('userId', '==', userId), where('start', '>', Timestamp.now()))

  getBookingsByDateRange = async (start: Date, end: Date): Promise<ServiceResponse<Booking[]>> =>
    this.query(
      where('start', '>=', Timestamp.fromDate(start)),
      where('start', '<=', Timestamp.fromDate(end)),
    )

  isTimeAvailable = async (
    start: Date,
    end: Date,
    existingBookingId?: string,
  ): Promise<ServiceResponse<boolean>> => {
    const constraints = [
      where('start', '<', Timestamp.fromDate(end)),
      where('end', '>', Timestamp.fromDate(start)),
    ]

    const { success, data, error } = await this.query(...constraints)
    if (!success) {
      return { success, error }
    }

    const overlap = data.filter(b => !existingBookingId || b.id !== existingBookingId)
    return {
      success: true,
      data: overlap.length === 0,
    }
  }
}

export const bookingService = new BookingService()
