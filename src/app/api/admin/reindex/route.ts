import { experiencesIndex, notesIndex, technologiesIndex } from "@/lib/db/pinecone";
import prisma from "@/lib/db/prisma";
import { getEmbedding } from "@/lib/embeddings";
import { auth } from "@clerk/nextjs";

export const maxDuration = 60;

export const POST = async () => {
  const { userId } = auth();
  if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const results = { experiences: 0, notes: 0, technologies: 0, errors: [] as string[] };

  // Re-index experiences — embed all in parallel, then batch upsert
  const experiences = await prisma.experience.findMany();
  const expVectors = await Promise.allSettled(
    experiences.map(async (exp) => {
      const text = `${exp.position} at ${exp.company}\nDates: ${exp.dates}\nUsed technologies: ${exp.techStack.join(", ")}\n\n${exp.content ?? ""}`;
      const values = await getEmbedding(text);
      return { id: exp.id, values, metadata: { userId } };
    }),
  );
  const expBatch = expVectors.flatMap((r, i) => {
    if (r.status === "fulfilled") { results.experiences++; return [r.value]; }
    results.errors.push(`experience ${experiences[i].id}: ${r.reason}`);
    return [];
  });
  if (expBatch.length) await experiencesIndex.upsert(expBatch);

  // Re-index notes
  const notes = await prisma.note.findMany();
  const noteVectors = await Promise.allSettled(
    notes.map(async (note) => {
      const values = await getEmbedding(`${note.title}\n\n${note.content ?? ""}`);
      return { id: note.id, values, metadata: { userId: note.userId } };
    }),
  );
  const noteBatch = noteVectors.flatMap((r, i) => {
    if (r.status === "fulfilled") { results.notes++; return [r.value]; }
    results.errors.push(`note ${notes[i].id}: ${r.reason}`);
    return [];
  });
  if (noteBatch.length) await notesIndex.upsert(noteBatch);

  // Re-index technologies
  const technologies = await prisma.technology.findMany();
  const techVectors = await Promise.allSettled(
    technologies.map(async (tech) => {
      const values = await getEmbedding(`${tech.name}\n\n${tech.categories.join(", ")}`);
      return { id: tech.id, values, metadata: { userId } };
    }),
  );
  const techBatch = techVectors.flatMap((r, i) => {
    if (r.status === "fulfilled") { results.technologies++; return [r.value]; }
    results.errors.push(`technology ${technologies[i].id}: ${r.reason}`);
    return [];
  });
  if (techBatch.length) await technologiesIndex.upsert(techBatch);

  return Response.json(results);
};
