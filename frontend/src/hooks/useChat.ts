import { useCallback, useEffect, useMemo, useState } from "react";
import { fetchChatSessions, fetchInitialConversation, sendMockChatMessage } from "../services/chat";
import type { Message } from "../types/chat";
import type { SupportSession } from "../utils/mock/sessions";

function makeId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function useChat() {
  const [sessions, setSessions] = useState<SupportSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    async function load() {
      const nextSessions = await fetchChatSessions();
      const initial = await fetchInitialConversation(nextSessions[0]?.sessionId);
      if (!alive) return;
      setSessions(nextSessions);
      setActiveSessionId(initial.activeSessionId);
      setMessages(initial.messages);
      setLoading(false);
    }
    void load();
    return () => { alive = false; };
  }, []);

  const activeSession = useMemo(() => sessions.find((session) => session.sessionId === activeSessionId) ?? sessions[0], [activeSessionId, sessions]);

  const selectSession = useCallback(async (sessionId: string) => {
    setLoading(true);
    setError(null);
    const initial = await fetchInitialConversation(sessionId);
    setActiveSessionId(initial.activeSessionId);
    setMessages(initial.messages);
    setLoading(false);
  }, []);

  const sendMessage = useCallback(async (content: string) => {
    const trimmed = content.trim();
    if (!trimmed || !activeSessionId || streaming) return;
    setError(null);
    const userMessage: Message = { id: makeId("user"), role: "user", content: trimmed, timestamp: new Date().toISOString() };
    const assistantId = makeId("assistant");
    setMessages((prev) => [...prev, userMessage, { id: assistantId, role: "assistant", content: "", timestamp: new Date().toISOString(), streaming: true }]);
    setStreaming(true);

    try {
      const response = await sendMockChatMessage(trimmed, activeSessionId);
      const words = response.answer.split(/(\s+)/);
      let current = "";
      for (const word of words) {
        current += word;
        setMessages((prev) => prev.map((message) => message.id === assistantId ? { ...message, content: current } : message));
        await new Promise((resolve) => setTimeout(resolve, 28));
      }
      setMessages((prev) => prev.map((message) => message.id === assistantId ? {
        ...message,
        content: response.answer,
        streaming: false,
        intent: response.intent,
        confidence: response.confidence,
        escalationTarget: response.escalation_target,
        sources: response.sources,
        debug: response.debug,
        handoff: response.handoff,
        ticketDraft: response.ticket_draft,
      } : message));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to generate a mock response.");
      setMessages((prev) => prev.map((message) => message.id === assistantId ? { ...message, role: "error", content: "The assistant could not generate a response.", streaming: false } : message));
    } finally {
      setStreaming(false);
    }
  }, [activeSessionId, streaming]);

  const regenerateLast = useCallback(() => {
    const lastUser = [...messages].reverse().find((message) => message.role === "user");
    if (lastUser) void sendMessage(lastUser.content);
  }, [messages, sendMessage]);

  return { sessions, activeSession, activeSessionId, messages, loading, streaming, error, selectSession, sendMessage, regenerateLast };
}
