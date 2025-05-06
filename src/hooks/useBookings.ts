import { useState, useEffect, useCallback } from 'react'

import { useAuth } from '@/context'
import { bookingService, settingsService } from '@/lib/services'
import { Booking, IsAllowed, NewResource, ServiceResponse, UpdatedResource } from '@/types'

export const useBookings = () => {
  const { user } = useAuth()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [initialLoading, setInitialLoading] = useState<boolean>(true)
  const [actionLoading, setActionLoading] = useState<boolean>(false)
  const [counts, setCounts] = useState({ past: 0, upcoming: 0 })

  const fetchBookings = useCallback(async () => {
    if (!user) {
      return
    }

    setInitialLoading(true)
    const response = await bookingService.list()
    if (response.success) {
      setBookings(response.data)
    }

    setInitialLoading(false)
    return response
  }, [user])

  const fetchCounts = useCallback(async () => {
    if (!user) {
      return
    }

    setInitialLoading(true)
    const [pastResponse, upcomingResponse] = await Promise.all([
      bookingService.getUserPastBookingsCount(user.id),
      bookingService.getUserUpcomingBookingsCount(user.id),
    ])

    if (pastResponse.success && upcomingResponse.success) {
      setCounts({
        past: pastResponse.data,
        upcoming: upcomingResponse.data,
      })
    }

    setInitialLoading(false)
    return { pastResponse, upcomingResponse }
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

  const createBooking = async (booking: NewResource<Booking>) => {
    setActionLoading(true)
    const response = await bookingService.create(booking)
    setActionLoading(false)

    if (response.success) {
      fetchBookings()
    }

    return response
  }

  const updateBooking = async (id: string, booking: UpdatedResource<Booking>) => {
    setActionLoading(true)
    const response = await bookingService.update(id, booking)
    setActionLoading(false)

    if (response.success) {
      fetchBookings()
    }

    return response
  }

  const deleteBooking = async (id: string) => {
    setActionLoading(true)
    const response = await bookingService.delete(id)
    setActionLoading(false)

    if (response.success) {
      fetchBookings()
    }

    return response
  }

  const validateBooking = async (start: Date, end: Date): Promise<ServiceResponse<IsAllowed>> => {
    setActionLoading(true)

    const settingsResponse = await settingsService.isBookingAllowed(start, end)

    if (!settingsResponse.success) {
      setActionLoading(false)
      return settingsResponse
    }

    if (!settingsResponse.data.allowed) {
      setActionLoading(false)
      return settingsResponse
    }

    const availabilityResponse = await bookingService.isTimeAvailable(start, end)

    setActionLoading(false)

    if (!availabilityResponse.success) {
      return availabilityResponse
    }

    if (!availabilityResponse.data) {
      return {
        success: true,
        data: {
          allowed: false,
          reason: 'This time slot is already booked',
        },
      }
    }

    return {
      success: true,
      data: { allowed: true },
    }
  }

  return {
    bookings,
    counts,
    initialLoading,
    actionLoading,
    createBooking,
    updateBooking,
    deleteBooking,
    validateBooking,
    refetch: fetchBookings,
  }
}
