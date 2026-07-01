from app.analytics_summary import AnalyticsSummary
from app.services.gap_ranking import (
    GapPriority,
    GapSeverity,
    KnowledgeGap,
)
from app.services.insights import (
    Insights,
    InsightsInput,
    generate_insights,
    get_executive_insights,
)
from app.services.support_health import (
    HealthCategory,
    HealthDrivers,
    SupportHealthScore,
)


def _support_health() -> SupportHealthScore:
    return SupportHealthScore(
        score=91,
        category=HealthCategory.EXCELLENT,
        drivers=HealthDrivers(
            retrieval_quality=0.9,
            verification_quality=0.9,
            resolution_quality=1.0,
            escalation_management=1.0,
        ),
        summary="Support operations are healthy.",
    )


def _analytics_summary() -> AnalyticsSummary:
    return AnalyticsSummary(
        total_interactions=150,
        top_questions=["Password reset"],
        top_failures=["Password reset"],
        average_retrieval_score=0.82,
        support_health=_support_health(),
    )


def _knowledge_gaps() -> list[KnowledgeGap]:
    return [
        KnowledgeGap(
            topic="password reset",
            frequency=12,
            average_retrieval_score=0.55,
            priority=GapPriority.HIGH,
            severity=GapSeverity.CRITICAL,
            missing_documentation=True,
        )
    ]


def test_generate_insights_pipeline():
    def fake_client(_: str) -> str:
        return """
        {
          "executive_summary": "Support operations are healthy.",
          "risks": [],
          "recommendations": [
            {
              "title": "Expand password reset documentation",
              "reason": "Repeated low-evidence responses.",
              "topic": "password reset"
            }
          ],
          "documentation_suggestions": []
        }
        """

    insights = generate_insights(
        InsightsInput(
            support_health=_support_health(),
            analytics_summary=_analytics_summary(),
            knowledge_gaps=_knowledge_gaps(),
        ),
        client=fake_client,
    )

    assert (
        insights.executive_summary
        == "Support operations are healthy."
    )

    assert (
        insights.recommendations[0].topic
        == "password reset"
    )


def test_get_executive_insights_orchestration(
    monkeypatch,
):
    expected = Insights(
        executive_summary="Executive summary",
        risks=[],
        recommendations=[],
        documentation_suggestions=[],
    )

    monkeypatch.setattr(
        "app.services.insights.get_support_health",
        _support_health,
    )

    monkeypatch.setattr(
        "app.services.insights.get_analytics_summary",
        _analytics_summary,
    )

    monkeypatch.setattr(
        "app.services.insights.get_knowledge_gaps",
        _knowledge_gaps,
    )

    monkeypatch.setattr(
        "app.services.insights.generate_insights",
        lambda _: expected,
    )

    result = get_executive_insights()

    assert result is expected


def test_generate_insights_failure_returns_empty():
    def failing_client(_: str) -> str:
        raise RuntimeError("Gemini unavailable")

    result = generate_insights(
        InsightsInput(
            support_health=_support_health(),
            analytics_summary=_analytics_summary(),
            knowledge_gaps=_knowledge_gaps(),
        ),
        client=failing_client,
    )

    assert result.executive_summary == "Insights unavailable."
    assert result.risks == []
    assert result.recommendations == []
    assert result.documentation_suggestions == []