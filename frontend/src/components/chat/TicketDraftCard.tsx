import type { TicketDraft } from "../../types/chat";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { PriorityBadge } from "../badges/PriorityBadge";

export function TicketDraftCard({ ticketDraft }: { ticketDraft: TicketDraft }) {
  const copy = () => void navigator.clipboard?.writeText(`${ticketDraft.title}\n\n${ticketDraft.summary}`);
  return (
    <Card title="Ticket Draft" variant="glass" className="mt-3 p-4" actions={<div className="flex gap-2"><Button size="xs" variant="ghost" onClick={copy}>Copy</Button><Button size="xs" variant="ghost">Download</Button></div>}>
      <div className="space-y-2 text-xs text-[var(--color-text-muted)]">
        <div className="flex items-center justify-between gap-3"><strong className="text-[var(--color-text)]">{ticketDraft.ticket_id ?? "Draft"}</strong><PriorityBadge priority={ticketDraft.priority ?? "medium"} /></div>
        <p><strong>Summary:</strong> {ticketDraft.summary}</p>
        <p><strong>Category:</strong> {ticketDraft.category ?? ticketDraft.intent}</p>
        <p><strong>Suggested owner:</strong> {ticketDraft.suggested_owner ?? ticketDraft.escalation_target}</p>
        <p><strong>Escalation reason:</strong> {ticketDraft.conversation_summary}</p>
      </div>
    </Card>
  );
}
