from __future__ import annotations

import json
import sqlite3
from datetime import datetime
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from typing import Any
from urllib.parse import parse_qs, urlparse

DB_PATH = Path("calderbudget.db")


def get_conn() -> sqlite3.Connection:
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db() -> None:
    conn = get_conn()
    cur = conn.cursor()
    cur.executescript(
        """
        CREATE TABLE IF NOT EXISTS categories (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL UNIQUE
        );
        CREATE TABLE IF NOT EXISTS transactions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            amount REAL NOT NULL,
            type TEXT NOT NULL CHECK(type IN ('income', 'expense')),
            merchant TEXT,
            category_id INTEGER,
            happened_on TEXT NOT NULL,
            notes TEXT
        );
        CREATE TABLE IF NOT EXISTS monthly_budgets (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            month TEXT NOT NULL,
            category_id INTEGER NOT NULL,
            limit_amount REAL NOT NULL,
            UNIQUE(month, category_id)
        );
        CREATE TABLE IF NOT EXISTS agent_actions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            action_type TEXT NOT NULL,
            payload TEXT NOT NULL,
            status TEXT NOT NULL,
            created_at TEXT NOT NULL
        );
        CREATE TABLE IF NOT EXISTS audit_events (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            actor TEXT NOT NULL,
            event_type TEXT NOT NULL,
            target_type TEXT NOT NULL,
            target_id INTEGER,
            metadata TEXT,
            created_at TEXT NOT NULL
        );
        """
    )
    if cur.execute("SELECT COUNT(*) FROM categories").fetchone()[0] == 0:
        cur.executemany(
            "INSERT INTO categories(name) VALUES (?)",
            [("Housing",), ("Groceries",), ("Dining",), ("Transport",), ("Income",)],
        )
    conn.commit()
    conn.close()


def month_bounds(month: str) -> tuple[str, str]:
    year, mm = [int(x) for x in month.split("-")]
    if mm == 12:
        ny, nm = year + 1, 1
    else:
        ny, nm = year, mm + 1
    return f"{year:04d}-{mm:02d}-01", f"{ny:04d}-{nm:02d}-01"


def get_summary(month: str) -> dict[str, Any]:
    start, end = month_bounds(month)
    conn = get_conn()
    income = conn.execute(
        "SELECT COALESCE(SUM(amount),0) FROM transactions WHERE type='income' AND happened_on>=? AND happened_on<?",
        (start, end),
    ).fetchone()[0]
    expense = conn.execute(
        "SELECT COALESCE(SUM(amount),0) FROM transactions WHERE type='expense' AND happened_on>=? AND happened_on<?",
        (start, end),
    ).fetchone()[0]
    budget_total = conn.execute("SELECT COALESCE(SUM(limit_amount),0) FROM monthly_budgets WHERE month=?", (month,)).fetchone()[0]
    conn.close()
    return {
        "month": month,
        "income": income,
        "expense": expense,
        "net": income - expense,
        "budget_total": budget_total,
        "remaining_budget": budget_total - expense,
    }


def affordability_check(amount: float, month: str, recurring: bool = False, savings_floor: float = 500) -> dict[str, Any]:
    summary = get_summary(month)
    projected_after = summary["net"] - amount
    score = 100
    reasons, alternatives = [], []
    if projected_after < 0:
        score -= 70
        reasons.append("Purchase would make monthly net negative.")
        alternatives.append("Delay to next month or split cost.")
    if projected_after < savings_floor:
        score -= 25
        reasons.append("Purchase dips below your safety floor.")
        alternatives.append("Trim discretionary categories first.")
    if recurring:
        score -= 10
        reasons.append("Recurring commitment lowers future flexibility.")
    score = max(0, min(score, 100))
    verdict = "yes" if score >= 70 else "maybe" if score >= 45 else "no"
    return {
        "verdict": verdict,
        "score": score,
        "reasons": reasons or ["Fits current surplus and safety floor."],
        "assumptions": [f"Month analyzed: {month}", f"Safety floor: {savings_floor}"],
        "alternatives": alternatives,
    }


def log_event(actor: str, event_type: str, target_type: str, target_id: int | None, metadata: dict[str, Any]) -> None:
    conn = get_conn()
    conn.execute(
        "INSERT INTO audit_events(actor,event_type,target_type,target_id,metadata,created_at) VALUES (?,?,?,?,?,?)",
        (actor, event_type, target_type, target_id, json.dumps(metadata), datetime.utcnow().isoformat()),
    )
    conn.commit()
    conn.close()


