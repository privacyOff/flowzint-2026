import { createContext, useContext, type ReactNode } from "react";
import { useChat } from "../hooks/useChat";

type ChatContextValue = ReturnType<typeof useChat>;
const ChatContext = createContext<ChatContextValue | null>(null);

export function ChatProvider({ children }: { children: ReactNode }) {
  return <ChatContext.Provider value={useChat()}>{children}</ChatContext.Provider>;
}

export function useChatContext() {
  const value = useContext(ChatContext);
  if (!value) throw new Error("useChatContext must be used inside ChatProvider");
  return value;
}
