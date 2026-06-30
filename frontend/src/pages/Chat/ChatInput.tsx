import { FormEvent, KeyboardEvent, useEffect, useRef, useState } from "react";
import { Button } from "../../components/ui/Button";
import { Textarea } from "../../components/ui/Textarea";

type Props = { onSend: (message: string) => void | Promise<void>; disabled?: boolean; value?: string; onValueChange?: (value: string) => void; };

export function ChatInput({ onSend, disabled, value: externalValue, onValueChange }: Props) {
  const [internalValue, setInternalValue] = useState("");
  const value = externalValue ?? internalValue;
  const setValue = onValueChange ?? setInternalValue;
  const ref = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => { if (ref.current) { ref.current.style.height = "0px"; ref.current.style.height = `${Math.min(ref.current.scrollHeight, 180)}px`; } }, [value]);

  const submit = async (event?: FormEvent) => {
    event?.preventDefault();
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    setValue("");
    await onSend(trimmed);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); void submit(); }
  };

  return (
    <form onSubmit={submit} className="rounded-2xl border border-white/10 bg-white/[0.04] p-3" aria-label="Chat input">
      <Textarea ref={ref} label="Message" value={value} onChange={(event)=>setValue(event.target.value)} onKeyDown={onKeyDown} disabled={disabled} placeholder="Ask anything about product support..." className="max-h-44 min-h-12 resize-none" helperText={`${value.length}/1200 characters · Enter to send, Shift+Enter for a new line`} maxLength={1200} autoFocus />
      <div className="mt-3 flex justify-end"><Button type="submit" disabled={!value.trim() || disabled} loading={disabled}>Send</Button></div>
    </form>
  );
}
