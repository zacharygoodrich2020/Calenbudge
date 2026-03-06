# CalderBudget AI Clone — Ship-Today Plan

## Goal
Deliver a usable MVP **today** with:
1. Core budgeting data model and CRUD
2. AI chat that can answer grounded finance questions
3. Safe agent actions behind explicit approval
4. "Can I afford X?" decision endpoint

---

## 0) Product scope for today (must-have only)

### In scope
- User auth (single-user local/dev acceptable for day 1)
- Accounts, transactions, categories, monthly budgets
- Read-only dashboard totals (income/spend/cash left)
- Chat endpoint with tool-calling for data lookups
- Affordability check API + chat intent
- Agent proposal workflow for edits (propose + approve + execute)

### Out of scope (defer)
- Bank integrations
- Advanced forecasting ML
- Mobile app
- Multi-tenant organization complexity

---

## 1) Architecture (fastest path)

- **Frontend**: Next.js app with 3 screens
  - Dashboard
  - Transactions
  - AI Copilot panel
- **Backend**: Next.js API routes (or single service) for speed
- **DB**: Postgres + Prisma
- **AI**: LLM with strict tool-calling (no direct DB writes from model)
- **Queue**: skip today (run synchronously)

---

## 2) Data model to implement now

- `User`
- `Account`
- `Category`
- `Transaction`
- `MonthlyBudget`
- `AgentAction`
- `AuditEvent`

### AgentAction states
- `proposed`
- `approved`
- `executed`
- `failed`
- `reverted`

---

## 3) API contracts (day-1 set)

### Core finance
- `GET /api/summary?month=YYYY-MM`
- `GET /api/transactions`
- `POST /api/transactions`
- `PATCH /api/transactions/:id`
- `GET /api/budgets?month=YYYY-MM`
- `PUT /api/budgets/:categoryId?month=YYYY-MM`

### AI + agent
- `POST /api/ai/chat`
- `POST /api/ai/affordability-check`
- `GET /api/agent/actions`
- `POST /api/agent/actions/:id/approve`
- `POST /api/agent/actions/:id/reject`

---

## 4) Tool layer for the LLM (strict)

Read-only tools:
- `get_summary(month)`
- `get_category_spend(category, month)`
- `get_upcoming_bills(days)`
- `simulate_purchase(amount, date, recurring)`

Write-proposal tools (never execute directly):
- `propose_recategorize(transactionIds, categoryId)`
- `propose_budget_update(categoryId, month, limit)`

Execution rule:
- LLM may create **proposals only**.
- Server executes proposal only after explicit approval endpoint call.

---

## 5) "Can I afford X?" logic (deterministic)

### Inputs
- purchase amount
- date / cadence (one-time or recurring)
- current balance
- projected inflow/outflow before purchase date
- committed bills + minimum savings floor

### Decision
- **Yes**: projected post-purchase balance >= safety floor and monthly surplus remains positive
- **Maybe**: balance remains positive but safety floor violated or surplus near zero
- **No**: projected negative balance or missed obligations

### Response shape
- `verdict`: `yes|maybe|no`
- `score`: 0–100
- `reasons[]`
- `assumptions[]`
- `alternatives[]`

---

## 6) UI delivery checklist (today)

- Dashboard cards:
  - Income this month
  - Spend this month
  - Remaining budget
- Transaction list with category edit
- Copilot drawer:
  - Chat stream
  - "Can I afford" quick form
  - Proposed actions panel with Approve/Reject

---

## 7) Same-day execution timeline

### Hour 1–2
- Scaffold app, Prisma schema, DB migration, seed data

### Hour 3–4
- Build transactions + budgets endpoints
- Build summary calculations

### Hour 5
- Build chat endpoint + tool router

### Hour 6
- Implement affordability endpoint + chat intent wiring

### Hour 7
- Implement agent proposal/approval flow + audit events

### Hour 8
- Hook UI to endpoints, basic polish, smoke test, deploy

---

## 8) Acceptance criteria for "done today"

- Can add/edit transactions and set monthly budgets
- Chat can answer spend questions grounded in DB data
- "Can I afford X?" returns deterministic verdict with rationale
- AI can propose edits; user can approve; system applies and logs audit
- App deployed and demoable

---

## 9) Risks + quick mitigations

- **Risk**: LLM hallucinated numbers
  - **Mitigation**: all numeric answers require tool output references
- **Risk**: Unsafe automatic edits
  - **Mitigation**: proposal-only + explicit approval endpoints
- **Risk**: Scope creep
  - **Mitigation**: enforce out-of-scope list for day 1

---

## 10) Immediate next steps (start now)

1. Initialize Next.js + Prisma + Postgres compose
2. Implement schema and migrations
3. Stand up finance endpoints and summary logic
4. Add AI chat with read tools
5. Add affordability endpoint
6. Add proposal approval workflow
7. Smoke test and deploy
