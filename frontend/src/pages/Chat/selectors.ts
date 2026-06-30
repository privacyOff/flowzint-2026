import { conversations } from "../../utils/mock/conversations";
import { sessions } from "../../utils/mock/sessions";
import type { ChatResponse, ConfidenceLevel, DebugInfo, Message, Source } from "../../types/chat";

function confidenceLevel(score: number): ConfidenceLevel {
  if (score >= 85) return "HIGH";
  if (score >= 70) return "MEDIUM";
  return "LOW";
}

function toSources(conversationIndex: number): Source[] {
  const conversation = conversations[conversationIndex % conversations.length];
  return conversation.sources.map((source, index) => ({
    id: index + 1,
    source: source.title,
    document: source.url.split("/").pop(),
    snippet: conversation.messages[1]?.content ?? conversation.resolution,
    score: Number((conversation.confidence / 100).toFixed(2)),
    relevanceScore: Math.max(72, conversation.confidence - 4),
    confidenceScore: conversation.confidence,
  }));
}

function toDebug(conversationIndex: number): DebugInfo {
  const conversation = conversations[conversationIndex % conversations.length];
  return {
    retrieved_chunks: toSources(conversationIndex).map((source) => ({ source: source.document ?? source.source, score: source.score, snippet: source.snippet })),
    top_score: conversation.confidence / 100,
    handoff_reason: conversation.escalation ? conversation.suggestedFollowUp : null,
    prompt_context_preview: `Intent: ${conversation.intent}\nAccount category: ${conversation.category}\nUse cited documentation and keep answer concise.`,
    confidence: conversation.confidence,
    intent: conversation.intent,
    retrieval_score: conversation.confidence / 100,
    token_usage: 740 + conversationIndex * 18,
    latency_ms: 420 + conversationIndex * 16,
  };
}

export function getChatSessions() {
  return sessions.slice(0, 18);
}

export function getInitialChatState(sessionId = sessions[0].sessionId) {
  const conversation = conversations.find((item) => item.sessionId === sessionId) ?? conversations[0];
  const index = conversations.indexOf(conversation);
  const messages: Message[] = conversation.messages.map((message) => ({
    id: message.id,
    role: message.role === "assistant" ? "assistant" : "user",
    content: message.content,
    timestamp: message.timestamp,
    confidence: message.role === "assistant" ? confidenceLevel(conversation.confidence) : undefined,
    intent: message.role === "assistant" ? conversation.intent : undefined,
    escalationTarget: conversation.escalation ? conversation.category : undefined,
    sources: message.role === "assistant" ? toSources(index) : undefined,
    debug: message.role === "assistant" ? toDebug(index) : undefined,
    handoff: message.role === "assistant" && conversation.escalation ? {
      ticket_id: `HD-${conversation.conversationId.slice(-5)}`,
      reason: conversation.suggestedFollowUp,
      contact: conversation.user,
      recommended_team: conversation.category,
      suggested_action: "Review account context and continue with a human specialist.",
      priority: conversation.confidence < 65 ? "critical" : "high",
      status: "Escalated",
    } : null,
    ticketDraft: message.role === "assistant" && conversation.escalation ? {
      ticket_id: `TCK-${conversation.conversationId.slice(-5)}`,
      title: `${conversation.intent} escalation for ${conversation.user}`,
      summary: conversation.resolution,
      intent: conversation.intent,
      escalation_target: conversation.category,
      conversation_summary: conversation.suggestedFollowUp,
      priority: conversation.confidence < 65 ? "critical" : "high",
      category: conversation.category,
      suggested_owner: conversation.assignedAgentId,
    } : null,
  }));
  return { activeSessionId: conversation.sessionId, messages };
}

export function getMockChatResponse(prompt: string, sessionId: string): ChatResponse {
  const index = Math.abs([...prompt + sessionId].reduce((sum, char) => sum + char.charCodeAt(0), 0)) % conversations.length;
  const conversation = conversations[index];
  const escalation = conversation.escalation || /overcharged|urgent|broken|failed|error|sso|scim/i.test(prompt);
  return {
    answer: `${conversation.messages[1]?.content ?? conversation.resolution}\n\nRecommended next step: ${conversation.suggestedFollowUp}`,
    sources: toSources(index),
    intent: conversation.intent,
    confidence: confidenceLevel(conversation.confidence),
    escalation_target: escalation ? conversation.category : "None",
    debug: toDebug(index),
    handoff: escalation ? {
      ticket_id: `HD-${Date.now().toString().slice(-6)}`,
      reason: conversation.suggestedFollowUp,
      contact: conversation.user,
      recommended_team: conversation.category,
      suggested_action: "Attach citations and route to the appropriate support queue.",
      priority: conversation.confidence < 72 ? "high" : "medium",
      status: "Ready for handoff",
    } : null,
    ticket_draft: escalation ? {
      ticket_id: `TCK-${Date.now().toString().slice(-6)}`,
      title: `${conversation.intent} support request`,
      summary: conversation.resolution,
      intent: conversation.intent,
      escalation_target: conversation.category,
      conversation_summary: prompt,
      priority: conversation.confidence < 72 ? "high" : "medium",
      category: conversation.category,
      suggested_owner: conversation.assignedAgentId,
    } : null,
  };
}

export const suggestedPrompts = [
  "How do I reset my password?",
  "How does SSO work?",
  "How do I configure webhooks?",
  "How do I migrate from the free plan?",
  "How do API rate limits work?",
  "How do I enable SCIM?",
];
