import { cn } from "@/lib/utils";
import { useChat } from "ai/react";
import { Bot, User, XCircle } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Message } from "ai";

interface AIChatBoxProps {
  open: boolean;
  onClose: () => void;
}

const AIChatBox: React.FC<AIChatBoxProps> = ({ open, onClose }) => {
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    setMessages,
    isLoading,
    error,
  } = useChat();

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
        <div className="bg-primary p-2 text-white">Chat with me</div>
        <div className="mt-auto">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
        </div>
        <form onSubmit={handleSubmit} className="m-3 flex gap-1">
          <Input
            value={input}
            onChange={handleInputChange}
            placeholder="Say something..."
          />
          <Button type="submit">Send</Button>
        </form>
      </div>
    </div>
  );
};

const ChatMessage: React.FC<{ message: Message }> = ({
  message: { role, content },
}) => {
  return (
    <div
      className={`flex gap-2 p-2 ${role === "assistant" ? "flex-row" : "flex-row-reverse"}`}
    >
      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gray-300">
        {role === "assistant" ? <Bot /> : <User />}
      </div>
      <div
        className={`flex flex-col rounded-lg px-2 py-1 text-white ${role === "assistant" ? "flex-row bg-blue-600 " : "items-end bg-blue-300"}`}
      >
        <span className="text-sm font-medium">
          {role === "assistant" ? "Juanca" : "You"}:
        </span>
        <span className="text-base font-light">{content}</span>
      </div>
    </div>
  );
};

export default AIChatBox;
