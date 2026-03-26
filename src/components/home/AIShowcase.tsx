"use client";

import { Button } from "@/components/ui/button";
import { Bot, Sparkles } from "lucide-react";
import { useChatContext } from "@/contexts/ChatContext";

const EXAMPLE_PROMPTS = [
  "What's your experience with LLMs and RAG pipelines?",
  "Tell me about your most recent agentic AI project",
  "What's your full-stack tech stack?",
  "Have you led engineering teams?",
  "Are you open to new opportunities?",
];

export default function AIShowcase() {
  const { openChat, openChatWithMessage } = useChatContext();

  return (
    <section className="border-y bg-muted/20 py-16">
      <div className="mx-auto max-w-4xl px-4">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
            <Bot className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              Ask My AI Anything
            </h2>
            <p className="text-sm text-muted-foreground">
              I built an AI assistant trained on my experience. Try a prompt:
            </p>
          </div>
        </div>

        <div className="mb-6 flex flex-wrap gap-2">
          {EXAMPLE_PROMPTS.map((prompt) => (
            <button
              key={prompt}
              onClick={() => openChatWithMessage(prompt)}
              className="flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm transition-colors hover:border-blue-400 hover:bg-blue-50 hover:text-blue-700 dark:hover:border-blue-600 dark:hover:bg-blue-950/30 dark:hover:text-blue-300"
            >
              <Sparkles className="h-3 w-3 opacity-60" />
              {prompt}
            </button>
          ))}
        </div>

        <Button variant="outline" onClick={openChat}>
          <Bot className="mr-2 h-4 w-4" />
          Open AI Chat
        </Button>
      </div>
    </section>
  );
}
