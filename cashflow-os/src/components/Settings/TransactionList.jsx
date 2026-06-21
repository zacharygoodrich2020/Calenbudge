import TransactionRow from './TransactionRow'
import styles from './Settings.module.css'

export default function TransactionList({ transactions, onEdit, onDelete }) {
  if (transactions.length === 0) {
    return <p className={styles.empty}>No transactions yet.</p>
  }

  return (
    <div className={styles.txnList}>
      {transactions.map((t) => (
        <TransactionRow key={t.id} transaction={t} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  )
}
