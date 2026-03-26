"use client";

import { createContext, useContext, useState } from "react";

interface ChatContextValue {
  chatOpen: boolean;
  openChat: () => void;
  closeChat: () => void;
  pendingMessage: string;
  openChatWithMessage: (message: string) => void;
  clearPendingMessage: () => void;
}

const ChatContext = createContext<ChatContextValue | null>(null);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [chatOpen, setChatOpen] = useState(false);
  const [pendingMessage, setPendingMessage] = useState("");

  const openChat = () => setChatOpen(true);
  const closeChat = () => setChatOpen(false);
  const openChatWithMessage = (message: string) => {
    setPendingMessage(message);
    setChatOpen(true);
  };
  const clearPendingMessage = () => setPendingMessage("");

  return (
    <ChatContext.Provider
      value={{
        chatOpen,
        openChat,
        closeChat,
        pendingMessage,
        openChatWithMessage,
        clearPendingMessage,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChatContext(): ChatContextValue {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error("useChatContext must be used inside ChatProvider");
  return ctx;
}
