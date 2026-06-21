import Window from '../Window/Window'
import Header from '../Header/Header'
import CalendarNav from '../Calendar/CalendarNav'
import CalendarGrid from '../Calendar/CalendarGrid'
import styles from './MainWindow.module.css'

export default function MainWindow({
  balance,
  lowestBalance,
  currentMonth,
  setCurrentMonth,
  futureBalances,
  onResync,
  onAdd,
  onSettings,
  onDayClick,
}) {
  return (
    <Window title="CASHFLOW OS" className={styles.window}>
      <Header
        balance={balance}
        lowestBalance={lowestBalance}
        onResync={onResync}
        onAdd={onAdd}
        onSettings={onSettings}
      />
      <CalendarNav currentMonth={currentMonth} setCurrentMonth={setCurrentMonth} />
      <CalendarGrid
        currentMonth={currentMonth}
        futureBalances={futureBalances}
        onDayClick={onDayClick}
      />
    </Window>
  )
}
