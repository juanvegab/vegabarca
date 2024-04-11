import { cn } from "@/lib/utils";
import { useChat } from "ai/react";
import { Bot, User, XCircle } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Message } from "ai";
import { useEffect, useRef } from "react";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";

interface AIChatBoxProps {
  open: boolean;
  onClose: () => void;
}

const AIChatBox: React.FC<AIChatBoxProps> = ({ open, onClose }) => {
  const { messages, input, handleInputChange, handleSubmit, isLoading, error } =
    useChat();

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current)
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  useEffect(() => {
    if (open && inputRef.current) inputRef.current.focus();
  }, [open]);

  const lastMessageIsUser = messages[messages.length - 1]?.role === "user";

  return (
    <div
      className={cn(
        "z10 bottom-0 right-0 w-full max-w-[500px] p-1 xl:right-36",
        open ? "fixed" : "hidden",
      )}
    >
      <button onClick={onClose} className="mb-1 ms-auto block">
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
              message={{
                role: "assistant",
                content: "Thinking...",
              }}
            />
          )}
          {error && (
            <ChatMessage
              message={{
                role: "assistant",
                content: "An error occurred. Please try again.",
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
        <form onSubmit={handleSubmit} className="m-3 flex gap-1">
          <Input
            ref={inputRef}
            value={input}
            onChange={handleInputChange}
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

const ChatMessage: React.FC<{ message: Pick<Message, "role" | "content"> }> = ({
  message: { role, content },
}) => {
  const { user } = useUser();
  const isAiMessage = role === "assistant";
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
        className={`flex flex-col rounded-lg px-2 py-1 text-white ${isAiMessage ? "flex-row bg-blue-600 " : "items-end bg-blue-300"}`}
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
