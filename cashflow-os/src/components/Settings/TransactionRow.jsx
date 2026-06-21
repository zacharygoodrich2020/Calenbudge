import { useState } from 'react'
import { format } from 'date-fns'
import { getNextOccurrence } from '../../utils/balanceEngine'
import styles from './Settings.module.css'

export default function TransactionRow({ transaction, onEdit, onDelete }) {
  const [confirmingDelete, setConfirmingDelete] = useState(false)
  const isIncome = transaction.amount >= 0
  const next = getNextOccurrence(transaction, new Date())

  return (
    <div className={styles.txnRow}>
      <div className={styles.txnTop}>
        <span className={styles.txnName}>
          {transaction.icon} {transaction.name}
        </span>
        <span className={`${styles.txnAmount} ${isIncome ? styles.positive : styles.negative}`}>
          {isIncome ? '+' : ''}${transaction.amount.toFixed(2)}
        </span>
      </div>
      <div className={styles.txnMeta}>
        <span className={styles.badge}>
          {transaction.type === 'recurring' ? transaction.recurrence : 'one-time'}
        </span>
        <span>next: {next ? format(next, 'MMM d, yyyy') : '—'}</span>
      </div>

      {!confirmingDelete ? (
        <div className={styles.rowActions}>
          <button type="button" className={styles.smallBtn} onClick={() => onEdit(transaction)}>
            EDIT
          </button>
          <button type="button" className={styles.smallBtn} onClick={() => setConfirmingDelete(true)}>
            DELETE
          </button>
        </div>
      ) : (
        <div className={styles.confirmRow}>
          <span>DELETE {transaction.name}?</span>
          <div className={styles.confirmActions}>
            <button
              type="button"
              className={`${styles.smallBtn} ${styles.confirmYes}`}
              onClick={() => onDelete(transaction.id)}
            >
              YES
            </button>
            <button type="button" className={styles.smallBtn} onClick={() => setConfirmingDelete(false)}>
              NO
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
