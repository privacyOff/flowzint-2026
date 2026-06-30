import { useState } from "react";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { DebugInspector } from "../../components/chat/DebugInspector";
import { ChatProvider, useChatContext } from "../../context/ChatContext";
import { ChatInput } from "./ChatInput";
import { ChatWindow } from "./ChatWindow";
import { SessionPanel } from "./SessionPanel";
import { SuggestedPrompts } from "./SuggestedPrompts";

export function ChatPage() {
  return <ChatProvider><ChatExperience /></ChatProvider>;
}

function ChatExperience() {
  const { sessions, activeSession, activeSessionId, messages, loading, streaming, error, selectSession, sendMessage, regenerateLast } = useChatContext();
  const [draft, setDraft] = useState("");
  const [showSessions, setShowSessions] = useState(false);
  const [showContext, setShowContext] = useState(false);
  const latestAssistant = [...messages].reverse().find((message) => message.role === "assistant" && message.debug);
  return (
    <main className="grid h-[calc(100vh-7rem)] min-h-[720px] gap-4 xl:grid-cols-[280px_minmax(0,1fr)_320px]" aria-label="AI chat page">
      <div className={`${showSessions ? "block" : "hidden"} xl:block`}><SessionPanel sessions={sessions} activeSessionId={activeSessionId} onSelect={(id)=>{void selectSession(id); setShowSessions(false);}} /></div>
      <section className="flex min-h-0 flex-col gap-4">
        <header className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.06] p-4"><div><p className="text-xs uppercase tracking-[0.25em] text-violet-200">AI support assistant</p><h1 className="text-xl font-semibold">AI Chat</h1><p className="text-sm text-[var(--color-text-muted)]">Session {activeSessionId || "loading"}</p></div><div className="flex gap-2"><Button size="sm" variant="secondary" onClick={()=>setShowSessions((value)=>!value)} className="xl:hidden">Sessions</Button><Button size="sm" variant="secondary" onClick={()=>setShowContext((value)=>!value)} className="xl:hidden">Context</Button><Button size="sm" onClick={()=>setDraft("")}>New Chat</Button></div></header>
        {error ? <div className="rounded-xl border border-rose-400/30 bg-rose-950/30 p-3 text-sm text-rose-200">{error}</div> : null}
        <ChatWindow messages={messages} loading={loading} streaming={streaming} onRegenerate={regenerateLast} />
        <SuggestedPrompts onSelect={setDraft} />
        <ChatInput value={draft} onValueChange={setDraft} onSend={sendMessage} disabled={streaming || loading} />
      </section>
      <aside className={`${showContext ? "block" : "hidden"} min-h-0 space-y-4 overflow-y-auto xl:block`} aria-label="Assistant context panel">
        <Card title="Session Information" variant="glass"><div className="space-y-3 text-sm text-[var(--color-text-muted)]"><p>User: {activeSession?.user}</p><p>Account: {activeSession?.account}</p><p>Intent: {activeSession?.currentIntent}</p><p>Memory: {activeSession?.memoryStatus}</p><p>Health: {activeSession?.health}</p></div></Card>
        {latestAssistant?.debug ? <DebugInspector debug={latestAssistant.debug} /> : null}
        <Card title="Tools" variant="glass"><div className="grid gap-2"><Button variant="secondary" size="sm">View Debug</Button><Button variant="secondary" size="sm">Create Ticket</Button><Button variant="secondary" size="sm">Copy Transcript</Button></div></Card>
      </aside>
    </main>
  );
}
