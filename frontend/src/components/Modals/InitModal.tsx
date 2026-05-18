import { useState } from 'react';
import Modal from './Modal';
import styles from './Modals.module.css';

interface InitModalProps {
  onConfirm: (balance: number) => void;
}

export default function InitModal({ onConfirm }: InitModalProps) {
  const [value, setValue] = useState('');

  function handleSubmit() {
    const n = parseFloat(value.replace(/[^0-9.-]/g, ''));
    if (!isNaN(n)) onConfirm(n);
  }

  return (
    <Modal title="INITIALIZE ACCOUNT">
      <div className={styles.field}>
        <label className={styles.label}>CURRENT BALANCE ($)</label>
        <input
          className="win-input"
          type="number"
          placeholder="0.00"
          value={value}
          onChange={e => setValue(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSubmit()}
          autoFocus
        />
      </div>
      <div className={styles.btnRow}>
        <button className="win-btn" onClick={handleSubmit}>BOOT UP</button>
      </div>
    </Modal>
  );
}
