import { createPortal } from 'react-dom'
import BalanceAdjuster from './BalanceAdjuster'
import TransactionList from './TransactionList'
import styles from './Settings.module.css'

export default function SettingsDrawer({
  open,
  onClose,
  currentBalance,
  onAdjustBalance,
  transactions,
  onEdit,
  onDelete,
}) {
  if (!open) return null

  return createPortal(
    <>
      <div className={styles.backdrop} onClick={onClose} />
      <div className={styles.drawer}>
        <div className={styles.titlebar}>
          <span className={styles.title}>SETTINGS</span>
          <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Close settings">
            ✕
          </button>
        </div>
        <div className={styles.body}>
          <div className={styles.sectionLabel}>BALANCE ADJUSTMENT</div>
          <BalanceAdjuster currentBalance={currentBalance} onAdjustBalance={onAdjustBalance} />

          <div className={styles.sectionLabel}>TRANSACTIONS</div>
          <TransactionList transactions={transactions} onEdit={onEdit} onDelete={onDelete} />
        </div>
      </div>
    </>,
    document.body
  )
}
