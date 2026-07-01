from app.analytics_summary import AnalyticsSummary
from app.services.gap_ranking import (
    GapPriority,
    GapSeverity,
    KnowledgeGap,
)
from app.services.insights import generate_insights
from app.services.support_health import (
    HealthCategory,
    HealthDrivers,
    SupportHealthScore,
)


def make_input():
    health = SupportHealthScore(
        score=89,
        category=HealthCategory.HEALTHY,
        drivers=HealthDrivers(
            retrieval_quality=0.8,
            verification_quality=0.8,
            resolution_quality=0.9,
            escalation_management=0.9,
        ),
        summary="Support quality is healthy.",
    )

    return {
        "support_health": health,
        "analytics_summary": AnalyticsSummary(
            total_interactions=150,
            top_questions=[],
            top_failures=[
                "Password reset",
            ],
            average_retrieval_score=0.82,
            support_health=health,
        ),
        "knowledge_gaps": [
            KnowledgeGap(
                topic="password reset",
                frequency=12,
                average_retrieval_score=0.61,
                priority=GapPriority.HIGH,
                severity=GapSeverity.CRITICAL,
                missing_documentation=True,
            ),
            KnowledgeGap(
                topic="refund",
                frequency=4,
                average_retrieval_score=0.74,
                priority=GapPriority.MEDIUM,
                severity=GapSeverity.MAJOR,
                missing_documentation=False,
            ),
        ],
    }


def test_generate_insights_success():
    data = make_input()

    def fake_client(_: str) -> str:
        return """
        {
            "executive_summary": "Overall support is healthy.",
            "risks": [],
            "recommendations": [
                {
                    "title": "Improve documentation",
                    "reason": "Increase knowledge coverage."
                }
            ],
            "documentation_suggestions": []
        }
        """

    result = generate_insights(
        insights_input=data,
        client=fake_client,
    )

    assert result.executive_summary == "Overall support is healthy."
    assert len(result.recommendations) == 1
    assert result.risks == []


def test_generate_insights_invalid_json():
    data = make_input()

    def fake_client(_: str) -> str:
        return "not json"

    result = generate_insights(
        insights_input=data,
        client=fake_client,
    )

    assert result.executive_summary == "Insights unavailable."
    assert result.risks == []
    assert result.recommendations == []
    assert result.documentation_suggestions == []


def test_generate_insights_api_exception():
    data = make_input()

    def fake_client(_: str) -> str:
        raise RuntimeError("Gemini unavailable")

    result = generate_insights(
        insights_input=data,
        client=fake_client,
    )

    assert result.executive_summary == "Insights unavailable."
    assert result.risks == []
    assert result.recommendations == []
    assert result.documentation_suggestions == []


def test_generate_insights_missing_fields():
    data = make_input()

    def fake_client(_: str) -> str:
        return """
        {
            "executive_summary": "Healthy"
        }
        """

    result = generate_insights(
        insights_input=data,
        client=fake_client,
    )

    assert result.executive_summary == "Insights unavailable."
    assert result.risks == []
    assert result.recommendations == []
    assert result.documentation_suggestions == []