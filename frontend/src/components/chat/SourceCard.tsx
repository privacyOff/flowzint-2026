import { useState } from "react";
import type { Source } from "../../types/chat";
import { ProgressBar } from "../charts/ProgressBar";

export function SourceCard({ source }: { source: Source }) {
  const [expanded, setExpanded] = useState(false);
  const confidence = source.confidenceScore ?? Math.round(source.score * 100);
  return (
    <article className="rounded-xl border border-white/10 bg-white/[0.04] p-3 text-xs">
      <button type="button" onClick={() => setExpanded((value) => !value)} className="flex w-full items-start justify-between gap-3 text-left focus:outline-none focus:ring-2 focus:ring-violet-400">
        <span><span className="font-semibold text-violet-200">[{source.id}] {source.document ?? source.source}</span><span className="mt-1 block text-[var(--color-text-muted)]">{source.source}</span></span>
        <span aria-hidden>{expanded ? "−" : "+"}</span>
      </button>
      {expanded ? <p className="mt-3 leading-5 text-[var(--color-text-muted)]">{source.snippet}</p> : null}
      <div className="mt-3 grid gap-2 sm:grid-cols-2"><div><p className="mb-1 text-[var(--color-text-muted)]">Confidence {confidence}%</p><ProgressBar value={confidence} variant="success" /></div><div><p className="mb-1 text-[var(--color-text-muted)]">Relevance {source.relevanceScore ?? confidence}%</p><ProgressBar value={source.relevanceScore ?? confidence} variant="purple" /></div></div>
    </article>
  );
}
