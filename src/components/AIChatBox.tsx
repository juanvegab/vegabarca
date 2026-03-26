"use client";

import { cn } from "@/lib/utils";
import { useChat } from "@ai-sdk/react";
import { UIMessage } from "ai";
import { Bot, User, XCircle } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { FormEvent, useEffect, useRef, useState } from "react";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import { track } from "@vercel/analytics";
import { useChatContext } from "@/contexts/ChatContext";

const AIChatBox: React.FC = () => {
  const { chatOpen, closeChat, pendingMessage, clearPendingMessage } =
    useChatContext();

  const { messages, sendMessage, status, error } = useChat();

  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const isLoading = status === "submitted" || status === "streaming";

  useEffect(() => {
    if (scrollRef.current)
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  useEffect(() => {
    if (chatOpen && inputRef.current) inputRef.current.focus();
  }, [chatOpen]);

  useEffect(() => {
    if (pendingMessage && chatOpen) {
      setInput(pendingMessage);
      clearPendingMessage();
      if (inputRef.current) inputRef.current.focus();
    }
  }, [pendingMessage, chatOpen, clearPendingMessage]);

  const lastMessageIsUser =
    messages[messages.length - 1]?.role === "user";

  const submitQuestion = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!input.trim()) return;
    track("AI_BOT_QUESTION_SUBMITED", { question: input });
    sendMessage({ text: input });
    setInput("");
  };

  return (
    <div
      className={cn(
        "z-10 bottom-0 right-0 w-full max-w-[500px] p-1 xl:right-36",
        chatOpen ? "fixed" : "hidden",
      )}
    >
      <button onClick={closeChat} className="mb-1 ms-auto block">
        <XCircle size={30} />
      </button>
      <div className="flex h-[600px] flex-col overflow-hidden rounded-xl border bg-background shadow-xl">
        <div className="bg-primary p-2 text-secondary">Chat with me</div>
        <div className="mt-auto overflow-y-scroll" ref={scrollRef}>
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
          {isLoading && lastMessageIsUser && (
            <ChatMessage
              message={{ role: "assistant", parts: [{ type: "text", text: "Thinking..." }] }}
            />
          )}
          {error && (
            <ChatMessage
              message={{
                role: "assistant",
                parts: [{ type: "text", text: "An error occurred. Please try again." }],
              }}
            />
          )}
          {!error && messages.length === 0 && (
            <div className="flex h-full flex-col items-center justify-center gap-3">
              <span className="text-lg font-light">Ask me any question!</span>
              <Bot size={40} />
            </div>
          )}
        </div>
        <form onSubmit={submitQuestion} className="m-3 flex gap-1">
          <Input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Say something..."
          />
          <Button className="ml-2" type="submit">
            Send
          </Button>
        </form>
      </div>
    </div>
  );
};

type ChatMessageProps = {
  message: Pick<UIMessage, "role" | "parts">;
};

const ChatMessage: React.FC<ChatMessageProps> = ({ message: { role, parts } }) => {
  const { user } = useUser();
  const isAiMessage = role === "assistant";
  const content = parts
    .filter((p) => p.type === "text")
    .map((p) => (p as { type: "text"; text: string }).text)
    .join("");

  const userImage = user?.hasImage ? (
    <Image
      src={user.imageUrl}
      alt={user.firstName ?? "User"}
      width="30"
      height="30"
    />
  ) : (
    <User />
  );

  return (
    <div
      className={`flex gap-2 p-2 ${isAiMessage ? "flex-row" : "flex-row-reverse"}`}
    >
      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-gray-300">
        {isAiMessage ? <Bot /> : userImage}
      </div>
      <div
        className={`flex flex-col rounded-lg px-2 py-1 text-white ${isAiMessage ? "flex-row bg-blue-600" : "items-end bg-blue-300"}`}
      >
        <span className="text-sm font-medium">
          {isAiMessage ? "Juanca" : "You"}:
        </span>
        <span className="text-base font-light">{content}</span>
      </div>
    </div>
  );
};

export default AIChatBox;
