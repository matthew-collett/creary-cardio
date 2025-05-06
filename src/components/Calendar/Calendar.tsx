import { createEventsServicePlugin } from '@schedule-x/events-service'
import { ScheduleXCalendar, useCalendarApp } from '@schedule-x/react'
import { useEffect, useMemo, useState } from 'react'

import {
  makeBackgroundEventsConfig,
  makeCalendarsConfig,
  plugins,
  makeBaseConfig,
} from '@/components/Calendar'
import { fromScheduleXDate, fromScheduleXDateTime, toScheduleXEvent } from '@/lib/utils'
import { Booking, Settings, User } from '@/types'
import '@schedule-x/theme-default/dist/index.css'
import '@/components/Calendar/index.css'

interface CalendarProps {
  settings: Settings
  users: User[]
  userMap: Map<string, User>
  bookings: Booking[]
  onDateClick: (date: Date) => void
}

export const Calendar = ({ settings, users, userMap, bookings, onDateClick }: CalendarProps) => {
  const [eventsService] = useState(() => createEventsServicePlugin())

  const baseConfig = useMemo(() => makeBaseConfig(settings), [settings])
  const calendarsConfig = useMemo(() => makeCalendarsConfig(users), [users])
  const backgroundEventsConfig = useMemo(() => makeBackgroundEventsConfig(settings), [settings])
  const events = useMemo(() => bookings.map(b => toScheduleXEvent(b, userMap)), [bookings, userMap])

  const calendarApp = useCalendarApp({
    ...baseConfig,
    calendars: calendarsConfig,
    backgroundEvents: backgroundEventsConfig,
    plugins: [eventsService, ...plugins],
    events: events,
    callbacks: {
      onClickDateTime: dateTime => onDateClick(fromScheduleXDateTime(dateTime)),
      onClickDate: date => onDateClick(fromScheduleXDate(date)),
    },
  })

  useEffect(() => eventsService.set(events), [eventsService, events])

  return <ScheduleXCalendar calendarApp={calendarApp} />
}
