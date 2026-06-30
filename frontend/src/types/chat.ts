export type Source = {
  id: number;
  source: string;
  document?: string;
  snippet: string;
  score: number;
  relevanceScore?: number;
  confidenceScore?: number;
};

export type DebugChunk = {
  source: string;
  score: number;
  snippet: string;
};

export type DebugInfo = {
  retrieved_chunks: DebugChunk[];
  top_score: number;
  handoff_reason: string | null;
  prompt_context_preview: string;
  confidence?: number;
  intent?: string;
  retrieval_score?: number;
  token_usage?: number;
  latency_ms?: number;
};

export type Handoff = {
  ticket_id: string;
  reason: string;
  contact: string;
  recommended_team?: string;
  suggested_action?: string;
  priority?: string;
  status?: string;
};

export type TicketDraft = {
  title: string;
  summary: string;
  intent: string;
  escalation_target: string;
  conversation_summary: string;
  ticket_id?: string;
  priority?: string;
  category?: string;
  suggested_owner?: string;
};

export type ConfidenceLevel = "HIGH" | "MEDIUM" | "LOW";

export type ChatResponse = {
  answer: string;
  sources: Source[];
  intent: string;
  confidence: ConfidenceLevel;
  escalation_target: string;
  debug: DebugInfo;
  handoff: Handoff | null;
  ticket_draft: TicketDraft | null;
};

export type IntentCount = { intent: string; count: number; };
export type FailedQuery = { question: string; retrieval_score: number; timestamp: string; };
export type AnalyticsResponse = { total_chats: number; handoff_rate: number; avg_retrieval_score: number; top_intents: IntentCount[]; failed_queries: FailedQuery[]; };

export type Message = {
  id: string;
  role: "user" | "assistant" | "system" | "error";
  content: string;
  timestamp?: string;
  streaming?: boolean;
  intent?: string;
  confidence?: ConfidenceLevel;
  escalationTarget?: string;
  debug?: DebugInfo;
  sources?: Source[];
  handoff?: Handoff | null;
  ticketDraft?: TicketDraft | null;
};
