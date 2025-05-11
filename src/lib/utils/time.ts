export type Meridiem = 'AM' | 'PM'

export type Time12 = {
  time: string
  period: Meridiem
}

export const timeToMinutes = (timeStr: string): number => {
  const [h, m] = timeStr.split(':').map(Number)
  return h * 60 + m
}

export const dateToMinutes = (date: Date): number => date.getHours() * 60 + date.getMinutes()

export const formatTime12 = (time24 = ''): Time12 => {
  if (!time24) {
    return { time: '', period: 'AM' }
  }
  const [hours, minutes] = time24.split(':').map(Number)
  const period: Meridiem = hours >= 12 ? 'PM' : 'AM'
  const hours12 = hours % 12 || 12
  return { time: `${hours12}:${minutes.toString().padStart(2, '0')}`, period }
}

export const formatTime24 = ({ time, period }: Time12): string => {
  if (!time) {
    return ''
  }
  const [h, m] = time.split(':').map(Number)
  const hours24 = period === 'PM' && h < 12 ? h + 12 : period === 'AM' && h === 12 ? 0 : h
  return `${hours24.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`
}

export const formatTimeHHMM = (ts: string) => {
  if (!ts) {
    return ''
  }
  const parts = ts.split(':')
  if (parts.length >= 2) {
    return `${parts[0]}:${parts[1]}`
  }
  return ts
}

export const formatDatePretty = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    hourCycle: 'h12',
  }).format(date)
}

export const midnight = (d: Date): Date => {
  const newDate = new Date(d)
  newDate.setHours(0, 0, 0, 0)
  return newDate
}

export const today = new Date()

export const addDays = (d: Date, days: number): Date => new Date(d.getTime() + days * 86400000)

export const addHours = (d: Date, hours: number): Date => new Date(d.getTime() + hours * 3600000)

export const subtractDays = (d: Date, days: number): Date => new Date(d.getTime() - days * 86400000)

export const safeDate = (d: Date | string | null | undefined): Date =>
  d instanceof Date ? d : typeof d === 'string' ? new Date(d) : new Date()
