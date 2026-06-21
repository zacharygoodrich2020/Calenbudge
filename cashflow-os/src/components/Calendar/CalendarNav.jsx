import { addMonths, format, subMonths } from 'date-fns'
import styles from './Calendar.module.css'

export default function CalendarNav({ currentMonth, setCurrentMonth }) {
  return (
    <div className={styles.nav}>
      <button
        type="button"
        className={styles.navBtn}
        onClick={() => setCurrentMonth((m) => subMonths(m, 1))}
        aria-label="Previous month"
      >
        ←
      </button>
      <span className={styles.monthLabel}>{format(currentMonth, 'MMMM yyyy')}</span>
      <button
        type="button"
        className={styles.navBtn}
        onClick={() => setCurrentMonth((m) => addMonths(m, 1))}
        aria-label="Next month"
      >
        →
      </button>
    </div>
  )
}
