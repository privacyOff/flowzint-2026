import { useState } from "react";
import type { Source } from "../../types/chat";
import { SourceCard } from "./SourceCard";

export function SourceList({ sources }: { sources: Source[] }) {
  const [open, setOpen] = useState(false);
  if (!sources.length) return null;
  return (
    <section className="mt-4 rounded-2xl border border-violet-300/15 bg-violet-500/[0.06] p-3" aria-label="Sources used for this response">
      <button type="button" aria-expanded={open} onClick={() => setOpen((value) => !value)} className="flex w-full items-center justify-between rounded-xl text-left text-xs font-semibold text-violet-100 focus:outline-none focus:ring-2 focus:ring-violet-400">
        <span>Sources ({sources.length})</span><span>{open ? "Collapse" : "Expand"}</span>
      </button>
      {open ? <div className="mt-3 grid max-h-80 gap-3 overflow-y-auto pr-1">{sources.map((source, index) => <SourceCard key={`${source.id}-${source.source}-${index}`} source={source} citationNumber={index + 1} />)}</div> : null}
    </section>
  );
}
