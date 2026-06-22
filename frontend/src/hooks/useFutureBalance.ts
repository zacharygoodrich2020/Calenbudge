import { useMemo } from 'react';
import { addMonths, startOfDay } from 'date-fns';
import { Transaction, FutureBalances } from '../types';
import { getFutureBalances, getLowestBalance } from '../utils/balanceEngine';

export function useFutureBalance(balance: number, transactions: Transaction[]) {
  const futureBalances = useMemo<FutureBalances>(() => {
    const start = startOfDay(new Date());
    const end = addMonths(start, 12);
    return getFutureBalances(balance, transactions, start, end);
  }, [balance, transactions]);

  const lowestBalance = useMemo(() => getLowestBalance(futureBalances, new Date(), 30), [futureBalances]);

  return { futureBalances, lowestBalance };
}
