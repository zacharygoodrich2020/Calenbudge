import { useMemo, useState } from 'react';

type Account = { id: string; name: string; balance: number };
type TransactionType = 'income' | 'expense' | 'transfer';
type Transaction = {
  id: string;
  name: string;
  amount: number;
  date: string;
  type: TransactionType;
  accountId: string;
};

type ProjectionPoint = { date: string; balance: number; label: string; transactionId: string };

function computeProjection(accounts: Account[], transactions: Transaction[]): ProjectionPoint[] {
  const startingBalance = accounts.reduce((sum, a) => sum + a.balance, 0);
  const sorted = [...transactions].sort((a, b) => a.date.localeCompare(b.date));

  let running = startingBalance;
  return sorted.map((tx) => {
    const signedAmount = tx.type === 'expense' ? -Math.abs(tx.amount) : Math.abs(tx.amount);
    running += signedAmount;
    return {
      transactionId: tx.id,
      date: tx.date,
      balance: running,
      label: `${tx.name} (${tx.type})`,
    };
  });
}

const today = new Date().toISOString().slice(0, 10);

export default function App() {
  const [accounts, setAccounts] = useState<Account[]>([
    { id: crypto.randomUUID(), name: 'Checking', balance: 2400 },
  ]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const [newAccountName, setNewAccountName] = useState('');
  const [newAccountBalance, setNewAccountBalance] = useState('0');

  const [form, setForm] = useState({
    name: '',
    amount: '0',
    date: today,
    type: 'expense' as TransactionType,
    accountId: accounts[0]?.id ?? '',
  });

  const projection = useMemo(() => computeProjection(accounts, transactions), [accounts, transactions]);
  const currentTotal = useMemo(() => accounts.reduce((sum, a) => sum + a.balance, 0), [accounts]);
  const lowestProjected = useMemo(
    () => projection.reduce((low, p) => Math.min(low, p.balance), currentTotal),
    [projection, currentTotal],
  );
  const safeToSpend = currentTotal - lowestProjected;

  const lowestPointId = useMemo(() => {
    if (projection.length === 0) return null;
    const min = projection.reduce((lowest, p) => (p.balance < lowest.balance ? p : lowest), projection[0]);
    return min.transactionId;
  }, [projection]);

  function addAccount() {
    const name = newAccountName.trim();
    if (!name) return;
    const balance = Number(newAccountBalance);
    if (Number.isNaN(balance)) return;

    const id = crypto.randomUUID();
    setAccounts((prev) => [...prev, { id, name, balance }]);
    setForm((prev) => ({ ...prev, accountId: prev.accountId || id }));
    setNewAccountName('');
    setNewAccountBalance('0');
  }

  function updateBalance(accountId: string, value: string) {
    const parsed = Number(value);
    setAccounts((prev) =>
      prev.map((a) => (a.id === accountId ? { ...a, balance: Number.isNaN(parsed) ? a.balance : parsed } : a)),
    );
  }

  function addTransaction() {
    if (!form.name.trim() || !form.accountId || !form.date) return;
    const amount = Number(form.amount);
    if (Number.isNaN(amount) || amount < 0) return;

    const tx: Transaction = {
      id: crypto.randomUUID(),
      name: form.name.trim(),
      amount,
      date: form.date,
      type: form.type,
      accountId: form.accountId,
    };
    setTransactions((prev) => [...prev, tx]);
    setForm((prev) => ({ ...prev, name: '', amount: '0' }));
  }

  return (
    <div className="min-h-screen bg-slate-950 p-4 md:p-8">
      <div className="mx-auto grid max-w-7xl gap-4 md:gap-6">
        <h1 className="text-2xl font-semibold tracking-tight text-cyan-300">Calenbudge Projection Dashboard</h1>

        <section className="grid gap-4 md:grid-cols-3">
          <Card title="Current Total" value={formatMoney(currentTotal)} />
          <Card title="Lowest Projected" value={formatMoney(lowestProjected)} danger={lowestProjected < 0} />
          <Card title="Safe to Spend" value={formatMoney(safeToSpend)} />
        </section>

        <div className="grid gap-4 lg:grid-cols-[320px_1fr]">
          <aside className="space-y-4">
            <Panel title="Accounts">
              <div className="space-y-2">
                {accounts.map((account) => (
                  <div key={account.id} className="rounded-md border border-slate-800 bg-slate-900/80 p-2">
                    <p className="text-sm text-slate-300">{account.name}</p>
                    <input
                      type="number"
                      value={account.balance}
                      onChange={(e) => updateBalance(account.id, e.target.value)}
                      className="mt-1 w-full rounded bg-slate-800 px-2 py-1 text-sm"
                    />
                  </div>
                ))}
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <input
                  placeholder="Account name"
                  value={newAccountName}
                  onChange={(e) => setNewAccountName(e.target.value)}
                  className="rounded bg-slate-800 px-2 py-1 text-sm"
                />
                <input
                  type="number"
                  value={newAccountBalance}
                  onChange={(e) => setNewAccountBalance(e.target.value)}
                  className="rounded bg-slate-800 px-2 py-1 text-sm"
                />
                <button onClick={addAccount} className="col-span-2 rounded bg-cyan-600 px-3 py-1.5 text-sm font-medium hover:bg-cyan-500">
                  Add Account
                </button>
              </div>
            </Panel>

            <Panel title="Add Transaction">
              <div className="grid gap-2">
                <input className="rounded bg-slate-800 px-2 py-1 text-sm" placeholder="Name" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} />
                <input className="rounded bg-slate-800 px-2 py-1 text-sm" type="number" value={form.amount} onChange={(e) => setForm((p) => ({ ...p, amount: e.target.value }))} />
                <input className="rounded bg-slate-800 px-2 py-1 text-sm" type="date" value={form.date} onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))} />
                <select className="rounded bg-slate-800 px-2 py-1 text-sm" value={form.type} onChange={(e) => setForm((p) => ({ ...p, type: e.target.value as TransactionType }))}>
                  <option value="income">Income</option>
                  <option value="expense">Expense</option>
                  <option value="transfer">Transfer</option>
                </select>
                <select className="rounded bg-slate-800 px-2 py-1 text-sm" value={form.accountId} onChange={(e) => setForm((p) => ({ ...p, accountId: e.target.value }))}>
                  {accounts.map((a) => (
                    <option key={a.id} value={a.id}>{a.name}</option>
                  ))}
                </select>
                <button onClick={addTransaction} className="rounded bg-cyan-600 px-3 py-1.5 text-sm font-medium hover:bg-cyan-500">Add Transaction</button>
              </div>
            </Panel>
          </aside>

          <main className="space-y-4">
            <Panel title="Timeline / Projection">
              <div className="space-y-2">
                {projection.length === 0 && <p className="text-sm text-slate-400">No transactions yet. Add one to project your future balance.</p>}
                {projection.map((point) => {
                  const isNegative = point.balance < 0;
                  const isLowest = point.transactionId === lowestPointId;
                  return (
                    <div
                      key={point.transactionId}
                      className={`grid grid-cols-[140px_1fr_auto] items-center gap-2 rounded-md border p-2 text-sm ${
                        isLowest
                          ? 'border-amber-500 bg-amber-500/10'
                          : isNegative
                            ? 'border-red-600 bg-red-950/50'
                            : 'border-slate-800 bg-slate-900/80'
                      }`}
                    >
                      <span className="text-slate-300">{point.date}</span>
                      <span>{point.label}</span>
                      <span className={isNegative ? 'font-semibold text-red-400' : 'font-semibold text-cyan-300'}>{formatMoney(point.balance)}</span>
                    </div>
                  );
                })}
              </div>
            </Panel>

            <Panel title="Transactions">
              <div className="space-y-2">
                {transactions.map((tx) => (
                  <div key={tx.id} className="grid grid-cols-[1fr_auto_auto] items-center gap-2 rounded border border-slate-800 bg-slate-900/80 p-2 text-sm">
                    <span>{tx.date} · {tx.name} · {tx.type}</span>
                    <span className="font-medium">{formatMoney(tx.amount)}</span>
                    <button className="rounded bg-slate-700 px-2 py-1 hover:bg-slate-600" onClick={() => setTransactions((prev) => prev.filter((t) => t.id !== tx.id))}>Delete</button>
                  </div>
                ))}
              </div>
            </Panel>
          </main>
        </div>
      </div>
    </div>
  );
}

function Card({ title, value, danger = false }: { title: string; value: string; danger?: boolean }) {
  return (
    <div className="rounded-lg border border-slate-800 bg-slate-900/80 p-4">
      <p className="text-xs uppercase tracking-wide text-slate-400">{title}</p>
      <p className={`mt-1 text-xl font-semibold ${danger ? 'text-red-400' : 'text-cyan-300'}`}>{value}</p>
    </div>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-lg border border-slate-800 bg-slate-900/50 p-4">
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-300">{title}</h2>
      {children}
    </section>
  );
}

function formatMoney(value: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
}
