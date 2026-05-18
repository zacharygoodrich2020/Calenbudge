import { Transaction } from '../types';

const KEYS = {
  BALANCE: 'cashflow_balance',
  TRANSACTIONS: 'cashflow_transactions',
  INITIALIZED: 'cashflow_initialized',
};

export function loadBalance(): number {
  const v = localStorage.getItem(KEYS.BALANCE);
  return v !== null ? parseFloat(v) : 0;
}

export function saveBalance(balance: number): void {
  localStorage.setItem(KEYS.BALANCE, String(balance));
}

export function loadTransactions(): Transaction[] {
  try {
    const v = localStorage.getItem(KEYS.TRANSACTIONS);
    return v ? JSON.parse(v) : [];
  } catch {
    return [];
  }
}

export function saveTransactions(txns: Transaction[]): void {
  localStorage.setItem(KEYS.TRANSACTIONS, JSON.stringify(txns));
}

export function isInitialized(): boolean {
  return localStorage.getItem(KEYS.INITIALIZED) === 'true';
}

export function setInitialized(): void {
  localStorage.setItem(KEYS.INITIALIZED, 'true');
}
