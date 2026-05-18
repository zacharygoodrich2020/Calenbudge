import { parseISO, format, addDays, getDaysInMonth, startOfDay, differenceInDays } from 'date-fns';
import { Transaction, DayData, FutureBalances } from '../types';

export function getFutureBalances(
  startBalance: number,
  transactions: Transaction[],
  startDate: Date,
  endDate: Date
): FutureBalances {
  const result: FutureBalances = {};
  let runningBalance = startBalance;
  let current = startOfDay(startDate);
  const end = startOfDay(endDate);

  while (current <= end) {
    const dateStr = format(current, 'yyyy-MM-dd');
    const dayTxns: Transaction[] = [];

    for (const tx of transactions) {
      const anchor = startOfDay(parseISO(tx.date));

      if (tx.type === 'one-time') {
        if (dateStr === tx.date) dayTxns.push(tx);
      } else {
        switch (tx.recurrence) {
          case 'weekly':
            if (current >= anchor && current.getDay() === anchor.getDay()) dayTxns.push(tx);
            break;
          case 'biweekly':
            if (current >= anchor && differenceInDays(current, anchor) % 14 === 0) dayTxns.push(tx);
            break;
          case 'monthly': {
            const anchorDay = anchor.getDate();
            const daysInMonth = getDaysInMonth(current);
            const effectiveDay = Math.min(anchorDay, daysInMonth);
            if (current >= anchor && current.getDate() === effectiveDay) dayTxns.push(tx);
            break;
          }
          case 'yearly':
            if (current >= anchor && current.getMonth() === anchor.getMonth() && current.getDate() === anchor.getDate()) dayTxns.push(tx);
            break;
        }
      }
    }

    // Income first, then expenses
    dayTxns.sort((a, b) => (b.amount > 0 ? 1 : 0) - (a.amount > 0 ? 1 : 0));

    for (const tx of dayTxns) runningBalance += tx.amount;

    result[dateStr] = { balance: runningBalance, transactions: dayTxns };
    current = addDays(current, 1);
  }

  return result;
}

export function getLowestBalance(balances: FutureBalances, fromDate: Date, days = 30): { amount: number; date: string } | null {
  let lowest: { amount: number; date: string } | null = null;
  const start = startOfDay(fromDate);

  for (let i = 0; i < days; i++) {
    const d = addDays(start, i);
    const key = format(d, 'yyyy-MM-dd');
    const data = balances[key];
    if (!data) continue;
    if (lowest === null || data.balance < lowest.amount) {
      lowest = { amount: data.balance, date: key };
    }
  }
  return lowest;
}
