# Calenbudge

## CashFlow OS (live app)

A standalone, no-backend cash flow calendar/planner — enter your balance and bills, see your projected balance up to 12 months out. All data stays in your browser's `localStorage`.

**Live:** https://zacharygoodrich2020.github.io/Calenbudge/

Source: [`cashflow-os/`](./cashflow-os). To run it locally:

```bash
cd cashflow-os
npm install
npm run dev
```

---

This repository also includes an earlier, separate prototype:
- A Python backend MVP (`app.py`)
- A React + TypeScript + Tailwind frontend dashboard (`frontend/`) for calendar-style balance projection

## Frontend features implemented
- Dark, minimalist dashboard layout
- Accounts panel (add account + inline balance editing)
- Transactions panel (add/delete transactions)
- Real projection engine that sorts by date and computes running balance
- Timeline view with negative balance highlighting and lowest-point highlighting
- Summary cards for current total, lowest projected, and safe-to-spend

## Frontend file structure

```text
frontend/
  index.html
  package.json
  postcss.config.js
  tailwind.config.js
  tsconfig.json
  vite.config.ts
  src/
    App.tsx
    main.tsx
    styles.css
```

## Run frontend

```bash
cd frontend
npm install
npm run dev
```

Vite will print a local URL (typically `http://localhost:5173`).

## Run backend

```bash
python app.py
```

Backend starts on `http://127.0.0.1:8000`.
