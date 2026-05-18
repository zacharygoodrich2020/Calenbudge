import { format, parseISO, addDays, addMonths, addWeeks, addYears } from 'date-fns';

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, 'MMM d, yyyy');
}

export function formatDateShort(date: Date | string): string {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, 'MMM d');
}

export function formatMoney(amount: number): string {
  const abs = Math.abs(amount);
  const formatted = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(abs);
  return amount < 0 ? `-${formatted}` : formatted;
}

export function todayStr(): string {
  return format(new Date(), 'yyyy-MM-dd');
}

export function getNextOccurrence(tx: { date: string; type: string; recurrence: string | null }): string | null {
  if (tx.type === 'one-time') return tx.date;
  const anchor = parseISO(tx.date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (!tx.recurrence) return tx.date;

  let next = anchor;
  while (next < today) {
    switch (tx.recurrence) {
      case 'weekly': next = addWeeks(next, 1); break;
      case 'biweekly': next = addDays(next, 14); break;
      case 'monthly': next = addMonths(next, 1); break;
      case 'yearly': next = addYears(next, 1); break;
      default: return null;
    }
  }
  return format(next, 'yyyy-MM-dd');
}
