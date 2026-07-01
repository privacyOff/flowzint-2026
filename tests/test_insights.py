from app.services.insights import _parse_response


def test_parse_response():
    data = {
        "executive_summary": "Overall support is healthy.",
        "risks": [
            {
                "title": "Password reset failures",
                "reason": "High unanswered rate.",
                "topic": "password reset",
            }
        ],
        "recommendations": [
            {
                "title": "Improve documentation",
                "reason": "Increase coverage.",
            }
        ],
        "documentation_suggestions": [],
    }

    result = _parse_response(data)

    assert result.executive_summary == "Overall support is healthy."
    assert len(result.risks) == 1
    assert result.risks[0].topic == "password reset"


def test_parse_response_missing_field():
    result = _parse_response({})

    assert result.executive_summary == "Insights unavailable."
    assert result.risks == []


def test_parse_response_empty_lists():
    data = {
        "executive_summary": "Healthy",
        "risks": [],
        "recommendations": [],
        "documentation_suggestions": [],
    }

    result = _parse_response(data)

    assert result.risks == []
    assert result.recommendations == []
    assert result.documentation_suggestions == []


def test_topic_optional():
    data = {
        "executive_summary": "Healthy",
        "risks": [
            {
                "title": "Risk",
                "reason": "Reason",
            }
        ],
        "recommendations": [],
        "documentation_suggestions": [],
    }

    result = _parse_response(data)

    assert result.risks[0].topic is None