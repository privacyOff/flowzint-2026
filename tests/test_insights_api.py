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