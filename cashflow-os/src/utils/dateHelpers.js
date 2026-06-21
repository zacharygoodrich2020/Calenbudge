import {
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isBefore,
  isSameDay,
  isSameMonth,
  parseISO,
  startOfDay,
  startOfMonth,
  startOfWeek,
} from 'date-fns'

export function formatDateKey(date) {
  return format(date, 'yyyy-MM-dd')
}

export function parseDateKey(key) {
  return parseISO(key)
}

/** Full weeks (Sun–Sat) covering the given month, for a clean calendar grid. */
export function getCalendarDays(monthDate) {
  const start = startOfWeek(startOfMonth(monthDate))
  const end = endOfWeek(endOfMonth(monthDate))
  return eachDayOfInterval({ start, end })
}

export function isPastDay(date, today) {
  return isBefore(startOfDay(date), startOfDay(today))
}

export { format, isSameDay, isSameMonth, parseISO, startOfDay }
