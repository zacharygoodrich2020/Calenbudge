import { useState } from 'react'
import MainWindow from './components/MainWindow/MainWindow'
import UpcomingPanel from './components/Upcoming/UpcomingPanel'
import Taskbar from './components/Taskbar/Taskbar'
import InitModal from './components/Modals/InitModal'
import ResyncModal from './components/Modals/ResyncModal'
import AddTransactionModal from './components/Modals/AddTransactionModal'
import DayDetailModal from './components/Modals/DayDetailModal'
import SettingsDrawer from './components/Settings/SettingsDrawer'
import { useTransactions } from './hooks/useTransactions'
import { useFutureBalance } from './hooks/useFutureBalance'
import { isInitialized, loadBalance, markInitialized, saveBalance } from './utils/localStorage'
import { getDemoTransactions } from './utils/demoData'

export default function App() {
  const [currentBalance, setCurrentBalance] = useState(loadBalance)
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [activeModal, setActiveModal] = useState(isInitialized() ? null : 'init')
  const [selectedDay, setSelectedDay] = useState(null)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState(null)

  const { transactions, setTransactions, addTransaction, updateTransaction, deleteTransaction } =
    useTransactions()
  const { futureBalances, lowestBalance } = useFutureBalance(currentBalance, transactions)

  function closeModal() {
    setActiveModal(null)
    setEditingTransaction(null)
  }

  function handleInit(balance) {
    setCurrentBalance(balance)
    saveBalance(balance)
    markInitialized()
    if (transactions.length === 0) {
      setTransactions(getDemoTransactions(new Date()))
    }
    setActiveModal(null)
  }

  function handleResync(balance) {
    setCurrentBalance(balance)
    saveBalance(balance)
    setActiveModal(null)
  }

  function handleAdjustBalance(balance) {
    setCurrentBalance(balance)
    saveBalance(balance)
  }

  function openAddModal() {
    setEditingTransaction(null)
    setActiveModal('add')
    setSettingsOpen(false)
  }

  function openEditModal(txn) {
    setEditingTransaction(txn)
    setActiveModal('add')
    setSettingsOpen(false)
  }

  function handleSaveTransaction(txnData) {
    if (editingTransaction) {
      updateTransaction(editingTransaction.id, txnData)
    } else {
      addTransaction(txnData)
    }
    closeModal()
  }

  function handleDayClick(dateKey) {
    setSelectedDay(dateKey)
    setActiveModal('day')
  }

  return (
    <div className="desktop scanlines">
      <MainWindow
        balance={currentBalance}
        lowestBalance={lowestBalance}
        currentMonth={currentMonth}
        setCurrentMonth={setCurrentMonth}
        futureBalances={futureBalances}
        onResync={() => setActiveModal('resync')}
        onAdd={openAddModal}
        onSettings={() => setSettingsOpen(true)}
        onDayClick={handleDayClick}
      />

      <UpcomingPanel currentBalance={currentBalance} futureBalances={futureBalances} />

      <Taskbar />

      {activeModal === 'init' && <InitModal onConfirm={handleInit} />}

      {activeModal === 'resync' && (
        <ResyncModal
          currentBalance={currentBalance}
          onConfirm={handleResync}
          onClose={() => setActiveModal(null)}
        />
      )}

      {activeModal === 'add' && (
        <AddTransactionModal
          initial={editingTransaction}
          onSave={handleSaveTransaction}
          onClose={closeModal}
        />
      )}

      {activeModal === 'day' && selectedDay && (
        <DayDetailModal
          dateKey={selectedDay}
          dayData={futureBalances[selectedDay]}
          onClose={() => setActiveModal(null)}
        />
      )}

      <SettingsDrawer
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        currentBalance={currentBalance}
        onAdjustBalance={handleAdjustBalance}
        transactions={transactions}
        onEdit={openEditModal}
        onDelete={deleteTransaction}
      />
    </div>
  )
}
