import { useState } from "react";
import type { DebugInfo } from "../../types/chat";

export function DebugInspector({ debug }: { debug: DebugInfo }) {
  const [open, setOpen] = useState(false);
  const retrieval = debug.retrieval_score ?? debug.top_score;
  return (
    <section className="mt-4 rounded-2xl border border-emerald-300/20 bg-emerald-500/[0.05] p-3" aria-label="Debug inspector">
      <button type="button" aria-expanded={open} onClick={() => setOpen((value) => !value)} className="flex w-full items-center justify-between rounded-xl text-left text-xs font-semibold text-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-400"><span>Debug Inspector</span><span>{open ? "Collapse" : "Expand"}</span></button>
      {open ? <div className="mt-4 space-y-4 text-xs text-[var(--color-text-muted)]">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <span className="rounded-xl bg-black/20 p-3">Retrieved Chunks: <strong className="text-white">{debug.retrieved_chunks.length}</strong></span>
          <span className="rounded-xl bg-black/20 p-3">Similarity: <strong className="text-white">{retrieval.toFixed(2)}</strong></span>
          <span className="rounded-xl bg-black/20 p-3">Latency: <strong className="text-white">{debug.latency_ms ?? 420}ms</strong></span>
          <span className="rounded-xl bg-black/20 p-3">Intent: <strong className="text-white">{debug.intent ?? "Unknown"}</strong></span>
          <span className="rounded-xl bg-black/20 p-3">Confidence: <strong className="text-white">{debug.confidence ?? Math.round(debug.top_score * 100)}%</strong></span>
          <span className="rounded-xl bg-black/20 p-3">Token Usage: <strong className="text-white">{debug.token_usage ?? 768}</strong></span>
        </div>
        <div><p className="mb-2 font-semibold text-emerald-100">Prompt</p><pre className="max-h-48 overflow-auto whitespace-pre-wrap rounded-xl border border-white/10 bg-black/25 p-3 text-[var(--color-text)]">{debug.prompt_context_preview}</pre></div>
        <div><p className="mb-2 font-semibold text-emerald-100">Memory</p><p className="rounded-xl border border-white/10 bg-black/20 p-3">{debug.handoff_reason ? `Handoff reason: ${debug.handoff_reason}` : "No handoff memory recorded for this response."}</p></div>
        <div className="grid gap-3">{debug.retrieved_chunks.map((chunk, index)=><div key={`${chunk.source}-${index}`} className="rounded-xl border border-white/10 bg-white/[0.04] p-3"><p className="font-semibold text-[var(--color-text)]">{chunk.source} · similarity {chunk.score.toFixed(2)}</p><p className="mt-1 leading-5">{chunk.snippet}</p></div>)}</div>
      </div> : null}
    </section>
  );
}
