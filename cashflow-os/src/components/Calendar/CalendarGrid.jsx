import { formatDateKey, getCalendarDays, isPastDay } from '../../utils/dateHelpers'
import DayCell from './DayCell'
import styles from './Calendar.module.css'

const WEEKDAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']

export default function CalendarGrid({ currentMonth, futureBalances, onDayClick }) {
  const today = new Date()
  const days = getCalendarDays(currentMonth)

  return (
    <div>
      <div className={styles.weekdays}>
        {WEEKDAYS.map((wd) => (
          <span key={wd} className={styles.weekday}>
            {wd}
          </span>
        ))}
      </div>
      <div className={styles.grid}>
        {days.map((date) => {
          const dateKey = formatDateKey(date)
          return (
            <DayCell
              key={dateKey}
              date={date}
              currentMonth={currentMonth}
              today={today}
              dayData={futureBalances[dateKey]}
              isPast={isPastDay(date, today)}
              onClick={onDayClick}
            />
          )
        })}
      </div>
    </div>
  )
}
