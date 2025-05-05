import { useState, useEffect, useCallback } from 'react'

import { useAuth } from '@/context'
import { handleError } from '@/lib'
import { bookingService, settingsService } from '@/lib/services'
import { Booking } from '@/types'

export const useBookings = () => {
  const { user } = useAuth()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [initialLoading, setInitialLoading] = useState<boolean>(true)
  const [counts, setCounts] = useState({ past: 0, upcoming: 0 })
  const [actionLoading, setActionLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const fetchBookings = useCallback(async () => {
    if (!user) {
      return
    }

    setInitialLoading(true)
    setError(null)

    try {
      const bookings = await bookingService.getAllBookings()
      setBookings(bookings)
    } catch (error) {
      setError(handleError(error))
    } finally {
      setInitialLoading(false)
    }
  }, [user])

  const fetchCounts = useCallback(async () => {
    if (!user) {
      return
    }

    try {
      const [pastCount, upcomingCount] = await Promise.all([
        bookingService.getUserPastBookingsCount(user.uid),
        bookingService.getUserUpcomingBookingsCount(user.uid),
      ])
      setCounts({ past: pastCount, upcoming: upcomingCount })
    } catch (error) {
      setError(handleError(error))
    }
  }, [user])

  useEffect(() => {
    fetchBookings()
    fetchCounts()

    const unsubscribe = bookingService.subscribe(() => {
      fetchBookings()
      fetchCounts()
    })

    return () => unsubscribe()
  }, [fetchBookings, fetchCounts])

  const createBooking = async (booking: Omit<Booking, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setActionLoading(true)
      setError(null)
      const bookingId = await bookingService.createBooking(booking)
      return bookingId
    } catch (error) {
      setError(handleError(error))
    } finally {
      setActionLoading(false)
    }
  }

  const updateBooking = async (
    id: string,
    data: Partial<Omit<Booking, 'id' | 'createdAt' | 'updatedAt'>>,
  ) => {
    try {
      setActionLoading(true)
      setError(null)
      const updatedBooking = await bookingService.updateBooking(id, data)
      return updatedBooking
    } catch (error) {
      setError(handleError(error))
    } finally {
      setActionLoading(false)
    }
  }

  const deleteBooking = async (id: string) => {
    try {
      setActionLoading(true)
      setError(null)
      await bookingService.deleteBooking(id)
      return true
    } catch (error) {
      setError(handleError(error))
      throw error
    } finally {
      setActionLoading(false)
    }
  }

  const validateBooking = async (start: Date, end: Date) => {
    try {
      setActionLoading(true)
      setError(null)

      const isAllowed = await settingsService.isBookingAllowed(start, end)
      if (!isAllowed.allowed) {
        return isAllowed
      }

      const isAvailable = await bookingService.isTimeAvailable(start, end)
      if (!isAvailable) {
        return {
          allowed: false,
          reason: 'This time slot is already booked',
        }
      }

      return { allowed: true }
    } catch (error) {
      setError(handleError(error))
    } finally {
      setActionLoading(false)
    }
    return { allowed: false, reason: 'Error while validating booking' }
  }

  return {
    bookings,
    createBooking,
    updateBooking,
    deleteBooking,
    validateBooking,
    counts,
    initialLoading,
    actionLoading,
    error,
    refetch: fetchBookings,
  }
}
