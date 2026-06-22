import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, addMonths, subMonths } from 'date-fns';
import { FutureBalances } from '../../types';
import Window from '../Window/Window';
import DayCell from './DayCell';
import styles from './Calendar.module.css';
import { formatMoney, formatDateShort } from '../../utils/dateHelpers';

interface CalendarGridProps {
  currentMonth: Date;
  futureBalances: FutureBalances;
  currentBalance: number;
  lowestBalance: { amount: number; date: string } | null;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onDayClick: (dateStr: string) => void;
  onResync: () => void;
  onAdd: () => void;
  onSettings: () => void;
}

const DAY_HEADERS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function CalendarGrid({
  currentMonth,
  futureBalances,
  currentBalance,
  lowestBalance,
  onPrevMonth,
  onNextMonth,
  onDayClick,
  onResync,
  onAdd,
  onSettings,
}: CalendarGridProps) {
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const gridStart = startOfWeek(monthStart);
  const gridEnd = endOfWeek(monthEnd);
  const allDays = eachDayOfInterval({ start: gridStart, end: gridEnd });

  const monthLabel = format(currentMonth, 'MMMM yyyy').toUpperCase();

  const lowestColor = lowestBalance && lowestBalance.amount <= 0 ? 'var(--win-red)' : 'var(--win-yellow)';

  return (
    <Window title="CASHFLOW OS" className={styles.calendarWindow}>
      {/* Main header */}
      <div className={styles.mainHeader}>
        <div className={styles.balanceArea}>
          <span className={styles.currentBalance}>${Math.round(currentBalance).toLocaleString()}</span>
          {lowestBalance && (
            <div className={`${styles.lowestStat} ${lowestBalance.amount <= 0 ? styles.lowestStatDanger : ''}`}>
              <span className={styles.lowestLabel}>⚠ LOWEST 30D</span>
              <span className={styles.lowestAmount} style={{ color: lowestColor }}>
                {formatMoney(lowestBalance.amount)} · {formatDateShort(lowestBalance.date)}
              </span>
            </div>
          )}
        </div>
        <div className={styles.btnRow}>
          <button className="win-btn win-btn-accent2" onClick={onResync}>⚡ RESYNC</button>
          <button className="win-btn" onClick={onAdd}>+ ADD</button>
          <button className="win-btn" onClick={onSettings}>⚙</button>
        </div>
      </div>

      {/* Month navigation */}
      <div className={styles.header}>
        <div className={styles.monthNav}>
          <button className="win-btn" onClick={onPrevMonth}>◀</button>
          <span className={styles.monthTitle}>{monthLabel}</span>
          <button className="win-btn" onClick={onNextMonth}>▶</button>
        </div>
      </div>

      {/* Day headers */}
      <div className={styles.grid}>
        {DAY_HEADERS.map(d => (
          <div key={d} className={styles.dayHeader}>{d}</div>
        ))}

        {/* Day cells */}
        {allDays.map(day => {
          const dateStr = format(day, 'yyyy-MM-dd');
          const isCurrentMonth = day.getMonth() === currentMonth.getMonth();

          if (!isCurrentMonth) {
            return <div key={dateStr} className={`${styles.dayCell} ${styles.dayCellEmpty}`} />;
          }

          return (
            <DayCell
              key={dateStr}
              dateStr={dateStr}
              dayData={futureBalances[dateStr]}
              onClick={() => onDayClick(dateStr)}
            />
          );
        })}
      </div>
    </Window>
  );
}
