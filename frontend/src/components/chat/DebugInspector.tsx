import { useState } from "react";
import type { DebugInfo } from "../../types/chat";
import { Card } from "../ui";

export function DebugInspector({ debug }: { debug: DebugInfo }) {
  const [open, setOpen] = useState(false);
  return (
    <Card variant="glass" className="mt-4 border-emerald-300/20 bg-emerald-500/[0.05] p-4 shadow-lg shadow-emerald-950/10">
      <button type="button" aria-expanded={open} onClick={() => setOpen((value) => !value)} className="flex w-full items-center justify-between rounded-xl text-sm font-semibold text-emerald-100 transition hover:text-white focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 focus:ring-offset-slate-950"><span>Debug Inspector</span><span>{open ? "−" : "+"}</span></button>
      {open ? <div className="mt-4 space-y-4 text-xs text-[var(--color-text-muted)]"><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3"><span className="rounded-xl bg-black/20 p-3">Confidence: {debug.confidence ?? Math.round(debug.top_score * 100)}%</span><span className="rounded-xl bg-black/20 p-3">Intent: {debug.intent ?? "Unknown"}</span><span className="rounded-xl bg-black/20 p-3">Retrieval: {(debug.retrieval_score ?? debug.top_score).toFixed(2)}</span><span className="rounded-xl bg-black/20 p-3">Latency: {debug.latency_ms ?? 420}ms</span><span className="rounded-xl bg-black/20 p-3">Tokens: {debug.token_usage ?? 768}</span><span className="rounded-xl bg-black/20 p-3">Chunks: {debug.retrieved_chunks.length}</span></div><pre className="max-h-48 overflow-auto whitespace-pre-wrap rounded-xl border border-white/10 bg-black/25 p-3 text-[var(--color-text)]">{debug.prompt_context_preview}</pre>{debug.retrieved_chunks.map((chunk, index)=><div key={`${chunk.source}-${index}`} className="rounded-xl border border-white/10 bg-white/[0.04] p-3"><p className="font-semibold text-[var(--color-text)]">{chunk.source} · {chunk.score.toFixed(2)}</p><p className="mt-1 leading-5">{chunk.snippet}</p></div>)}</div> : null}
    </Card>
  );
}
