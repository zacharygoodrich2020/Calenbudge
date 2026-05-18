export interface Transaction {
  id: string;
  name: string;
  amount: number; // positive = income, negative = expense
  type: 'one-time' | 'recurring';
  date: string; // YYYY-MM-DD
  recurrence: null | 'weekly' | 'biweekly' | 'monthly' | 'yearly';
  category: 'income' | 'bill' | 'expense' | 'savings';
  icon: string;
}

export interface DayData {
  balance: number;
  transactions: Transaction[];
}

export type FutureBalances = Record<string, DayData>;

export type ModalType = 'init' | 'add' | 'day' | 'resync' | null;
