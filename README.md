# CalderBudget AI Clone — Working MVP (today)

I converted the plan into a **runnable backend MVP** using Python stdlib + SQLite so you can ship same-day without waiting on heavy setup.

## Included now
- Finance APIs: transactions, budgets, summary
- AI APIs: chat endpoint, affordability check
- Agent workflow: propose actions, approve/reject, execute budget update
- Audit events for key actions

## Run

```bash
python app.py
```

Server starts at `http://127.0.0.1:8000`.

## Example calls

```bash
curl -X POST http://127.0.0.1:8000/api/transactions \
  -H 'content-type: application/json' \
  -d '{"amount":5000,"type":"income","merchant":"Employer","happened_on":"2026-03-05"}'

curl 'http://127.0.0.1:8000/api/summary?month=2026-03'

curl -X POST http://127.0.0.1:8000/api/ai/affordability-check \
  -H 'content-type: application/json' \
  -d '{"amount":1200,"month":"2026-03"}'
```

## Test

```bash
python -m pytest -q
```

## Now what
1. Add a lightweight frontend (Next.js/Vite) that calls these endpoints.
2. Swap chat parser for your LLM provider with strict tool-calling.
3. Add auth + per-user data isolation.
4. Deploy for demo.
