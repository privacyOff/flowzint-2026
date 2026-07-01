import { useState } from "react";
import { Button } from "../../components/ui/Button";
import { ChatProvider, useChatContext } from "../../context/ChatContext";
import { ChatInput } from "./ChatInput";
import { ChatWindow } from "./ChatWindow";

export function ChatPage() {
  return <ChatProvider><ChatExperience /></ChatProvider>;
}

function ChatExperience() {
  const { activeSessionId, messages, loading, streaming, error, sendMessage, regenerateLast } = useChatContext();
  const [draft, setDraft] = useState("");

  return (
    <main className="flex h-[calc(100vh-7rem)] min-h-[680px] flex-col overflow-hidden rounded-3xl border border-white/10 bg-slate-950/40 shadow-2xl shadow-violet-950/20" aria-label="AI chat page">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 bg-white/[0.05] px-5 py-4 backdrop-blur-xl">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-violet-200">AI support assistant</p>
          <h1 className="text-xl font-semibold text-white">AI Chat</h1>
          <p className="text-sm text-[var(--color-text-muted)]">Backend-compatible conversation · Session {activeSessionId || "loading"}</p>
        </div>
        <Button size="sm" variant="secondary" onClick={() => setDraft("")}>New Chat</Button>
      </header>

      {error ? <div className="mx-auto mt-4 w-full max-w-5xl rounded-xl border border-rose-400/30 bg-rose-950/30 p-3 text-sm text-rose-200" role="alert">{error}</div> : null}

      <ChatWindow messages={messages} loading={loading} streaming={streaming} onRegenerate={regenerateLast} />

      <div className="border-t border-white/10 bg-slate-950/70 px-4 py-4 backdrop-blur-xl">
        <div className="mx-auto w-full max-w-4xl">
          <ChatInput value={draft} onValueChange={setDraft} onSend={sendMessage} disabled={streaming || loading} />
        </div>
      </div>
    </main>
  );
}
