"use client";

import { Button } from "./ui/button";
import { Bot } from "lucide-react";
import { useChatContext } from "@/contexts/ChatContext";

const AIChatButton: React.FC = () => {
  const { openChat } = useChatContext();

  return (
    <Button onClick={openChat}>
      <Bot size={20} className="mr-2" />
      AI Chat
    </Button>
  );
};

export default AIChatButton;
