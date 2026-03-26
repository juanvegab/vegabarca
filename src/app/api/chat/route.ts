import { notesIndex } from "@/lib/db/pinecone";
import prisma from "@/lib/db/prisma";
import { getEmbedding } from "@/lib/openai";
import { anthropic } from "@ai-sdk/anthropic";
import { streamText, convertToModelMessages, UIMessage } from "ai";

export const POST = async (req: Request) => {
  try {
    const body = await req.json();
    const messages: UIMessage[] = body.messages;

    const recentMessages = messages.slice(-6);

    const textForEmbedding = recentMessages
      .map((m) =>
        m.parts
          .filter((p) => p.type === "text")
          .map((p) => (p as { type: "text"; text: string }).text)
          .join(" "),
      )
      .join("\n");

    const embedding = await getEmbedding(textForEmbedding);

    const vectorQueryResponse = await notesIndex.query({
      vector: embedding,
      topK: 4,
    });

    const matchIds = vectorQueryResponse.matches.map((m) => m.id);

    const [relevantNotes, relevantExperiences] = await Promise.all([
      prisma.note.findMany({ where: { id: { in: matchIds } } }),
      prisma.experience.findMany({ where: { id: { in: matchIds } } }),
    ]);

    const contextBlocks: string[] = [];

    if (relevantExperiences.length > 0) {
      contextBlocks.push(
        "## Relevant Work Experience\n" +
          relevantExperiences
            .map(
              (e) =>
                `**${e.position} at ${e.company}** (${e.dates})\n` +
                `Tech: ${e.techStack.join(", ")}\n` +
                e.content,
            )
            .join("\n\n"),
      );
    }

    if (relevantNotes.length > 0) {
      contextBlocks.push(
        "## Additional Context\n" +
          relevantNotes
            .map((n) => `**${n.title}**\n${n.content}`)
            .join("\n\n"),
      );
    }

    const systemPrompt =
      `You are Juan Carlos Vega Abarca — an Agentic AI & Full-Stack Engineer with 15+ years of experience. ` +
      `You are responding to visitors on your personal portfolio site, which is often viewed by hiring managers and recruiters. ` +
      `Speak in first person, be confident, concise, and personable. ` +
      `Highlight your expertise in agentic AI systems, RAG pipelines, LLMs, React, Next.js, and TypeScript when relevant. ` +
      `If asked about availability, you are open to senior and staff-level roles at AI-first companies. ` +
      `Keep answers short — 2–4 sentences unless a detailed breakdown is clearly needed. ` +
      `If the context below doesn't cover the question, answer from general knowledge about your background, or say you'd be happy to connect directly. ` +
      `Today's date: ${new Date().toLocaleDateString()}\n\n` +
      (contextBlocks.length > 0
        ? `# Context about Juan Carlos\n\n${contextBlocks.join("\n\n")}`
        : "");

    const result = streamText({
      model: anthropic("claude-sonnet-4-6"),
      system: systemPrompt,
      messages: await convertToModelMessages(recentMessages),
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("[/api/chat]", message, error);
    return Response.json({ error: "Internal server error", detail: message }, { status: 500 });
  }
};
