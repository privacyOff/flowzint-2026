import { getSuggestedPrompts } from "../../services/chat";

export function SuggestedPrompts({ onSelect }: { onSelect: (prompt: string) => void }) {
  return <section aria-label="Suggested prompts" className="flex flex-wrap gap-2">{getSuggestedPrompts().map((prompt)=><button key={prompt} type="button" onClick={()=>onSelect(prompt)} className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-[var(--color-text-muted)] transition hover:border-violet-400/40 hover:text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-violet-400">{prompt}</button>)}</section>;
}
