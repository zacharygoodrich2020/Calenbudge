import {
  addDays,
  differenceInDays,
  format,
  getDate,
  getDay,
  getMonth,
  isAfter,
  isBefore,
  isSameDay,
  lastDayOfMonth,
  parseISO,
  startOfDay,
} from 'date-fns'

/**
 * Determines whether a transaction fires on the given date.
 * Monthly recurrence clamps the anchor day to the last day of short months
 * (e.g. anchor 31st in February fires on the 28th/29th).
 */
export function transactionOccursOnDate(txn, date) {
  const anchor = startOfDay(parseISO(txn.date))
  const day = startOfDay(date)

  if (txn.type === 'one-time') {
    return isSameDay(day, anchor)
  }

  if (isBefore(day, anchor)) return false

  switch (txn.recurrence) {
    case 'weekly':
      return getDay(day) === getDay(anchor)
    case 'biweekly':
      return differenceInDays(day, anchor) % 14 === 0
    case 'monthly': {
      const anchorDay = getDate(anchor)
      const fireDay = Math.min(anchorDay, getDate(lastDayOfMonth(day)))
      return getDate(day) === fireDay
    }
    case 'yearly':
      return getDate(day) === getDate(anchor) && getMonth(day) === getMonth(anchor)
    default:
      return false
  }
}

/**
 * Returns { 'YYYY-MM-DD': { balance, transactions } } for every day from
 * startDate through endDate (inclusive), applying income before expenses
 * on days with same-day collisions.
 */
export function getFutureBalances(startBalance, transactions, startDate, endDate) {
  const result = {}
  let runningBalance = startBalance
  let current = startOfDay(startDate)
  const end = startOfDay(endDate)

  while (!isAfter(current, end)) {
    const dateKey = format(current, 'yyyy-MM-dd')
    const dayTxns = transactions
      .filter((txn) => transactionOccursOnDate(txn, current))
      .sort((a, b) => (a.amount > 0 ? 0 : 1) - (b.amount > 0 ? 0 : 1))

    for (const txn of dayTxns) {
      runningBalance += txn.amount
    }

    result[dateKey] = { balance: runningBalance, transactions: dayTxns }
    current = addDays(current, 1)
  }

  return result
}

/** Finds the next date (inclusive of fromDate) a transaction fires, searching up to a year out. */
export function getNextOccurrence(txn, fromDate) {
  let current = startOfDay(fromDate)
  const limit = addDays(current, 366)

  while (!isAfter(current, limit)) {
    if (transactionOccursOnDate(txn, current)) return current
    current = addDays(current, 1)
  }

  return null
}
