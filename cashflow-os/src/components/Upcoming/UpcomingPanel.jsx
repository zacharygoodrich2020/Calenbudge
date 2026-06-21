import { format } from 'date-fns'
import { parseDateKey } from '../../utils/dateHelpers'
import Window from '../Window/Window'
import styles from './Upcoming.module.css'

/** Walks the future-balance map day by day to find the next 7 individual transaction firings. */
function getUpcomingItems(currentBalance, futureBalances) {
  const sortedDates = Object.keys(futureBalances).sort()
  const items = []
  let enteringBalance = currentBalance

  for (const dateKey of sortedDates) {
    const { transactions: txns, balance: dayFinalBalance } = futureBalances[dateKey]
    let running = enteringBalance
    for (const txn of txns) {
      running += txn.amount
      items.push({ dateKey, txn, balanceAfter: running })
    }
    enteringBalance = dayFinalBalance
    if (items.length >= 7) break
  }

  return items.slice(0, 7)
}

function UpcomingItem({ item }) {
  const { dateKey, txn, balanceAfter } = item
  const isIncome = txn.amount >= 0

  return (
    <div className={styles.item}>
      <span className={styles.icon}>{txn.icon}</span>
      <span className={styles.name}>{txn.name}</span>
      <span className={styles.date}>{format(parseDateKey(dateKey), 'MMM d')}</span>
      <span className={`${styles.amount} ${isIncome ? styles.positive : styles.negative}`}>
        {isIncome ? '+' : ''}${txn.amount.toFixed(2)}
      </span>
      <span className={styles.balanceAfter}>balance: ${balanceAfter.toFixed(2)}</span>
    </div>
  )
}

export default function UpcomingPanel({ currentBalance, futureBalances }) {
  const items = getUpcomingItems(currentBalance, futureBalances)

  return (
    <Window title="UPCOMING" className={styles.window}>
      {items.length === 0 ? (
        <div className={styles.empty}>No upcoming transactions.</div>
      ) : (
        <div className={styles.list}>
          {items.map((item, i) => (
            <UpcomingItem key={`${item.txn.id}-${item.dateKey}-${i}`} item={item} />
          ))}
        </div>
      )}
    </Window>
  )
}
