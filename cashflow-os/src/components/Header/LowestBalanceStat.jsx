import { format, parseISO } from 'date-fns'
import styles from './Header.module.css'

export default function LowestBalanceStat({ lowestBalance }) {
  if (!lowestBalance) return null

  const isNegative = lowestBalance.amount <= 0

  return (
    <div className={styles.lowStat}>
      <span className={styles.lowLabel}>⚠ LOWEST 30D</span>
      <span className={`${styles.lowValue} ${isNegative ? styles.negative : styles.positive}`}>
        LOW: ${lowestBalance.amount.toFixed(2)} · {format(parseISO(lowestBalance.date), 'MMM d')}
      </span>
    </div>
  )
}
