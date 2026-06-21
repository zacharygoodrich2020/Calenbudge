import { addMonths, format, setDate } from 'date-fns'
import { v4 as uuidv4 } from 'uuid'

/** Seeded once on first launch so the calendar isn't empty out of the box. */
export function getDemoTransactions(today) {
  const nextMonth = addMonths(today, 1)
  const todayKey = format(today, 'yyyy-MM-dd')
  const firstOfNextMonth = format(setDate(nextMonth, 1), 'yyyy-MM-dd')
  const fifteenthOfNextMonth = format(setDate(nextMonth, 15), 'yyyy-MM-dd')
  const twentySecondOfNextMonth = format(setDate(nextMonth, 22), 'yyyy-MM-dd')

  return [
    {
      id: uuidv4(),
      name: 'Paycheck',
      amount: 1200,
      type: 'recurring',
      recurrence: 'biweekly',
      category: 'income',
      icon: '💰',
      date: todayKey,
    },
    {
      id: uuidv4(),
      name: 'Rent',
      amount: -950,
      type: 'recurring',
      recurrence: 'monthly',
      category: 'bill',
      icon: '🏠',
      date: firstOfNextMonth,
    },
    {
      id: uuidv4(),
      name: 'Electric',
      amount: -85,
      type: 'recurring',
      recurrence: 'monthly',
      category: 'bill',
      icon: '⚡',
      date: fifteenthOfNextMonth,
    },
    {
      id: uuidv4(),
      name: 'Phone',
      amount: -45,
      type: 'recurring',
      recurrence: 'monthly',
      category: 'bill',
      icon: '📱',
      date: twentySecondOfNextMonth,
    },
  ]
}
