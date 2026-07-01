import { useState } from "react";
import type { Source } from "../../types/chat";
import { SourceCard } from "./SourceCard";

export function SourceList({ sources }: { sources: Source[] }) {
  const [open, setOpen] = useState(false);
  if (!sources.length) return null;
  return (
    <section className="mt-4 rounded-2xl border border-violet-300/15 bg-violet-500/[0.06] p-3 shadow-inner shadow-violet-950/20" aria-label="Sources used for this response">
      <button type="button" aria-expanded={open} onClick={() => setOpen((value) => !value)} className="flex w-full items-center justify-between rounded-xl text-left text-xs font-semibold text-violet-100 transition hover:text-white focus:outline-none focus:ring-2 focus:ring-violet-400 focus:ring-offset-2 focus:ring-offset-slate-950">
        <span>Sources ({sources.length})</span><span>{open ? "Hide" : "Show"}</span>
      </button>
      {open ? <div className="mt-3 grid gap-3 transition-all duration-200 ease-out">{sources.map((source) => <SourceCard key={`${source.id}-${source.source}`} source={source} />)}</div> : null}
    </section>
  );
}
