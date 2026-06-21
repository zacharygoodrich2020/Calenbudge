import { useState } from 'react'
import Modal from '../Modal/Modal'
import styles from './Modals.module.css'

export default function InitModal({ onConfirm }) {
  const [value, setValue] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    const parsed = parseFloat(value)
    onConfirm(Number.isNaN(parsed) ? 0 : parsed)
  }

  return (
    <Modal title="INITIALIZE ACCOUNT" small>
      <form onSubmit={handleSubmit}>
        <p className={styles.helperText}>Welcome to CashFlow OS. Enter your current balance to boot up.</p>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="init-balance">
            Current Balance: $
          </label>
          <input
            id="init-balance"
            className={styles.input}
            type="number"
            step="0.01"
            autoFocus
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        </div>
        <div className={styles.actions}>
          <button type="submit" className={`${styles.btn} ${styles.btnPrimary}`}>
            BOOT UP
          </button>
        </div>
      </form>
    </Modal>
  )
}
