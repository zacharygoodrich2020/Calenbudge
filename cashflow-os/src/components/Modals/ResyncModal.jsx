import { useState } from 'react'
import Modal from '../Modal/Modal'
import styles from './Modals.module.css'

export default function ResyncModal({ currentBalance, onConfirm, onClose }) {
  const [value, setValue] = useState(String(currentBalance))

  function handleSubmit(e) {
    e.preventDefault()
    const parsed = parseFloat(value)
    onConfirm(Number.isNaN(parsed) ? currentBalance : parsed)
  }

  return (
    <Modal title="RESYNC BALANCE" onClose={onClose} small>
      <form onSubmit={handleSubmit}>
        <p className={styles.helperText}>Enter your actual current balance.</p>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="resync-balance">
            Actual Balance: $
          </label>
          <input
            id="resync-balance"
            className={styles.input}
            type="number"
            step="0.01"
            autoFocus
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        </div>
        <div className={styles.actions}>
          <button type="button" className={styles.btn} onClick={onClose}>
            CANCEL
          </button>
          <button type="submit" className={`${styles.btn} ${styles.btnPrimary}`}>
            CONFIRM
          </button>
        </div>
      </form>
    </Modal>
  )
}
