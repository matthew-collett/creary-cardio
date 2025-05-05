import {
  createViewDay,
  createViewMonthAgenda,
  createViewMonthGrid,
  createViewWeek,
  viewWeek,
} from '@schedule-x/calendar'
import { createEventsServicePlugin } from '@schedule-x/events-service'
import { ScheduleXCalendar, useCalendarApp } from '@schedule-x/react'
import { useEffect, useMemo, useState } from 'react'

import { calendarsConfig, plugins } from '@/components/Calendar'
import { addDays, fromScheduleXDate, toScheduleXDate, toScheduleXEvent } from '@/lib'
import { Booking, Settings, User } from '@/types'

import '@schedule-x/theme-default/dist/index.css'
import '@/components/Calendar/index.css'

interface CalendarProps {
  settings: Settings
  users: User[] | null
  userLookup: Map<string, User>
  bookings: Booking[]
  onSlotClick: (date: Date) => void
}

export const Calendar = ({ settings, users, userLookup, bookings, onSlotClick }: CalendarProps) => {
  const [eventsService] = useState(() => createEventsServicePlugin())
  const calendars = useMemo(() => calendarsConfig(users || []), [users])
  const sxEvents = useMemo(
    () => bookings.map(b => toScheduleXEvent(b, userLookup)),
    [bookings, userLookup],
  )

  const calendarApp = useCalendarApp({
    views: [createViewDay(), createViewWeek(), createViewMonthGrid(), createViewMonthAgenda()],
    defaultView: viewWeek.name,
    firstDayOfWeek: 0,
    dayBoundaries: { start: settings.openingTime, end: settings.closingTime },
    weekOptions: { eventOverlap: false, gridHeight: 800 },
    calendars,
    plugins: [eventsService, ...plugins],
    events: sxEvents,
    callbacks: {
      onClickDateTime(dateTime) {
        onSlotClick(fromScheduleXDate(dateTime))
      },
      onClickDate(date) {
        onSlotClick(fromScheduleXDate(date))
      },
    },
    backgroundEvents: [
      {
        title: 'Not Allowed',
        start: toScheduleXDate(addDays(new Date(), settings.advanceBookingDays)),
        end: toScheduleXDate(addDays(new Date(), settings.advanceBookingDays)),
        rrule: 'FREQ=DAILY',
        style: {
          backgroundImage:
            'repeating-linear-gradient(45deg, #ccc, #ccc 5px, transparent 5px, transparent 10px)',
          opacity: 0.5,
        },
      },
    ],
  })

  useEffect(() => {
    eventsService.set(sxEvents)
  }, [eventsService, sxEvents])

  return <ScheduleXCalendar calendarApp={calendarApp} />
}
