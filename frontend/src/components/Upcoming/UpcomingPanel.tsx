import { useMemo } from 'react';
import { format, addDays, startOfDay } from 'date-fns';
import { Transaction, FutureBalances } from '../../types';
import Window from '../Window/Window';
import styles from './Upcoming.module.css';
import { formatMoney, formatDateShort } from '../../utils/dateHelpers';

interface UpcomingPanelProps {
  futureBalances: FutureBalances;
}

interface UpcomingItem {
  date: string;
  transaction: Transaction;
  balanceAfter: number;
}

export default function UpcomingPanel({ futureBalances }: UpcomingPanelProps) {
  const items = useMemo<UpcomingItem[]>(() => {
    const result: UpcomingItem[] = [];
    const today = startOfDay(new Date());

    for (let i = 0; i < 365 && result.length < 7; i++) {
      const d = addDays(today, i);
      const key = format(d, 'yyyy-MM-dd');
      const data = futureBalances[key];
      if (!data || data.transactions.length === 0) continue;

      for (const tx of data.transactions) {
        if (result.length >= 7) break;
        result.push({ date: key, transaction: tx, balanceAfter: data.balance });
      }
    }

    return result;
  }, [futureBalances]);

  return (
    <Window title="UPCOMING — NEXT 7 TRANSACTIONS" className={styles.panel}>
      <div className={styles.list}>
        {items.length === 0 && (
          <p className={styles.empty}>No upcoming transactions. Add some to get started.</p>
        )}
        {items.map((item, i) => {
          const tx = item.transaction;
          const balClass = item.balanceAfter > 100 ? styles.balGreen : item.balanceAfter > 0 ? styles.balYellow : styles.balRed;
          return (
            <div key={i} className={styles.item}>
              <span className={styles.icon}>{tx.icon}</span>
              <div className={styles.info}>
                <div className={styles.name}>{tx.name}</div>
                <div className={styles.date}>{formatDateShort(item.date)}</div>
              </div>
              <span className={`${styles.amount} ${tx.amount > 0 ? styles.amountPos : styles.amountNeg}`}>
                {formatMoney(tx.amount)}
              </span>
              <span className={`${styles.afterBalance} ${balClass}`}>
                {formatMoney(item.balanceAfter)}
              </span>
            </div>
          );
        })}
      </div>
    </Window>
  );
}
