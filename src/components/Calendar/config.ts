import { type CalendarType } from '@schedule-x/calendar'
import { createCurrentTimePlugin } from '@schedule-x/current-time'
import { createDragAndDropPlugin } from '@schedule-x/drag-and-drop'
import { createEventRecurrencePlugin } from '@schedule-x/event-recurrence'
import { createResizePlugin } from '@schedule-x/resize'

import type { User } from '@/types'

const plugins = [
  createEventRecurrencePlugin(),
  createCurrentTimePlugin(),
  createDragAndDropPlugin(),
  createResizePlugin(),
]

const calendarsConfig = (users: User[]): Record<string, CalendarType> => {
  return users.reduce(
    (acc, u) => {
      acc[u.uid] = {
        colorName: u.uid,
        lightColors: { main: u.color, container: u.color + '55', onContainer: '#000' },
      }
      return acc
    },
    {} as Record<string, CalendarType>,
  )
}

export { plugins, calendarsConfig }
