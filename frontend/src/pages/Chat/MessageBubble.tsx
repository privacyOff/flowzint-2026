import ReactMarkdown from "react-markdown";
import type { Message } from "../../types/chat";
import { Avatar } from "../../components/ui/Avatar";
import { Button } from "../../components/ui/Button";
import { ConfidenceBadge } from "../../components/badges/ConfidenceBadge";
import { IntentBadge } from "../../components/badges/IntentBadge";
import { DebugInspector } from "../../components/chat/DebugInspector";
import { HandoffCard } from "../../components/chat/HandoffCard";
import { SourceList } from "../../components/chat/SourceList";
import { TicketDraftCard } from "../../components/chat/TicketDraftCard";

type Props = { message: Message; onRegenerate?: () => void; };

function confidenceValue(confidence: Message["confidence"]) {
  if (confidence === "HIGH") return 92;
  if (confidence === "MEDIUM") return 76;
  if (confidence === "LOW") return 55;
  return undefined;
}

export function MessageBubble({ message, onRegenerate }: Props) {
  const isUser = message.role === "user";
  const isError = message.role === "error";
  const copy = () => void navigator.clipboard?.writeText(message.content);
  const confidence = confidenceValue(message.confidence);
  const showEscalation = Boolean(message.escalationTarget || message.handoff);

  return (
    <article className={`group flex gap-3 ${isUser ? "justify-end" : "justify-start"}`} aria-label={`${message.role} message`}>
      {!isUser ? <Avatar initials={isError ? "!" : "AI"} size="sm" online={!isError} /> : null}
      <div className={`w-fit max-w-[min(92%,800px)] rounded-3xl border px-4 py-3 shadow-xl backdrop-blur-xl ${isUser ? "border-violet-400/40 bg-violet-600/90 text-white shadow-violet-950/30" : isError ? "border-rose-400/40 bg-rose-950/40" : "border-white/10 bg-white/[0.07] shadow-black/20"}`}>
        <div className="prose prose-invert prose-sm max-w-none text-sm leading-6 prose-a:text-violet-200 prose-code:rounded prose-code:bg-black/30 prose-code:px-1 prose-pre:border prose-pre:border-white/10 prose-pre:bg-black/30 prose-table:block prose-table:overflow-x-auto">
          {isUser ? <p className="whitespace-pre-wrap">{message.content}</p> : <ReactMarkdown>{message.content + (message.streaming ? " ▌" : "")}</ReactMarkdown>}
        </div>

        {!isUser && !isError ? (
          <div className="mt-4 rounded-2xl border border-white/10 bg-black/15 p-3" aria-label="Response metadata">
            <div className="flex flex-wrap gap-2">
              {message.intent ? <IntentBadge intent={message.intent} /> : null}
              {showEscalation ? <span className="rounded-full border border-amber-400/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-200">Escalation: {message.escalationTarget ?? message.handoff?.recommended_team ?? message.handoff?.contact}</span> : null}
              {confidence ? <ConfidenceBadge value={confidence} /> : null}
            </div>
          </div>
        ) : null}

        {!isUser && message.sources ? <SourceList sources={message.sources} /> : null}
        {!isUser && message.debug ? <DebugInspector debug={message.debug} /> : null}
        {!isUser && message.ticketDraft ? <TicketDraftCard ticketDraft={message.ticketDraft} /> : null}
        {!isUser && message.handoff ? <HandoffCard handoff={message.handoff} /> : null}

        <div className="mt-3 flex items-center justify-between gap-3 text-xs text-[var(--color-text-muted)]">
          <time>{message.timestamp ? new Date(message.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "Now"}</time>
          {!isUser ? <div className="flex flex-wrap gap-1 opacity-0 transition group-hover:opacity-100 group-focus-within:opacity-100"><Button size="xs" variant="ghost" onClick={copy}>Copy</Button><Button size="xs" variant="ghost" onClick={onRegenerate}>Regenerate</Button><Button size="xs" variant="ghost" aria-label="Helpful">👍</Button><Button size="xs" variant="ghost" aria-label="Not helpful">👎</Button></div> : null}
        </div>
      </div>
      {isUser ? <Avatar initials="AV" size="sm" /> : null}
    </article>
  );
}
