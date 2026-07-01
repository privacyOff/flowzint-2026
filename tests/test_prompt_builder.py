from app.analytics_summary import AnalyticsSummary
from app.services.gap_ranking import (
    GapPriority,
    GapSeverity,
    KnowledgeGap,
)
from app.services.insights import (
    InsightsInput,
    _build_context,
    _build_prompt,
)
from app.services.support_health import (
    HealthCategory,
    HealthDrivers,
    SupportHealthScore,
)


def make_input():
    return InsightsInput(
        support_health=SupportHealthScore(
            score=89,
            category=HealthCategory.HEALTHY,
            drivers=HealthDrivers(
                retrieval_quality=0.8,
                verification_quality=0.8,
                resolution_quality=0.9,
                escalation_management=0.9,
            ),
            summary="Support quality is healthy.",
        ),
        analytics_summary=AnalyticsSummary(
            total_interactions=150,
            top_questions=[],
            top_failures=[
                "Password reset",
            ],
            average_retrieval_score=0.82,
            support_health=SupportHealthScore(
                score=89,
                category=HealthCategory.HEALTHY,
                drivers=HealthDrivers(
                    retrieval_quality=0.8,
                    verification_quality=0.8,
                    resolution_quality=0.9,
                    escalation_management=0.9,
                ),
                summary="Support quality is healthy.",
            ),
        ),
        knowledge_gaps=[
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
    )


def test_build_context():
    context = _build_context(
        make_input()
    )

    assert (
        context["support_health"]["score"]
        == 89
    )

    assert (
        len(context["knowledge_gaps"])
        == 2
    )


def test_build_prompt():
    prompt = _build_prompt(
        _build_context(
            make_input()
        )
    )

    assert "executive_summary" in prompt
    assert "recommendations" in prompt
    assert "documentation_suggestions" in prompt


def test_prompt_contains_business_values():
    prompt = _build_prompt(
        _build_context(
            make_input()
        )
    )

    assert "password reset" in prompt
    assert "HEALTHY" in prompt
    assert "89" in prompt