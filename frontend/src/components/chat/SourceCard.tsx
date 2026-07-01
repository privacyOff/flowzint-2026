import { useState } from "react";
import type { Source } from "../../types/chat";
import { ProgressBar } from "../charts/ProgressBar";

export function SourceCard({ source, citationNumber }: { source: Source; citationNumber?: number }) {
  const [expanded, setExpanded] = useState(false);
  const relevance = source.relevanceScore ?? source.confidenceScore ?? Math.round(source.score * 100);
  const documentName = source.document ?? source.source;
  return (
    <article className="rounded-xl border border-white/10 bg-slate-950/45 p-3 text-xs shadow-inner shadow-black/20">
      <button type="button" aria-expanded={expanded} onClick={() => setExpanded((value) => !value)} className="flex w-full items-start justify-between gap-3 rounded-lg text-left focus:outline-none focus:ring-2 focus:ring-violet-400">
        <span className="flex gap-3">
          <span className="flex h-7 min-w-7 items-center justify-center rounded-lg border border-violet-300/30 bg-violet-500/15 font-semibold text-violet-100">[{citationNumber ?? source.id}]</span>
          <span><span className="font-semibold text-white">{documentName}</span><span className="mt-1 block text-[var(--color-text-muted)]">{source.snippet}</span></span>
        </span>
        <span aria-hidden className="text-violet-200">{expanded ? "−" : "+"}</span>
      </button>
      {expanded ? <p className="mt-3 rounded-lg bg-black/20 p-3 leading-5 text-[var(--color-text-muted)]">{source.snippet}</p> : null}
      <div className="mt-3"><p className="mb-1 text-[var(--color-text-muted)]">{relevance}% relevance</p><ProgressBar value={relevance} variant="purple" /></div>
    </article>
  );
}
