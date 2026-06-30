import { useState } from "react";
import type { Source } from "../../types/chat";
import { SourceCard } from "./SourceCard";

export function SourceList({ sources }: { sources: Source[] }) {
  const [open, setOpen] = useState(true);
  if (!sources.length) return null;
  return (
    <section className="mt-4 rounded-2xl border border-white/10 bg-black/10 p-3" aria-label="Sources used for this response">
      <button type="button" onClick={() => setOpen((value) => !value)} className="flex w-full items-center justify-between text-xs font-medium text-violet-200 focus:outline-none focus:ring-2 focus:ring-violet-400">
        <span>Sources ({sources.length})</span><span>{open ? "Hide" : "Show"}</span>
      </button>
      {open ? <div className="mt-3 grid gap-3">{sources.map((source) => <SourceCard key={`${source.id}-${source.source}`} source={source} />)}</div> : null}
    </section>
  );
}
