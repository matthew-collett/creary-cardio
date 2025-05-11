import {
  BackgroundEvent,
  CalendarConfig,
  createViewDay,
  createViewMonthAgenda,
  createViewMonthGrid,
  createViewWeek,
  viewWeek,
  type CalendarType,
} from '@schedule-x/calendar'
import { createCurrentTimePlugin } from '@schedule-x/current-time'
import { createDragAndDropPlugin } from '@schedule-x/drag-and-drop'
import { createEventRecurrencePlugin } from '@schedule-x/event-recurrence'
import { createResizePlugin } from '@schedule-x/resize'

import { addDays, formatTimeHHMM, midnight, today, toScheduleXDate } from '@/lib/utils'
import type { Settings, User } from '@/types'

export const plugins = [
  createEventRecurrencePlugin(),
  createCurrentTimePlugin(),
  createDragAndDropPlugin(),
  createResizePlugin(),
]

export const makeBaseConfig = ({ openingTime, closingTime }: Settings): CalendarConfig => {
  return {
    views: [createViewDay(), createViewWeek(), createViewMonthGrid(), createViewMonthAgenda()],
    defaultView: viewWeek.name,
    firstDayOfWeek: 0,
    dayBoundaries: { start: formatTimeHHMM(openingTime), end: formatTimeHHMM(closingTime) },
    weekOptions: { eventOverlap: false, gridHeight: 800 },
  }
}

export const makeCalendarsConfig = (users: User[]): Record<string, CalendarType> => {
  return users.reduce(
    (acc, u) => {
      acc[u.id] = {
        colorName: u.id,
        lightColors: { main: u.color, container: u.color + '77', onContainer: '#000' },
      }
      return acc
    },
    {} as Record<string, CalendarType>,
  )
}

export const makeBackgroundEventsConfig = ({ advanceBookingDays }: Settings): BackgroundEvent[] => {
  return [
    {
      title: 'Not Allowed',
      start: toScheduleXDate(addDays(midnight(today), advanceBookingDays + 1)),
      end: toScheduleXDate(addDays(midnight(today), advanceBookingDays + 1)),
      rrule: 'FREQ=DAILY',
      style: {
        backgroundImage:
          'repeating-linear-gradient(45deg, #ccc, #ccc 5px, transparent 5px, transparent 10px)',
        opacity: 0.5,
      },
    },
  ]
}
