import { useEffect, useRef } from "react";
import type { Message } from "../../types/chat";
import { Skeleton } from "../../components/ui/Skeleton";
import { MessageBubble } from "./MessageBubble";

type Props = { messages: Message[]; loading: boolean; streaming?: boolean; onRegenerate?: () => void; };

export function ChatWindow({ messages, loading, streaming, onRegenerate }: Props) {
  const endRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" }); }, [messages, loading, streaming]);
  if (loading) return <div className="flex-1 p-4"><Skeleton variant="cards" /></div>;
  return (
    <section className="min-h-0 flex-1 space-y-5 overflow-y-auto rounded-2xl border border-white/10 bg-black/10 p-4" aria-label="Message history" tabIndex={0}>
      {messages.map((message) => <MessageBubble key={message.id} message={message} onRegenerate={onRegenerate} />)}
      {streaming && <div className="pl-11 text-xs text-violet-200" role="status">Assistant is typing…</div>}
      <div ref={endRef} />
    </section>
  );
}
