import { experiencesIndex, notesIndex, technologiesIndex } from "@/lib/db/pinecone";
import prisma from "@/lib/db/prisma";
import { getEmbedding } from "@/lib/embeddings";
import { auth } from "@clerk/nextjs";

export const POST = async () => {
  const { userId } = auth();
  if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const results = { experiences: 0, notes: 0, technologies: 0, errors: [] as string[] };

  // Re-index experiences
  const experiences = await prisma.experience.findMany();
  for (const exp of experiences) {
    try {
      const text =
        `${exp.position} at ${exp.company}\nDates: ${exp.dates}\nUsed technologies: ${exp.techStack.join(", ")}\n\n${exp.content ?? ""}`;
      const embedding = await getEmbedding(text);
      await experiencesIndex.upsert([{ id: exp.id, values: embedding, metadata: { userId } }]);
      results.experiences++;
    } catch (e) {
      results.errors.push(`experience ${exp.id}: ${e}`);
    }
  }

  // Re-index notes
  const notes = await prisma.note.findMany();
  for (const note of notes) {
    try {
      const embedding = await getEmbedding(`${note.title}\n\n${note.content ?? ""}`);
      await notesIndex.upsert([{ id: note.id, values: embedding, metadata: { userId: note.userId } }]);
      results.notes++;
    } catch (e) {
      results.errors.push(`note ${note.id}: ${e}`);
    }
  }

  // Re-index technologies
  const technologies = await prisma.technology.findMany();
  for (const tech of technologies) {
    try {
      const embedding = await getEmbedding(`${tech.name}\n\n${tech.categories.join(", ")}`);
      await technologiesIndex.upsert([{ id: tech.id, values: embedding, metadata: { userId } }]);
      results.technologies++;
    } catch (e) {
      results.errors.push(`technology ${tech.id}: ${e}`);
    }
  }

  return Response.json(results);
};
