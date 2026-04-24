# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Run the server (starts on http://127.0.0.1:8000)
python app.py

# Run all tests
python -m pytest -q

# Run a single test
python -m pytest tests/test_logic.py::test_summary_and_affordability -q
```

There is no build step, no package manager beyond pip, and no linting toolchain configured.

## Architecture

This is a **single-file Python backend** (`app.py`) using only the stdlib (`http.server`, `sqlite3`, `json`). There is no framework, no ORM, and no frontend.

**Entry point**: `run_server()` at the bottom of `app.py` initializes the SQLite schema then starts `ThreadingHTTPServer` on port 8000.

**Request routing** is manual inside `Handler.do_GET`, `do_POST`, `do_PATCH`, and `do_PUT` — each method dispatches on `self.path` using `startswith`/`==` checks.

**Database**: SQLite file `calderbudget.db` (gitignored). Schema is created inline in `init_db()`. Five tables:
- `categories` — pre-seeded expense categories (Housing, Groceries, Dining, Transport, Income)
- `transactions` — income/expense records; `category_id` is nullable
- `monthly_budgets` — per-category limits; uses `ON CONFLICT … DO UPDATE` for upserts
- `agent_actions` — AI-proposed actions stored as JSON `payload`; status lifecycle: `proposed → approved/rejected → executed`
- `audit_events` — append-only log; every significant action writes here with actor, event_type, target_type/id, and JSON metadata

## Key Patterns

**Affordability scoring** (`affordability_check` function): purely deterministic — queries the DB for the month's net, applies fixed scoring rules (0–100), returns a verdict (`yes`/`maybe`/`no`) plus reasons. No LLM involved.

**Agent workflow**: the AI only *proposes* actions via `create_action()`; execution requires an explicit `POST /api/agent/actions/{id}/approve` call from the user. Only `budget_update` actions are actually executed; other types are rejected with a safe error.

**Chat parsing** (`/api/ai/chat`): naive substring matching (e.g., `"can i afford"`, `"set"` + `"budget"`). It is not connected to an LLM — complex or misspelled phrasing will fall through to a generic reply.

**Audit logging**: `log_event(actor, event_type, target_type, target_id, metadata)` is called for every mutation. `actor` is either `"user"` or `"ai"` (hardcoded — no auth).

## Tests

`tests/test_logic.py` calls `setup_module()` which wipes and reinitializes the DB before the suite runs. Tests import helper functions directly from `app` (e.g., `get_summary`, `create_action`). When adding tests, follow this pattern — test the pure logic functions, not the HTTP handler.

## Planned Next Steps (from README)

1. Lightweight frontend (Next.js or Vite)
2. Replace the chat parser with a real LLM using strict tool-calling
3. Auth + per-user data isolation
4. Deployment
