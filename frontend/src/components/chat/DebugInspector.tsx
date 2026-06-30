import { useState } from "react";
import type { DebugInfo } from "../../types/chat";
import { Card } from "../ui/Card";

export function DebugInspector({ debug }: { debug: DebugInfo }) {
  const [open, setOpen] = useState(false);
  return (
    <Card variant="glass" className="p-4">
      <button type="button" onClick={() => setOpen((value) => !value)} className="flex w-full items-center justify-between text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-violet-400"><span>Debug Inspector</span><span>{open ? "−" : "+"}</span></button>
      {open ? <div className="mt-4 space-y-4 text-xs text-[var(--color-text-muted)]"><div className="grid grid-cols-2 gap-3"><span>Confidence: {debug.confidence ?? Math.round(debug.top_score * 100)}%</span><span>Intent: {debug.intent ?? "Unknown"}</span><span>Retrieval: {(debug.retrieval_score ?? debug.top_score).toFixed(2)}</span><span>Latency: {debug.latency_ms ?? 420}ms</span><span>Tokens: {debug.token_usage ?? 768}</span><span>Chunks: {debug.retrieved_chunks.length}</span></div><pre className="whitespace-pre-wrap rounded-xl bg-black/20 p-3 text-[var(--color-text)]">{debug.prompt_context_preview}</pre>{debug.retrieved_chunks.map((chunk, index)=><div key={`${chunk.source}-${index}`} className="rounded-xl bg-white/[0.04] p-3"><p className="font-semibold text-[var(--color-text)]">{chunk.source} · {chunk.score.toFixed(2)}</p><p className="mt-1 leading-5">{chunk.snippet}</p></div>)}</div> : null}
    </Card>
  );
}
