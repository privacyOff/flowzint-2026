from __future__ import annotations

from dataclasses import dataclass

from app.analytics_summary import AnalyticsSummary
from app.services.gap_ranking import KnowledgeGap
from app.services.support_health import SupportHealthScore


@dataclass(frozen=True)
class InsightsInput:
    support_health: SupportHealthScore
    analytics_summary: AnalyticsSummary
    knowledge_gaps: list[KnowledgeGap]


@dataclass(frozen=True)
class InsightItem:
    title: str
    reason: str
    topic: str | None = None


@dataclass(frozen=True)
class Insights:
    executive_summary: str
    risks: list[InsightItem]
    recommendations: list[InsightItem]
    documentation_suggestions: list[InsightItem]


def _empty_insights() -> Insights:
    return Insights(
        executive_summary="Insights unavailable.",
        risks=[],
        recommendations=[],
        documentation_suggestions=[],
    )


def _parse_items(
    items: list[dict],
) -> list[InsightItem]:
    return [
        InsightItem(
            title=item["title"],
            reason=item["reason"],
            topic=item.get("topic"),
        )
        for item in items
    ]


def _parse_response(
    data: dict,
) -> Insights:
    try:
        return Insights(
            executive_summary=data["executive_summary"],
            risks=_parse_items(data["risks"]),
            recommendations=_parse_items(
                data["recommendations"]
            ),
            documentation_suggestions=_parse_items(
                data["documentation_suggestions"]
            ),
        )
    except (
        KeyError,
        TypeError,
    ):
        return _empty_insights()