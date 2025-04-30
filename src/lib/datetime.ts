// Convert time string "HH:MM" to minutes since midnight
export const timeToMinutes = (timeStr: string): number => {
  const [hours, minutes] = timeStr.split(':').map(Number)
  return hours * 60 + minutes
}

// Convert Date to minutes since midnight
export const dateToMinutes = (date: Date): number => {
  return date.getHours() * 60 + date.getMinutes()
}
