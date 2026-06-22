import { useState } from 'react';
import Modal from './Modal';
import styles from './Modals.module.css';
import { Transaction } from '../../types';
import { todayStr } from '../../utils/dateHelpers';

const ICONS = ['💰', '💸', '🏠', '🚗', '⚡', '📱', '🍕', '💊', '🛒', '👶', '🐕', '🎮'];

interface AddTransactionModalProps {
  editing?: Transaction | null;
  onSave: (data: Omit<Transaction, 'id'>) => void;
  onClose: () => void;
}

export default function AddTransactionModal({ editing, onSave, onClose }: AddTransactionModalProps) {
  const [name, setName] = useState(editing?.name ?? '');
  const [amountStr, setAmountStr] = useState(editing ? String(Math.abs(editing.amount)) : '');
  const [isExpense, setIsExpense] = useState(editing ? editing.amount < 0 : true);
  const [category, setCategory] = useState<Transaction['category']>(editing?.category ?? 'expense');
  const [icon, setIcon] = useState(editing?.icon ?? '💸');
  const [date, setDate] = useState(editing?.date ?? todayStr());
  const [isRecurring, setIsRecurring] = useState(editing?.type === 'recurring');
  const [recurrence, setRecurrence] = useState<NonNullable<Transaction['recurrence']>>(
    (editing?.recurrence as NonNullable<Transaction['recurrence']>) ?? 'monthly'
  );

  function handleSave() {
    if (!name.trim() || !amountStr || !date) return;
    const absAmount = parseFloat(amountStr);
    if (isNaN(absAmount) || absAmount < 0) return;
    const amount = isExpense ? -absAmount : absAmount;

    onSave({
      name: name.trim(),
      amount,
      type: isRecurring ? 'recurring' : 'one-time',
      date,
      recurrence: isRecurring ? recurrence : null,
      category,
      icon,
    });
  }

  return (
    <Modal title={editing ? 'EDIT TRANSACTION' : 'ADD TRANSACTION'} onClose={onClose}>
      <div className={styles.field}>
        <label className={styles.label}>NAME</label>
        <input className="win-input" value={name} onChange={e => setName(e.target.value)} placeholder="Rent, Paycheck..." autoFocus />
      </div>

      <div className={styles.toggleRow}>
        <button
          className={`${styles.toggleBtn} ${!isExpense ? styles.toggleBtnActive : ''}`}
          onClick={() => { setIsExpense(false); setCategory('income'); }}
        >INCOME</button>
        <button
          className={`${styles.toggleBtn} ${isExpense ? styles.toggleBtnActive : ''}`}
          onClick={() => { setIsExpense(true); setCategory('expense'); }}
        >EXPENSE</button>
      </div>

      <div className={styles.field}>
        <label className={styles.label}>AMOUNT ($)</label>
        <input className="win-input" type="number" min="0" step="0.01" value={amountStr} onChange={e => setAmountStr(e.target.value)} placeholder="0.00" />
      </div>

      <div className={styles.field}>
        <label className={styles.label}>CATEGORY</label>
        <select className="win-select" value={category} onChange={e => setCategory(e.target.value as Transaction['category'])}>
          <option value="income">Income</option>
          <option value="bill">Bill</option>
          <option value="expense">Expense</option>
          <option value="savings">Savings</option>
        </select>
      </div>

      <div className={styles.field}>
        <label className={styles.label}>ICON</label>
        <div className={styles.iconGrid}>
          {ICONS.map(i => (
            <button
              key={i}
              className={`${styles.iconBtn} ${icon === i ? styles.iconBtnActive : ''}`}
              onClick={() => setIcon(i)}
            >{i}</button>
          ))}
        </div>
      </div>

      <div className={styles.field}>
        <label className={styles.label}>DATE</label>
        <input className="win-input" type="date" value={date} onChange={e => setDate(e.target.value)} />
      </div>

      <div className={styles.field}>
        <label className={styles.label}>RECURRING?</label>
        <div className={styles.toggleRow}>
          <button className={`${styles.toggleBtn} ${!isRecurring ? styles.toggleBtnActive : ''}`} onClick={() => setIsRecurring(false)}>ONE-TIME</button>
          <button className={`${styles.toggleBtn} ${isRecurring ? styles.toggleBtnActive : ''}`} onClick={() => setIsRecurring(true)}>RECURRING</button>
        </div>
      </div>

      {isRecurring && (
        <div className={styles.field}>
          <label className={styles.label}>FREQUENCY</label>
          <select className="win-select" value={recurrence} onChange={e => setRecurrence(e.target.value as NonNullable<Transaction['recurrence']>)}>
            <option value="weekly">Weekly</option>
            <option value="biweekly">Biweekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>
      )}

      <div className={styles.btnRow}>
        <button className="win-btn" onClick={onClose}>CANCEL</button>
        <button className="win-btn" style={{ background: 'var(--win-accent)', color: '#fff' }} onClick={handleSave}>SAVE</button>
      </div>
    </Modal>
  );
}
