import { useState } from 'react';
import { addMonths, subMonths } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';

import { Transaction, ModalType } from './types';
import { useTransactions } from './hooks/useTransactions';
import { useFutureBalance } from './hooks/useFutureBalance';

import CalendarGrid from './components/Calendar/CalendarGrid';
import Taskbar from './components/Taskbar/Taskbar';
import UpcomingPanel from './components/Upcoming/UpcomingPanel';
import SettingsDrawer from './components/Settings/SettingsDrawer';
import InitModal from './components/Modals/InitModal';
import ResyncModal from './components/Modals/ResyncModal';
import AddTransactionModal from './components/Modals/AddTransactionModal';
import DayDetailModal from './components/Modals/DayDetailModal';

import {
  loadBalance,
  saveBalance,
  isInitialized,
  setInitialized,
  saveTransactions,
} from './utils/localStorage';
import { todayStr } from './utils/dateHelpers';

function makeDate(year: number, month: number, day: number): string {
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

function buildDemoTransactions(): Omit<Transaction, 'id'>[] {
  const today = new Date();
  const y = today.getFullYear();
  const m = today.getMonth() + 1;
  const nextM = m === 12 ? 1 : m + 1;
  const nextY = m === 12 ? y + 1 : y;

  return [
    {
      name: 'Paycheck',
      amount: 1200,
      type: 'recurring',
      recurrence: 'biweekly',
      category: 'income',
      icon: '💰',
      date: todayStr(),
    },
    {
      name: 'Rent',
      amount: -950,
      type: 'recurring',
      recurrence: 'monthly',
      category: 'bill',
      icon: '🏠',
      date: makeDate(nextY, nextM, 1),
    },
    {
      name: 'Electric',
      amount: -85,
      type: 'recurring',
      recurrence: 'monthly',
      category: 'bill',
      icon: '⚡',
      date: makeDate(nextY, nextM, 15),
    },
    {
      name: 'Phone',
      amount: -45,
      type: 'recurring',
      recurrence: 'monthly',
      category: 'bill',
      icon: '📱',
      date: makeDate(nextY, nextM, 22),
    },
  ];
}

export default function App() {
  const [initialized, setInitializedState] = useState(() => isInitialized());
  const [currentBalance, setCurrentBalance] = useState(() => loadBalance());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [activeModal, setActiveModal] = useState<ModalType>(initialized ? null : 'init');
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  const { transactions, setTransactions, addTransaction, updateTransaction, deleteTransaction } = useTransactions();
  const { futureBalances, lowestBalance } = useFutureBalance(currentBalance, transactions);

  function handleInit(balance: number) {
    saveBalance(balance);
    setCurrentBalance(balance);

    // Preload demo transactions
    const demo = buildDemoTransactions().map(d => ({ id: uuidv4(), ...d }));
    setTransactions(demo);
    saveTransactions(demo);

    setInitialized();
    setInitializedState(true);
    setActiveModal(null);
  }

  function handleResync(balance: number) {
    saveBalance(balance);
    setCurrentBalance(balance);
    setActiveModal(null);
  }

  function handleSaveTransaction(data: Omit<Transaction, 'id'>) {
    if (editingTransaction) {
      updateTransaction(editingTransaction.id, data);
      setEditingTransaction(null);
    } else {
      addTransaction(data);
    }
    setActiveModal(null);
  }

  function handleEditTransaction(tx: Transaction) {
    setEditingTransaction(tx);
    setActiveModal('add');
    setSettingsOpen(false);
  }

  function handleDayClick(dateStr: string) {
    setSelectedDay(dateStr);
    setActiveModal('day');
  }

  function handleCloseModal() {
    setActiveModal(null);
    setSelectedDay(null);
    setEditingTransaction(null);
  }

  function handleSettingsBalanceChange(b: number) {
    setCurrentBalance(b);
  }

  return (
    <div className="desktop">
      <CalendarGrid
        currentMonth={currentMonth}
        futureBalances={futureBalances}
        currentBalance={currentBalance}
        lowestBalance={lowestBalance}
        onPrevMonth={() => setCurrentMonth(m => subMonths(m, 1))}
        onNextMonth={() => setCurrentMonth(m => addMonths(m, 1))}
        onDayClick={handleDayClick}
        onResync={() => setActiveModal('resync')}
        onAdd={() => { setEditingTransaction(null); setActiveModal('add'); }}
        onSettings={() => setSettingsOpen(s => !s)}
      />

      <UpcomingPanel futureBalances={futureBalances} />

      <Taskbar />

      {settingsOpen && (
        <SettingsDrawer
          currentBalance={currentBalance}
          transactions={transactions}
          onBalanceChange={handleSettingsBalanceChange}
          onEdit={handleEditTransaction}
          onDelete={deleteTransaction}
          onClose={() => setSettingsOpen(false)}
        />
      )}

      {activeModal === 'init' && (
        <InitModal onConfirm={handleInit} />
      )}

      {activeModal === 'resync' && (
        <ResyncModal
          currentBalance={currentBalance}
          onConfirm={handleResync}
          onClose={handleCloseModal}
        />
      )}

      {activeModal === 'add' && (
        <AddTransactionModal
          editing={editingTransaction}
          onSave={handleSaveTransaction}
          onClose={handleCloseModal}
        />
      )}

      {activeModal === 'day' && selectedDay && futureBalances[selectedDay] && (
        <DayDetailModal
          dateStr={selectedDay}
          dayData={futureBalances[selectedDay]}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}
