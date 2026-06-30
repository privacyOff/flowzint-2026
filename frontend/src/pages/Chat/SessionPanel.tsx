import { useMemo, useState } from "react";
import { Search } from "../../components/ui/Search";
import { StatusBadge } from "../../components/badges/StatusBadge";
import type { SupportSession } from "../../utils/mock/sessions";

export function SessionPanel({ sessions, activeSessionId, onSelect }: { sessions: SupportSession[]; activeSessionId: string; onSelect: (sessionId: string) => void }) {
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => sessions.filter((session) => JSON.stringify(session).toLowerCase().includes(query.toLowerCase())), [query, sessions]);
  const pinned = filtered.slice(0, 3);
  return (
    <aside className="flex min-h-0 flex-col rounded-2xl border border-white/10 bg-white/[0.04] p-4" aria-label="Session panel">
      <div className="mb-4"><h2 className="text-sm font-semibold">Sessions</h2><p className="text-xs text-[var(--color-text-muted)]">{sessions.length} recent conversations</p></div>
      <Search label="Search sessions" value={query} onChange={(event)=>setQuery(event.target.value)} onClear={()=>setQuery("")} placeholder="Search sessions" />
      <div className="mt-4 min-h-0 flex-1 space-y-4 overflow-y-auto pr-1">
        <section><h3 className="mb-2 text-xs uppercase tracking-[0.2em] text-violet-200">Pinned</h3>{pinned.map((session)=><SessionButton key={session.sessionId} session={session} active={session.sessionId===activeSessionId} onSelect={onSelect} />)}</section>
        <section><h3 className="mb-2 text-xs uppercase tracking-[0.2em] text-violet-200">Recent</h3>{filtered.map((session)=><SessionButton key={session.sessionId} session={session} active={session.sessionId===activeSessionId} onSelect={onSelect} />)}</section>
      </div>
    </aside>
  );
}

function SessionButton({ session, active, onSelect }: { session: SupportSession; active: boolean; onSelect: (sessionId: string) => void }) {
  return <button type="button" onClick={()=>onSelect(session.sessionId)} className={`mb-2 w-full rounded-xl border p-3 text-left text-sm transition focus:outline-none focus:ring-2 focus:ring-violet-400 ${active ? "border-violet-400/60 bg-violet-500/15" : "border-white/10 bg-white/[0.03] hover:border-violet-400/30"}`}><div className="flex items-start justify-between gap-2"><span className="font-medium">{session.currentIntent}</span><StatusBadge status={session.health} /></div><p className="mt-1 text-xs text-[var(--color-text-muted)]">{session.user} · {session.conversationCount} conversations</p><p className="mt-1 text-xs text-[var(--color-text-muted)]">Last activity {new Date(session.lastActivity).toLocaleDateString()}</p></button>;
}
