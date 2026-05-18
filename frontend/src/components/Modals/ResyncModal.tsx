import { useState } from 'react';
import Modal from './Modal';
import styles from './Modals.module.css';

interface ResyncModalProps {
  currentBalance: number;
  onConfirm: (balance: number) => void;
  onClose: () => void;
}

export default function ResyncModal({ currentBalance, onConfirm, onClose }: ResyncModalProps) {
  const [value, setValue] = useState(String(currentBalance));

  function handleSubmit() {
    const n = parseFloat(value.replace(/[^0-9.-]/g, ''));
    if (!isNaN(n)) onConfirm(n);
  }

  return (
    <Modal title="RESYNC BALANCE" onClose={onClose}>
      <p style={{ fontFamily: 'IBM Plex Mono', fontSize: '12px', color: 'var(--win-text-dim)', marginBottom: '12px' }}>
        Enter your actual current balance to recalibrate all projections.
      </p>
      <div className={styles.field}>
        <label className={styles.label}>ACTUAL BALANCE ($)</label>
        <input
          className="win-input"
          type="number"
          value={value}
          onChange={e => setValue(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSubmit()}
          autoFocus
        />
      </div>
      <div className={styles.btnRow}>
        <button className="win-btn" style={{ outline: '1px solid var(--win-accent-2)', color: 'var(--win-accent-2)' }} onClick={handleSubmit}>
          ⚡ CONFIRM RESYNC
        </button>
      </div>
    </Modal>
  );
}
