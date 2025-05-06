import { where, Timestamp } from 'firebase/firestore'

import { Service } from '@/lib/services'
import { Booking } from '@/types'

class BookingService extends Service<Booking> {
  constructor() {
    super('bookings')
  }

  getUserBookings = async (userId: string) => this.query(where('userId', '==', userId))

  getUserPastBookingsCount = async (userId: string) =>
    this.count(where('userId', '==', userId), where('end', '<', Timestamp.now()))

  getUserUpcomingBookingsCount = async (userId: string) =>
    this.count(where('userId', '==', userId), where('start', '>', Timestamp.now()))

  getBookingsByDateRange = async (start: Date, end: Date) =>
    this.query(
      where('start', '>=', Timestamp.fromDate(start)),
      where('start', '<=', Timestamp.fromDate(end)),
    )

  isTimeAvailable = async (start: Date, end: Date) =>
    this.notExists(
      where('start', '<', Timestamp.fromDate(end)),
      where('end', '>', Timestamp.fromDate(start)),
    )
}

export const bookingService = new BookingService()
