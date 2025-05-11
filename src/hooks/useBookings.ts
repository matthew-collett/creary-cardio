import { CalendarEvent } from '@schedule-x/calendar'
import { useState, useEffect, useCallback, useMemo } from 'react'

import { useAuth } from '@/context'
import { bookingService, settingsService } from '@/lib/services'
import { toScheduleXEvent } from '@/lib/utils'
import {
  Booking,
  EmptyServiceResponse,
  IsAllowed,
  NewResource,
  ServiceResponse,
  UpdatedResource,
} from '@/types'

type BookingStore = {
  bookings: Map<string, Booking>
  events: Map<string, CalendarEvent>
}

export const useBookings = () => {
  const { user } = useAuth()
  const [store, setStore] = useState<BookingStore>({ bookings: new Map(), events: new Map() })
  const [initialLoading, setInitialLoading] = useState<boolean>(true)
  const [actionLoading, setActionLoading] = useState<boolean>(false)
  const [userBookingCounts, setUserBookingCounts] = useState({ past: 0, upcoming: 0 })

  const bookings = useMemo(() => Array.from(store.bookings.values()), [store.bookings])
  const events = useMemo(() => Array.from(store.events.values()), [store.events])

  const fetchBookings = useCallback(async (): Promise<void> => {
    setInitialLoading(true)
    try {
      const { success, data } = await bookingService.list()
      if (success) {
        const bookings = new Map(data.map(b => [b.id, b]))
        const events = new Map(data.map(b => [b.id, toScheduleXEvent(b)]))
        setStore({ bookings, events })
      }
    } finally {
      setInitialLoading(false)
    }
  }, [])

  const getBooking = (id: string): Booking | null => store.bookings.get(id) || null
  const getEvent = (id: string): CalendarEvent | null => store.events.get(id) || null

  const fetchUserCounts = useCallback(async (): Promise<void> => {
    setInitialLoading(true)
    try {
      if (!user) {
        return
      }

      const [pastResponse, upcomingResponse] = await Promise.all([
        bookingService.getUserPastBookingsCount(user.id),
        bookingService.getUserUpcomingBookingsCount(user.id),
      ])

      if (pastResponse.success && upcomingResponse.success) {
        setUserBookingCounts({
          past: pastResponse.data,
          upcoming: upcomingResponse.data,
        })
      }
    } finally {
      setInitialLoading(false)
    }
  }, [user])

  useEffect(() => {
    fetchBookings()
    fetchUserCounts()

    const unsubscribe = bookingService.subscribe(() => {
      fetchBookings()
      fetchUserCounts()
    })

    return () => unsubscribe()
  }, [fetchBookings, fetchUserCounts])

  const createBooking = async (
    booking: NewResource<Booking>,
  ): Promise<ServiceResponse<Booking>> => {
    setActionLoading(true)
    try {
      const response = await bookingService.create(booking)
      if (response.success) {
        fetchBookings()
      }
      return response
    } finally {
      setActionLoading(false)
    }
  }

  const updateBooking = async (
    id: string,
    booking: UpdatedResource<Booking>,
  ): Promise<ServiceResponse<Booking>> => {
    setActionLoading(true)
    try {
      const response = await bookingService.update(id, booking)
      if (response.success) {
        fetchBookings()
      }
      return response
    } finally {
      setActionLoading(false)
    }
  }

  const deleteBooking = async (id: string): Promise<EmptyServiceResponse> => {
    setActionLoading(true)
    const response = await bookingService.delete(id)
    setActionLoading(false)

    if (response.success) {
      fetchBookings()
    }

    return response
  }

  const validateBooking = async (
    start: Date,
    end: Date,
    existingBookingId?: string,
  ): Promise<ServiceResponse<IsAllowed>> => {
    setActionLoading(true)
    try {
      const settingsResponse = await settingsService.isBookingAllowed(start, end)
      if (!settingsResponse.success || !settingsResponse.data.allowed) {
        return settingsResponse
      }

      const availabilityResponse = await bookingService.isTimeAvailable(
        start,
        end,
        existingBookingId,
      )

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
    } finally {
      setActionLoading(false)
    }
  }

  return {
    bookings,
    getBooking,
    events,
    getEvent,
    userBookingCounts,
    initialLoading,
    actionLoading,
    createBooking,
    updateBooking,
    deleteBooking,
    validateBooking,
    refetch: fetchBookings,
  }
}
