import { format } from 'date-fns'
import { parseDateKey } from '../../utils/dateHelpers'
import Modal from '../Modal/Modal'
import styles from './Modals.module.css'

export default function DayDetailModal({ dateKey, dayData, onClose }) {
  const date = parseDateKey(dateKey)
  const txns = dayData?.transactions ?? []
  const balance = dayData?.balance ?? 0

  return (
    <Modal title="DAY DETAIL" onClose={onClose}>
      <h3 className={styles.dayHeading}>{format(date, 'EEEE, MMMM d, yyyy')}</h3>
      <div className={styles.dayBalance}>${balance.toFixed(2)}</div>

      {txns.length === 0 ? (
        <p className={styles.helperText}>No transactions on this day.</p>
      ) : (
        <div className={styles.txnList}>
          {txns.map((t) => (
            <div className={styles.txnRow} key={t.id}>
              <span>
                {t.icon} {t.name}
              </span>
              <span className={t.amount >= 0 ? styles.positive : styles.negative}>
                {t.amount >= 0 ? '+' : ''}${t.amount.toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      )}

      <div className={styles.actions}>
        <button type="button" className={styles.btn} onClick={onClose}>
          CLOSE
        </button>
      </div>
    </Modal>
  )
}