def create_action(action_type: str, payload: dict[str, Any]) -> int:
    conn = get_conn()
    cur = conn.cursor()
    cur.execute(
        "INSERT INTO agent_actions(action_type,payload,status,created_at) VALUES (?,?,?,?)",
        (action_type, json.dumps(payload), "proposed", datetime.utcnow().isoformat()),
    )
    action_id = cur.lastrowid
    conn.commit()
    conn.close()
    log_event("ai", "action_proposed", "agent_action", action_id, payload)
    return action_id


class Handler(BaseHTTPRequestHandler):
    def _json(self) -> dict[str, Any]:
        length = int(self.headers.get("Content-Length", "0"))
        if length == 0:
            return {}
        return json.loads(self.rfile.read(length).decode("utf-8"))

    def _send(self, status: int, payload: Any) -> None:
        body = json.dumps(payload).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self) -> None:  # noqa: N802
        parsed = urlparse(self.path)
        path = parsed.path
        q = parse_qs(parsed.query)

        if path == "/api/categories":
            conn = get_conn()
            rows = conn.execute("SELECT * FROM categories ORDER BY name").fetchall()
            conn.close()
            return self._send(200, [dict(r) for r in rows])

        if path == "/api/transactions":
            conn = get_conn()
            rows = conn.execute("SELECT * FROM transactions ORDER BY happened_on DESC, id DESC").fetchall()
            conn.close()
            return self._send(200, [dict(r) for r in rows])

        if path == "/api/budgets":
            month = q.get("month", [""])[0]
            conn = get_conn()
            rows = conn.execute("SELECT * FROM monthly_budgets WHERE month=?", (month,)).fetchall()
            conn.close()
            return self._send(200, [dict(r) for r in rows])

        if path == "/api/summary":
            month = q.get("month", [""])[0]
            return self._send(200, get_summary(month))

        if path == "/api/agent/actions":
            conn = get_conn()
            rows = conn.execute("SELECT * FROM agent_actions ORDER BY id DESC").fetchall()
            conn.close()
            actions = [dict(r) | {"payload": json.loads(r["payload"])} for r in rows]
            return self._send(200, actions)

        return self._send(404, {"error": "Not found"})

    def do_POST(self) -> None:  # noqa: N802
        parsed = urlparse(self.path)
        path = parsed.path
        body = self._json()

        if path == "/api/transactions":
            conn = get_conn()
            cur = conn.cursor()
            cur.execute(
                "INSERT INTO transactions(amount,type,merchant,category_id,happened_on,notes) VALUES (?,?,?,?,?,?)",
                (
                    body["amount"],
                    body["type"],
                    body.get("merchant"),
                    body.get("category_id"),
                    body["happened_on"],
                    body.get("notes"),
                ),
            )
            tx_id = cur.lastrowid
            conn.commit()
            row = conn.execute("SELECT * FROM transactions WHERE id=?", (tx_id,)).fetchone()
            conn.close()
            log_event("user", "transaction_created", "transaction", tx_id, {"amount": body["amount"]})
            return self._send(201, dict(row))

        if path == "/api/ai/affordability-check":
            return self._send(
                200,
                affordability_check(
                    float(body["amount"]),
                    body["month"],
                    bool(body.get("recurring", False)),
                    float(body.get("savings_floor", 500)),
                ),
            )

        if path == "/api/ai/chat":
            message = body.get("message", "").lower()
            month = body.get("month")
            if "can i afford" in message:
                amount = next((float(t.replace("$", "")) for t in message.split() if t.replace("$", "").replace(".", "", 1).isdigit()), 0)
                if amount <= 0:
                    return self._send(200, {"reply": "Include an amount like: can I afford 1200?"})
                result = affordability_check(amount, month)
                return self._send(200, {"reply": f"Verdict: {result['verdict']} ({result['score']})", "data": result})

            if "set dining budget" in message:
                amount = next((float(t.replace("$", "")) for t in message.split() if t.replace("$", "").replace(".", "", 1).isdigit()), 0)
                conn = get_conn()
                dining = conn.execute("SELECT id FROM categories WHERE lower(name)='dining'").fetchone()
                conn.close()
                if not dining or amount <= 0:
                    return self._send(200, {"reply": "Try: set dining budget to 400"})
                action_id = create_action("budget_update", {"category_id": dining["id"], "month": month, "limit_amount": amount})
                return self._send(200, {"reply": f"Proposed action #{action_id}. Approve to apply.", "action_id": action_id})

            summary = get_summary(month)
            return self._send(200, {"reply": f"Net for {month} is ${summary['net']:.2f}", "data": summary})

        if path.startswith("/api/agent/actions/") and path.endswith("/approve"):
            action_id = int(path.split("/")[4])
            conn = get_conn()
            action = conn.execute("SELECT * FROM agent_actions WHERE id=?", (action_id,)).fetchone()
            if not action:
                conn.close()
                return self._send(404, {"error": "Action not found"})
            payload = json.loads(action["payload"])
            conn.execute("UPDATE agent_actions SET status='approved' WHERE id=?", (action_id,))
            if action["action_type"] == "budget_update":
                conn.execute(
                    "INSERT INTO monthly_budgets(month,category_id,limit_amount) VALUES (?,?,?) ON CONFLICT(month,category_id) DO UPDATE SET limit_amount=excluded.limit_amount",
                    (payload["month"], payload["category_id"], payload["limit_amount"]),
                )
                conn.execute("UPDATE agent_actions SET status='executed' WHERE id=?", (action_id,))
                conn.commit()
                conn.close()
                log_event("user", "action_approved", "agent_action", action_id, payload)
                return self._send(200, {"id": action_id, "status": "executed"})
            conn.execute("UPDATE agent_actions SET status='failed' WHERE id=?", (action_id,))
            conn.commit()
            conn.close()
            return self._send(400, {"error": "Unsupported action type"})

        if path.startswith("/api/agent/actions/") and path.endswith("/reject"):
            action_id = int(path.split("/")[4])
            conn = get_conn()
            conn.execute("UPDATE agent_actions SET status='rejected' WHERE id=?", (action_id,))
            conn.commit()
            conn.close()
            log_event("user", "action_rejected", "agent_action", action_id, {})
            return self._send(200, {"id": action_id, "status": "rejected"})

        return self._send(404, {"error": "Not found"})

    def do_PATCH(self) -> None:  # noqa: N802
        if not self.path.startswith("/api/transactions/"):
            return self._send(404, {"error": "Not found"})
        tx_id = int(self.path.split("/")[-1])
        body = self._json()
        conn = get_conn()
        found = conn.execute("SELECT id FROM transactions WHERE id=?", (tx_id,)).fetchone()
        if not found:
            conn.close()
            return self._send(404, {"error": "Transaction not found"})
        conn.execute("UPDATE transactions SET category_id=?, notes=? WHERE id=?", (body.get("category_id"), body.get("notes"), tx_id))
        conn.commit()
        row = conn.execute("SELECT * FROM transactions WHERE id=?", (tx_id,)).fetchone()
        conn.close()
        log_event("user", "transaction_updated", "transaction", tx_id, body)
        self._send(200, dict(row))

    def do_PUT(self) -> None:  # noqa: N802
        parsed = urlparse(self.path)
        if not parsed.path.startswith("/api/budgets/"):
            return self._send(404, {"error": "Not found"})
        category_id = int(parsed.path.split("/")[-1])
        month = parse_qs(parsed.query).get("month", [""])[0]
        body = self._json()
        conn = get_conn()
        conn.execute(
            "INSERT INTO monthly_budgets(month,category_id,limit_amount) VALUES (?,?,?) ON CONFLICT(month,category_id) DO UPDATE SET limit_amount=excluded.limit_amount",
            (month, category_id, body["limit_amount"]),
        )
        conn.commit()
        row = conn.execute("SELECT * FROM monthly_budgets WHERE month=? AND category_id=?", (month, category_id)).fetchone()
        conn.close()
        log_event("user", "budget_upserted", "monthly_budget", row["id"], {"month": month, "category_id": category_id})
        self._send(200, dict(row))


def run_server(host: str = "127.0.0.1", port: int = 8000) -> None:
    init_db()
    server = ThreadingHTTPServer((host, port), Handler)
    print(f"Serving on http://{host}:{port}")
    server.serve_forever()


if __name__ == "__main__":
    run_server()
