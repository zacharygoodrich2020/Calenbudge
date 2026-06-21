import CurrentBalanceDisplay from './CurrentBalanceDisplay'
import LowestBalanceStat from './LowestBalanceStat'
import styles from './Header.module.css'

export default function Header({ balance, lowestBalance, onResync, onAdd, onSettings }) {
  return (
    <div className={styles.header}>
      <div className={styles.statGroup}>
        <CurrentBalanceDisplay balance={balance} />
        <LowestBalanceStat lowestBalance={lowestBalance} />
      </div>
      <div className={styles.actions}>
        <button type="button" className={`${styles.btn} ${styles.resyncBtn}`} onClick={onResync}>
          ⚡ RESYNC
        </button>
        <button type="button" className={styles.btn} onClick={onAdd}>
          + ADD
        </button>
        <button
          type="button"
          className={`${styles.btn} ${styles.iconBtn}`}
          onClick={onSettings}
          aria-label="Settings"
        >
          ⚙️
        </button>
      </div>
    </div>
  )
}
