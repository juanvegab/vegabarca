import { ChatAnthropic } from "@langchain/anthropic";
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";
import {
  RunnablePassthrough,
  RunnableSequence,
} from "@langchain/core/runnables";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { BaseMessage, HumanMessage, AIMessage } from "@langchain/core/messages";
import { Document } from "@langchain/core/documents";
import { retriever } from "./retriever";

// ─── Model ────────────────────────────────────────────────────────────────────
const model = new ChatAnthropic({
  model: "claude-sonnet-4-6",
  streaming: true,
});

// ─── Prompt ───────────────────────────────────────────────────────────────────
// ChatPromptTemplate.fromMessages builds a structured prompt for chat models.
// Each entry maps to a role: "system", "human", "ai", or a MessagesPlaceholder.
const prompt = ChatPromptTemplate.fromMessages([
  [
    "system",
    `You are Juan Carlos Vega Abarca — a Senior Full-Stack Engineer & Agentic AI specialist with 15+ years of experience.
You are responding to visitors on your personal portfolio site, often viewed by hiring managers and recruiters.
Speak in first person, be confident, concise, and personable.
Keep answers short — 2–4 sentences unless a detailed breakdown is clearly needed.
If the context below doesn't cover the question, answer from general knowledge about your background.
Prioritize context from the most recent experiences and notes.
Today's date: {date}

# Relevant context about Juan Carlos
{context}`,
  ],
  // MessagesPlaceholder injects the full chat history at this position
  new MessagesPlaceholder("chat_history"),
  ["human", "{question}"],
]);

// ─── Helper: converts Vercel AI SDK messages to LangChain BaseMessage[] ───────
// The frontend sends messages in Vercel AI SDK format — we convert them here.
export function toLangChainMessages(
  messages: { role: string; content: string }[],
): BaseMessage[] {
  return messages
    .slice(0, -1) // exclude the last message — that's the current question
    .map((m) =>
      m.role === "user"
        ? new HumanMessage(m.content)
        : new AIMessage(m.content),
    );
}

// ─── Helper: format Document[] into a readable context string ─────────────────
function formatDocuments(docs: Document[]): string {
  if (docs.length === 0) return "No specific context found.";
  return docs.map((d) => d.pageContent).join("\n\n---\n\n");
}

// ─── Chain ────────────────────────────────────────────────────────────────────
// RunnableSequence.from([...]) is equivalent to A.pipe(B).pipe(C).pipe(D)
// Each step receives the output of the previous one.
export const ragChain = RunnableSequence.from([
  // Step 1: keep question + chat_history AND add context from the retriever
  RunnablePassthrough.assign({
    context: async (input: { question: string; chat_history: BaseMessage[] }) =>
      formatDocuments(await retriever.invoke(input.question)),
    date: () => new Date().toLocaleDateString(),
  }),

  // Step 2: format everything into a structured prompt for Claude
  prompt,

  // Step 3: call Claude — returns an AIMessage object
  model,

  // Step 4: extract the text string from AIMessage
  new StringOutputParser(),
]);
