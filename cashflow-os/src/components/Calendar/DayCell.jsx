import { format } from 'date-fns'
import { formatDateKey, isSameDay, isSameMonth } from '../../utils/dateHelpers'
import styles from './Calendar.module.css'

function getBalanceColorClass(balance) {
  if (balance <= 0) return styles.red
  if (balance <= 100) return styles.yellow
  return styles.green
}

export default function DayCell({ date, currentMonth, today, dayData, isPast, onClick }) {
  const inMonth = isSameMonth(date, currentMonth)
  const isToday = isSameDay(date, today)
  const interactive = inMonth && !isPast

  if (!inMonth) {
    return (
      <div className={`${styles.cell} ${styles.cellOutside}`}>
        <span className={styles.dayNumber}>{format(date, 'd')}</span>
      </div>
    )
  }

  const balance = dayData?.balance ?? 0
  const txns = dayData?.transactions ?? []

  const cellClasses = [
    styles.cell,
    isPast ? styles.cellPast : '',
    isToday ? styles.cellToday : '',
    interactive ? styles.cellInteractive : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div
      className={cellClasses}
      onClick={interactive ? () => onClick(formatDateKey(date)) : undefined}
      role={interactive ? 'button' : undefined}
      tabIndex={interactive ? 0 : undefined}
    >
      {isToday && <div className={styles.todayBar} aria-hidden="true" />}
      <span className={styles.dayNumber}>{format(date, 'd')}</span>
      <span className={`${styles.balance} ${isPast ? '' : getBalanceColorClass(balance)}`}>
        ${balance.toFixed(0)}
      </span>
      {txns.length > 0 && (
        <span className={styles.icons}>
          {txns.slice(0, 3).map((t, i) => (
            <span key={i}>{t.amount >= 0 ? '💰' : '💸'}</span>
          ))}
          {txns.length > 3 && <span>+{txns.length - 3}</span>}
        </span>
      )}
      {txns.length > 0 && (
        <div className={styles.tooltip}>
          {txns.map((t) => (
            <div className={styles.tooltipRow} key={t.id}>
              <span>
                {t.icon} {t.name}
              </span>
              <span>
                {t.amount >= 0 ? '+' : ''}${t.amount.toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
