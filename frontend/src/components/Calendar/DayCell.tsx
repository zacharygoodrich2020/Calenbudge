import { parseISO, isToday, isBefore, startOfDay } from 'date-fns';
import { DayData } from '../../types';
import styles from './Calendar.module.css';

interface DayCellProps {
  dateStr: string;
  dayData: DayData | undefined;
  onClick: () => void;
}

function getBalanceClass(balance: number): string {
  if (balance > 100) return styles.balanceGreen;
  if (balance > 0) return styles.balanceYellow;
  return styles.balanceRed;
}

function formatMini(amount: number): string {
  const abs = Math.abs(amount);
  if (abs >= 1000) return `${amount < 0 ? '-' : ''}$${Math.round(abs / 100) / 10}k`;
  return `${amount < 0 ? '-' : ''}$${Math.round(abs)}`;
}

export default function DayCell({ dateStr, dayData, onClick }: DayCellProps) {
  const date = parseISO(dateStr);
  const today = startOfDay(new Date());
  const isPast = isBefore(startOfDay(date), today);
  const isTodayCell = isToday(date);
  const dayNum = date.getDate();

  const cellClass = [
    styles.dayCell,
    isPast ? styles.dayCellPast : '',
    isTodayCell ? styles.dayCellToday : '',
  ].filter(Boolean).join(' ');

  const hasIncome = dayData?.transactions.some(t => t.amount > 0);
  const hasExpense = dayData?.transactions.some(t => t.amount < 0);

  return (
    <div
      className={cellClass}
      onClick={isPast ? undefined : onClick}
      role={isPast ? undefined : 'button'}
      tabIndex={isPast ? undefined : 0}
      onKeyDown={isPast ? undefined : (e) => e.key === 'Enter' && onClick()}
    >
      {isTodayCell && <span className={styles.todayBar} />}
      <span className={styles.dayNum}>{dayNum}</span>
      {dayData && (
        <>
          <span className={`${styles.dayBalance} ${getBalanceClass(dayData.balance)}`}>
            {formatMini(dayData.balance)}
          </span>
          <div className={styles.dayIcons}>
            {hasIncome && <span>💰</span>}
            {hasExpense && <span>💸</span>}
          </div>
        </>
      )}
    </div>
  );
}
