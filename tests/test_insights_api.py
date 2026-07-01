from fastapi.testclient import TestClient

from app.main import app
from app.services.insights import (
    InsightItem,
    Insights,
)

client = TestClient(app)


def test_executive_insights_endpoint(
    monkeypatch,
):
    monkeypatch.setattr(
        "app.main.get_executive_insights",
        lambda: Insights(
            executive_summary=(
                "Support operations are healthy."
            ),
            risks=[
                InsightItem(
                    title="Password reset",
                    reason=(
                        "High unanswered rate."
                    ),
                    topic="password reset",
                )
            ],
            recommendations=[],
            documentation_suggestions=[],
        ),
    )

    response = client.get(
        "/executive-insights"
    )

    assert response.status_code == 200

    assert response.json() == {
        "executive_summary": (
            "Support operations are healthy."
        ),
        "risks": [
            {
                "title": "Password reset",
                "reason": (
                    "High unanswered rate."
                ),
                "topic": "password reset",
            }
        ],
        "recommendations": [],
        "documentation_suggestions": [],
    }


def test_executive_insights_full_payload(
    monkeypatch,
):
    monkeypatch.setattr(
        "app.main.get_executive_insights",
        lambda: Insights(
            executive_summary="Support operations are healthy.",
            risks=[
                InsightItem(
                    title="Password reset",
                    reason="High unanswered rate.",
                    topic="password reset",
                )
            ],
            recommendations=[
                InsightItem(
                    title="Expand documentation",
                    reason="Low evidence.",
                    topic="password reset",
                )
            ],
            documentation_suggestions=[],
        ),
    )

    response = client.get(
        "/executive-insights"
    )

    assert response.status_code == 200

    body = response.json()

    assert body["executive_summary"] == (
        "Support operations are healthy."
    )

    assert len(body["risks"]) == 1
    assert len(body["recommendations"]) == 1
    assert body["recommendations"][0]["topic"] == (
        "password reset"
    )