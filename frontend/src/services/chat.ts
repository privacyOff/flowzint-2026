import { getChatSessions, getInitialChatState, getMockChatResponse, suggestedPrompts } from "../pages/Chat/selectors";

export async function fetchChatSessions() {
  return getChatSessions();
}

export async function fetchInitialConversation(sessionId?: string) {
  return getInitialChatState(sessionId);
}

export async function sendMockChatMessage(prompt: string, sessionId: string) {
  await new Promise((resolve) => setTimeout(resolve, 250));
  return getMockChatResponse(prompt, sessionId);
}

export function getSuggestedPrompts() {
  return suggestedPrompts;
}
