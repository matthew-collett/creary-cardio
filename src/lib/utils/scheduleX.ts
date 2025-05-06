import { CalendarEvent } from '@schedule-x/calendar'

import { Booking, User } from '@/types'

export const toScheduleXDateTime = (d: Date) => {
  const pad = (n: number) => String(n).padStart(2, '0')
  return (
    `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ` +
    `${pad(d.getHours())}:${pad(d.getMinutes())}`
  )
}

export const toScheduleXDate = (d: Date) => {
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

export const fromScheduleXDateTime = (dt: string): Date => new Date(dt)

export const fromScheduleXDate = (d: string): Date => {
  const [year, month, day] = d.split('-').map(Number)
  const date = new Date(year, month - 1, day)
  date.setHours(7, 0, 0, 0)
  return date
}

export const toScheduleXEvent = (
  booking: Booking,
  userLookup: Map<string, User>,
): CalendarEvent => {
  const owner = userLookup.get(booking.userId)
  const name = owner?.displayName ?? 'Unknown'

  return {
    id: booking.id!,
    title: `${booking.title} (${name})`,
    start: toScheduleXDateTime(booking.start.toDate()),
    end: toScheduleXDateTime(booking.end.toDate()),
    calendarId: booking.userId,
    ...(booking.rrule ? { rrule: booking.rrule } : {}),
    ...(booking.description ? { description: booking.description } : {}),
  }
}
