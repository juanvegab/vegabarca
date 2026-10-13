"use client";

import { Bot } from "lucide-react";
import { useChatContext } from "@/contexts/ChatContext";

export default function AIChatFAB() {
  const { openChat } = useChatContext();

  return (
    <button
      onClick={openChat}
      aria-label="Open AI chat with Juan Carlos"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-all duration-200 hover:scale-110 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 print:hidden"
    >
      <Bot className="h-6 w-6" />
    </button>
  );
}
