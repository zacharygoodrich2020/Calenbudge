import json
from pathlib import Path

from app import DB_PATH, affordability_check, create_action, get_conn, get_summary, init_db


def setup_module() -> None:
    if Path(DB_PATH).exists():
        Path(DB_PATH).unlink()
    init_db()


def test_summary_and_affordability() -> None:
    conn = get_conn()
    conn.execute("INSERT INTO transactions(amount,type,merchant,happened_on) VALUES (?,?,?,?)", (5000, "income", "Employer", "2026-03-05"))
    conn.execute("INSERT INTO transactions(amount,type,merchant,happened_on) VALUES (?,?,?,?)", (2000, "expense", "Rent", "2026-03-02"))
    conn.commit()
    conn.close()

    summary = get_summary("2026-03")
    assert summary["net"] == 3000

    result = affordability_check(1200, "2026-03")
    assert result["verdict"] in {"yes", "maybe", "no"}


def test_agent_budget_proposal_recorded() -> None:
    conn = get_conn()
    dining_id = conn.execute("SELECT id FROM categories WHERE name='Dining'").fetchone()[0]
    conn.close()

    action_id = create_action("budget_update", {"category_id": dining_id, "month": "2026-03", "limit_amount": 400})
    conn = get_conn()
    action = conn.execute("SELECT * FROM agent_actions WHERE id=?", (action_id,)).fetchone()
    conn.close()
    assert action["status"] == "proposed"
    payload = json.loads(action["payload"])
    assert payload["limit_amount"] == 400
