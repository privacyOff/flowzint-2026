import { useEffect, useRef } from "react";
import type { Message } from "../../types/chat";
import { Skeleton } from "../../components/ui/Skeleton";
import { MessageBubble } from "./MessageBubble";

type Props = { messages: Message[]; loading: boolean; streaming?: boolean; onRegenerate?: () => void; };

export function ChatWindow({ messages, loading, streaming, onRegenerate }: Props) {
  const endRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" }); }, [messages, loading, streaming]);
  if (loading) return <div className="mx-auto w-full max-w-4xl flex-1 p-4"><Skeleton variant="cards" /></div>;
  return (
    <section className="min-h-0 flex-1 overflow-y-auto px-4 py-6" aria-label="Message history" tabIndex={0}>
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
        {messages.map((message) => <MessageBubble key={message.id} message={message} onRegenerate={onRegenerate} />)}
        {streaming && <div className="ml-11 flex items-center gap-2 text-xs text-violet-200" role="status" aria-live="polite"><span className="h-2 w-2 animate-pulse rounded-full bg-violet-300" />Assistant is typing…</div>}
        <div ref={endRef} />
      </div>
    </section>
  );
}
