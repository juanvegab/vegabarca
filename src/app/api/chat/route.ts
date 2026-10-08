import { createTextStreamResponse, UIMessage } from "ai";
import { ragChain, toLangChainMessages } from "@/lib/langchain/chain";

export const POST = async (req: Request) => {
  try {
    const body = await req.json();
    const messages: UIMessage[] = body.messages;

    const question = messages[messages.length - 1].parts
      .filter((p) => p.type === "text")
      .map((p) => (p as { type: "text"; text: string }).text)
      .join(" ");

    const chat_history = toLangChainMessages(
      messages.map((m) => ({
        role: m.role,
        content: m.parts
          .filter((p) => p.type === "text")
          .map((p) => (p as { type: "text"; text: string }).text)
          .join(" "),
      })),
    );

    const langChainStream = await ragChain.stream({ question, chat_history });

    // Convert LangChain's AsyncIterable<string> → ReadableStream<string>
    const textStream = new ReadableStream<string>({
      async start(controller) {
        for await (const chunk of langChainStream) {
          controller.enqueue(chunk);
        }
        controller.close();
      },
    });

    // createTextStreamResponse sends plain text/plain; charset=utf-8
    // The client uses TextStreamChatTransport to parse this back into UIMessageChunks
    return createTextStreamResponse({ textStream });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("[/api/chat]", message, error);
    return Response.json({ error: "Internal server error", detail: message }, { status: 500 });
  }
};
