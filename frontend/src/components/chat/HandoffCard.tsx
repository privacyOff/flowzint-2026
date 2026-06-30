import type { Handoff } from "../../types/chat";
import { StatusBadge } from "../badges/StatusBadge";
import { PriorityBadge } from "../badges/PriorityBadge";
import { Card } from "../ui/Card";

export function HandoffCard({ handoff }: { handoff: Handoff }) {
  return (
    <Card title="Handoff Recommendation" variant="glass" className="mt-3 p-4">
      <div className="grid gap-3 text-xs text-[var(--color-text-muted)] sm:grid-cols-2">
        <span>Ticket: <strong className="text-[var(--color-text)]">{handoff.ticket_id}</strong></span>
        <span>Team: <strong className="text-[var(--color-text)]">{handoff.recommended_team ?? handoff.contact}</strong></span>
        <span>Reason: {handoff.reason}</span>
        <span>Action: {handoff.suggested_action ?? "Review with support specialist."}</span>
      </div>
      <div className="mt-3 flex gap-2"><PriorityBadge priority={handoff.priority ?? "medium"} /><StatusBadge status={handoff.status ?? "Escalated"} /></div>
    </Card>
  );
}
