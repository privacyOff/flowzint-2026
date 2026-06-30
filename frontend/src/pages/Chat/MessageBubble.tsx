import ReactMarkdown from "react-markdown";
import type { Message } from "../../types/chat";
import { Avatar } from "../../components/ui/Avatar";
import { Button } from "../../components/ui/Button";
import { ConfidenceBadge } from "../../components/badges/ConfidenceBadge";
import { IntentBadge } from "../../components/badges/IntentBadge";
import { HandoffCard } from "../../components/chat/HandoffCard";
import { SourceList } from "../../components/chat/SourceList";
import { TicketDraftCard } from "../../components/chat/TicketDraftCard";

type Props = { message: Message; onRegenerate?: () => void; };

export function MessageBubble({ message, onRegenerate }: Props) {
  const isUser = message.role === "user";
  const isError = message.role === "error";
  const copy = () => void navigator.clipboard?.writeText(message.content);
  return (
    <article className={`group flex gap-3 ${isUser ? "justify-end" : "justify-start"}`} aria-label={`${message.role} message`}>
      {!isUser ? <Avatar initials={isError ? "!" : "AI"} size="sm" online={!isError} /> : null}
      <div className={`max-w-[min(86%,760px)] rounded-2xl border px-4 py-3 shadow-lg ${isUser ? "border-violet-400/40 bg-violet-600/80 text-white" : isError ? "border-rose-400/40 bg-rose-950/40" : "border-white/10 bg-white/[0.06]"}`}>
        <div className="prose prose-invert prose-sm max-w-none text-sm leading-6">
          {isUser ? <p className="whitespace-pre-wrap">{message.content}</p> : <ReactMarkdown>{message.content + (message.streaming ? " ▌" : "")}</ReactMarkdown>}
        </div>
        {!isUser && !isError ? <div className="mt-3 flex flex-wrap gap-2">{message.confidence ? <ConfidenceBadge value={message.confidence === "HIGH" ? 92 : message.confidence === "MEDIUM" ? 76 : 55} /> : null}{message.intent ? <IntentBadge intent={message.intent} /> : null}</div> : null}
        {!isUser && message.sources ? <SourceList sources={message.sources} /> : null}
        {!isUser && message.handoff ? <HandoffCard handoff={message.handoff} /> : null}
        {!isUser && message.ticketDraft ? <TicketDraftCard ticketDraft={message.ticketDraft} /> : null}
        <div className="mt-3 flex items-center justify-between gap-3 text-xs text-[var(--color-text-muted)]"><time>{message.timestamp ? new Date(message.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "Now"}</time>{!isUser ? <div className="flex gap-1 opacity-0 transition group-hover:opacity-100"><Button size="xs" variant="ghost" onClick={copy}>Copy</Button><Button size="xs" variant="ghost" onClick={onRegenerate}>Regenerate</Button><Button size="xs" variant="ghost" aria-label="Helpful">👍</Button><Button size="xs" variant="ghost" aria-label="Not helpful">👎</Button></div> : null}</div>
      </div>
      {isUser ? <Avatar initials="AV" size="sm" /> : null}
    </article>
  );
}
