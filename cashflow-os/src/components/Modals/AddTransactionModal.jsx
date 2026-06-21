import { useState } from 'react'
import { format } from 'date-fns'
import Modal from '../Modal/Modal'
import styles from './Modals.module.css'

const ICON_OPTIONS = ['💰', '💸', '🏠', '🚗', '⚡', '📱', '🍕', '💊', '🛒', '👶', '🐕', '🎮']
const CATEGORY_OPTIONS = ['income', 'bill', 'expense', 'savings']
const RECURRENCE_OPTIONS = ['weekly', 'biweekly', 'monthly', 'yearly']

export default function AddTransactionModal({ initial, onSave, onClose }) {
  const isEditing = Boolean(initial)

  const [name, setName] = useState(initial?.name ?? '')
  const [isIncome, setIsIncome] = useState(initial ? initial.amount >= 0 : false)
  const [amountStr, setAmountStr] = useState(initial ? String(Math.abs(initial.amount)) : '')
  const [category, setCategory] = useState(initial?.category ?? 'bill')
  const [icon, setIcon] = useState(initial?.icon ?? ICON_OPTIONS[0])
  const [date, setDate] = useState(initial?.date ?? format(new Date(), 'yyyy-MM-dd'))
  const [isRecurring, setIsRecurring] = useState(initial ? initial.type === 'recurring' : false)
  const [recurrence, setRecurrence] = useState(initial?.recurrence ?? 'monthly')

  function handleSubmit(e) {
    e.preventDefault()
    const amount = Math.abs(parseFloat(amountStr)) || 0
    if (!name.trim() || amount <= 0) return

    onSave({
      name: name.trim(),
      amount: isIncome ? amount : -amount,
      type: isRecurring ? 'recurring' : 'one-time',
      date,
      recurrence: isRecurring ? recurrence : null,
      category,
      icon,
    })
  }

  return (
    <Modal title={isEditing ? 'EDIT TRANSACTION' : 'ADD TRANSACTION'} onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="txn-name">
            Name
          </label>
          <input
            id="txn-name"
            className={styles.input}
            type="text"
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Rent, Paycheck, Electric Bill..."
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Type</label>
          <div className={styles.toggleRow}>
            <button
              type="button"
              className={`${styles.toggleBtn} ${isIncome ? styles.activeIncome : ''}`}
              onClick={() => setIsIncome(true)}
            >
              💰 INCOME
            </button>
            <button
              type="button"
              className={`${styles.toggleBtn} ${!isIncome ? styles.activeExpense : ''}`}
              onClick={() => setIsIncome(false)}
            >
              💸 EXPENSE
            </button>
          </div>
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="txn-amount">
            Amount: $
          </label>
          <input
            id="txn-amount"
            className={styles.input}
            type="number"
            step="0.01"
            min="0"
            value={amountStr}
            onChange={(e) => setAmountStr(e.target.value)}
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="txn-category">
            Category
          </label>
          <select
            id="txn-category"
            className={styles.select}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {CATEGORY_OPTIONS.map((c) => (
              <option key={c} value={c}>
                {c.charAt(0).toUpperCase() + c.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Icon</label>
          <div className={styles.iconGrid}>
            {ICON_OPTIONS.map((opt) => (
              <button
                key={opt}
                type="button"
                className={`${styles.iconOption} ${icon === opt ? styles.active : ''}`}
                onClick={() => setIcon(opt)}
                aria-label={`Icon ${opt}`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="txn-date">
            Date
          </label>
          <input
            id="txn-date"
            className={styles.input}
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <div className={styles.checkboxRow}>
          <input
            id="txn-recurring"
            type="checkbox"
            checked={isRecurring}
            onChange={(e) => setIsRecurring(e.target.checked)}
          />
          <label htmlFor="txn-recurring">Recurring?</label>
        </div>

        {isRecurring && (
          <div className={styles.field}>
            <label className={styles.label} htmlFor="txn-recurrence">
              Recurrence
            </label>
            <select
              id="txn-recurrence"
              className={styles.select}
              value={recurrence}
              onChange={(e) => setRecurrence(e.target.value)}
            >
              {RECURRENCE_OPTIONS.map((r) => (
                <option key={r} value={r}>
                  {r.charAt(0).toUpperCase() + r.slice(1)}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className={styles.actions}>
          <button type="button" className={styles.btn} onClick={onClose}>
            CANCEL
          </button>
          <button type="submit" className={`${styles.btn} ${styles.btnPrimary}`}>
            SAVE
          </button>
        </div>
      </form>
    </Modal>
  )
}
