import { useState } from 'react';
import { Transaction } from '../../types';
import TransactionRow from './TransactionRow';
import styles from './Settings.module.css';
import { saveBalance } from '../../utils/localStorage';

interface SettingsDrawerProps {
  currentBalance: number;
  transactions: Transaction[];
  onBalanceChange: (b: number) => void;
  onEdit: (tx: Transaction) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}

export default function SettingsDrawer({
  currentBalance,
  transactions,
  onBalanceChange,
  onEdit,
  onDelete,
  onClose,
}: SettingsDrawerProps) {
  const [balStr, setBalStr] = useState(String(currentBalance));

  function handleBalanceSave() {
    const n = parseFloat(balStr);
    if (!isNaN(n)) {
      saveBalance(n);
      onBalanceChange(n);
    }
  }

  return (
    <div className={styles.drawer}>
      <div className={styles.titlebar}>
        <span className={styles.title}>SETTINGS</span>
        <button className={styles.closeBtn} onClick={onClose}>✕</button>
      </div>
      <div className={styles.body}>
        <div className={styles.section}>
          <p className={styles.sectionTitle}>ADJUST BALANCE</p>
          <div className={styles.balanceRow}>
            <input
              className="win-input"
              type="number"
              value={balStr}
              onChange={e => setBalStr(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleBalanceSave()}
            />
            <button className="win-btn" onClick={handleBalanceSave}>SET</button>
          </div>
        </div>

        <div className={styles.section}>
          <p className={styles.sectionTitle}>TRANSACTIONS ({transactions.length})</p>
          <div className={styles.txnList}>
            {transactions.length === 0 && (
              <p style={{ fontFamily: 'IBM Plex Mono', fontSize: '12px', color: 'var(--win-text-dim)' }}>
                No transactions yet.
              </p>
            )}
            {transactions.map(tx => (
              <TransactionRow
                key={tx.id}
                transaction={tx}
                onEdit={() => onEdit(tx)}
                onDelete={() => onDelete(tx.id)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
