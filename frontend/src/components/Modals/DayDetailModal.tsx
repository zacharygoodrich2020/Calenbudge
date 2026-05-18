import Modal from './Modal';
import styles from './Modals.module.css';
import { DayData } from '../../types';
import { formatMoney, formatDate } from '../../utils/dateHelpers';

interface DayDetailModalProps {
  dateStr: string;
  dayData: DayData;
  onClose: () => void;
}

export default function DayDetailModal({ dateStr, dayData, onClose }: DayDetailModalProps) {
  const balClass = dayData.balance > 100 ? styles.balGreen : dayData.balance > 0 ? styles.balYellow : styles.balRed;

  return (
    <Modal title={formatDate(dateStr).toUpperCase()} onClose={onClose}>
      {dayData.transactions.length === 0 ? (
        <p style={{ fontFamily: 'IBM Plex Mono', fontSize: '13px', color: 'var(--win-text-dim)' }}>
          No transactions on this day.
        </p>
      ) : (
        dayData.transactions.map((tx, i) => (
          <div key={i} className={styles.txnItem}>
            <div>
              <span style={{ fontSize: '18px', marginRight: '8px' }}>{tx.icon}</span>
              <span className={styles.txnName}>{tx.name}</span>
            </div>
            <span className={`${styles.txnAmount} ${tx.amount > 0 ? styles.txnAmountPos : styles.txnAmountNeg}`}>
              {formatMoney(tx.amount)}
            </span>
          </div>
        ))
      )}
      <div className={`${styles.dayBalance} ${balClass}`}>
        BALANCE: {formatMoney(dayData.balance)}
      </div>
    </Modal>
  );
}
