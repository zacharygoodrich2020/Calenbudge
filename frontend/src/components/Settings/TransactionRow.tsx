import { useState } from 'react';
import { Transaction } from '../../types';
import { formatMoney, getNextOccurrence, formatDateShort } from '../../utils/dateHelpers';

interface TransactionRowProps {
  transaction: Transaction;
  onEdit: () => void;
  onDelete: () => void;
}

export default function TransactionRow({ transaction: tx, onEdit, onDelete }: TransactionRowProps) {
  const [confirming, setConfirming] = useState(false);

  const nextOcc = getNextOccurrence(tx);
  const badgeColor = tx.amount > 0 ? 'var(--win-green)' : 'var(--win-red)';

  const rowStyle: React.CSSProperties = {
    padding: '8px',
    background: 'rgba(0,0,0,0.3)',
    borderTop: '1px solid #ffffff',
    borderLeft: '1px solid #ffffff',
    borderBottom: '1px solid #1a1a3a',
    borderRight: '1px solid #1a1a3a',
    outline: '1px solid rgba(90,90,255,0.3)',
    fontFamily: 'IBM Plex Mono, monospace',
  };

  if (confirming) {
    return (
      <div style={rowStyle}>
        <p style={{ fontSize: '11px', color: 'var(--win-text)', marginBottom: '8px', fontFamily: 'Press Start 2P, monospace', lineHeight: 1.6 }}>
          DELETE {tx.name.toUpperCase()}?
        </p>
        <div style={{ display: 'flex', gap: '6px' }}>
          <button
            className="win-btn win-btn-danger"
            onClick={() => { onDelete(); setConfirming(false); }}
          >YES</button>
          <button className="win-btn" onClick={() => setConfirming(false)}>NO</button>
        </div>
      </div>
    );
  }

  return (
    <div style={rowStyle}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
        <span style={{ fontSize: '13px' }}>{tx.icon} {tx.name}</span>
        <span style={{ fontSize: '16px', fontFamily: 'VT323, monospace', color: badgeColor }}>
          {formatMoney(tx.amount)}
        </span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '10px', color: 'var(--win-text-dim)' }}>
          {tx.type === 'recurring' ? `↻ ${tx.recurrence}` : 'one-time'}
          {nextOcc ? ` · next ${formatDateShort(nextOcc)}` : ''}
        </span>
        <div style={{ display: 'flex', gap: '4px' }}>
          <button className="win-btn" style={{ fontSize: '7px', padding: '4px 8px' }} onClick={onEdit}>EDIT</button>
          <button className="win-btn" style={{ fontSize: '7px', padding: '4px 8px', color: 'var(--win-danger)', outlineColor: 'var(--win-danger)' }} onClick={() => setConfirming(true)}>DEL</button>
        </div>
      </div>
    </div>
  );
}
