import { useState } from 'react'
import styles from './Settings.module.css'

export default function BalanceAdjuster({ currentBalance, onAdjustBalance }) {
  const [value, setValue] = useState(String(currentBalance))

  function handleSubmit(e) {
    e.preventDefault()
    const parsed = parseFloat(value)
    if (!Number.isNaN(parsed)) onAdjustBalance(parsed)
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className={styles.adjusterRow}>
        <input
          className={styles.input}
          type="number"
          step="0.01"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <button type="submit" className={styles.btn}>
          UPDATE
        </button>
      </div>
    </form>
  )
}
