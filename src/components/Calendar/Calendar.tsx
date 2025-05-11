import { CalendarEvent } from '@schedule-x/calendar'
import { createEventsServicePlugin } from '@schedule-x/events-service'
import { ScheduleXCalendar, useCalendarApp } from '@schedule-x/react'
import { useEffect, useMemo, useState } from 'react'

import {
  makeBackgroundEventsConfig,
  makeCalendarsConfig,
  plugins,
  makeBaseConfig,
} from '@/components'
import { Settings, User } from '@/types'
import '@schedule-x/theme-default/dist/index.css'
import '@/components/Calendar/index.css'

interface CalendarCallbacks {
  onClickDate: (ds: string) => void
  onClickDateTime: (ds: string) => void
  onEventClick: (event: CalendarEvent) => void
  onEventUpdate: (event: CalendarEvent) => void
  onBeforeEventUpdate: (oldEvent: CalendarEvent, newEvent: CalendarEvent) => boolean
}

interface CalendarProps {
  settings: Settings
  users: User[]
  events: CalendarEvent[]
  callbacks: CalendarCallbacks
}

export const Calendar = ({ settings, users, events, callbacks }: CalendarProps) => {
  const [eventsService] = useState(() => createEventsServicePlugin())
  const baseConfig = useMemo(() => makeBaseConfig(settings), [settings])
  const backgroundEvents = useMemo(() => makeBackgroundEventsConfig(settings), [settings])
  const calendars = useMemo(() => makeCalendarsConfig(users), [users])

  const calendarApp = useCalendarApp({
    ...baseConfig,
    calendars,
    events,
    callbacks,
    backgroundEvents,
    plugins: [eventsService, ...plugins],
  })

  useEffect(() => eventsService.set(events), [eventsService, events])

  return <ScheduleXCalendar calendarApp={calendarApp} />
}
