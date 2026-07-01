from __future__ import annotations

import json
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


def _build_context(
    insights_input: InsightsInput,
) -> dict:
    return {
        "support_health": {
            "score": (
                insights_input.support_health.score
            ),
            "category": (
                insights_input.support_health.category.value
            ),
            "summary": (
                insights_input.support_health.summary
            ),
        },
        "knowledge_gaps": [
            {
                "topic": gap.topic,
                "priority": gap.priority.value,
                "severity": gap.severity.value,
                "missing_documentation": (
                    gap.missing_documentation
                ),
                "frequency": gap.frequency,
            }
            for gap in insights_input.knowledge_gaps
        ],
        "analytics_summary": {
            "total_interactions": (
                insights_input.analytics_summary.total_interactions
            ),
            "average_retrieval_score": (
                insights_input.analytics_summary.average_retrieval_score
            ),
            "top_failures": (
                insights_input.analytics_summary.top_failures
            ),
        },
    }


def _build_prompt(
    context: dict,
) -> str:
    context_json = json.dumps(
        context,
        indent=2,
    )

    return f"""
You are an AI support operations consultant.

Analyze the provided support analytics.

Use only the supplied analytics.

Do not invent facts or metrics.

Keep recommendations actionable.

Return valid JSON only.

Support Analytics:

{context_json}

Return JSON in exactly this format:

{{
  "executive_summary": "...",

  "risks": [
    {{
      "title": "...",
      "reason": "...",
      "topic": "..."
    }}
  ],

  "recommendations": [
    {{
      "title": "...",
      "reason": "...",
      "topic": "..."
    }}
  ],

  "documentation_suggestions": [
    {{
      "title": "...",
      "reason": "...",
      "topic": "..."
    }}
  ]
}}
""".strip()