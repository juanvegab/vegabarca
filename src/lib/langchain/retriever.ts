import { RunnableLambda } from "@langchain/core/runnables";
import { Document } from "@langchain/core/documents";
import { notesIndex } from "@/lib/db/pinecone";
import prisma from "@/lib/db/prisma";
import { VoyageEmbeddings } from "./embeddings";

const embeddings = new VoyageEmbeddings();

// Takes the user's question, returns LangChain Documents with the relevant context
export const retriever = RunnableLambda.from(async (question: string): Promise<Document[]> => {
  // Step 1: embed the question into a vector
  const queryVector = await embeddings.embedQuery(question);

  // Step 2: fetch more candidates from Pinecone so recent experiences aren't crowded out
  const results = await notesIndex.query({ vector: queryVector, topK: 8 });
  const matchIds = results.matches.map((m) => m.id);

  // Step 3: fetch from Prisma — experiences sorted most-recent-first so Claude
  // always sees the latest work at the top of the context window
  const [experiences, notes] = await Promise.all([
    prisma.experience.findMany({
      where: { id: { in: matchIds } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.note.findMany({ where: { id: { in: matchIds } } }),
  ]);

  // Step 4: convert to LangChain Documents
  const expDocs = experiences.map(
    (e) =>
      new Document({
        pageContent: `${e.position} at ${e.company} (${e.dates})\nTech: ${e.techStack.join(", ")}\n${e.content ?? ""}`,
        metadata: { type: "experience", id: e.id },
      }),
  );

  const noteDocs = notes.map(
    (n) =>
      new Document({
        pageContent: `${n.title}\n${n.content ?? ""}`,
        metadata: { type: "note", id: n.id },
      }),
  );

  return [...expDocs, ...noteDocs];
});
