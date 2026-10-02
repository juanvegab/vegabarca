import prisma from "@/lib/db/prisma";
import { getEmbedding } from "@/lib/embeddings";
import { technologiesIndex } from "@/lib/db/pinecone";
import { anthropic } from "@ai-sdk/anthropic";
import { generateText } from "ai";
import { auth } from "@clerk/nextjs";

export const maxDuration = 60;

const VALID_CATEGORIES = ["AI/ML", "Frontend", "Mobile", "Backend", "Databases", "Others"];

export const POST = async () => {
  const { userId } = auth();
  if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 });

  // Collect all unique tech names from every experience's techStack
  const experiences = await prisma.experience.findMany({ select: { techStack: true } });
  const allTechs = new Set<string>();
  for (const exp of experiences) {
    for (const tech of exp.techStack) {
      const t = tech.trim();
      if (t) allTechs.add(t);
    }
  }

  // Find which ones are already in the Technology collection
  const existing = await prisma.technology.findMany({ select: { name: true } });
  const existingNames = new Set(existing.map((t) => t.name.toLowerCase()));

  const newTechs = Array.from(allTechs).filter((t) => !existingNames.has(t.toLowerCase()));

  if (newTechs.length === 0) {
    return Response.json({ created: 0, message: "All technologies already synced." });
  }

  // Ask Claude to categorize all new techs in one call
  const { text } = await generateText({
    model: anthropic("claude-sonnet-4-6"),
    system:
      `You are a software engineering taxonomy expert. Categorize each technology into one or more of these exact categories: ${VALID_CATEGORIES.join(", ")}.\n\n` +
      `Rules:\n` +
      `- Return ONLY valid JSON: an object where each key is a technology name and the value is an array of category strings.\n` +
      `- Use ONLY the categories listed above, spelled exactly as shown.\n` +
      `- Most technologies belong to one category. Use two only when genuinely cross-cutting (e.g. a framework used for both AI and backend).\n` +
      `- If unsure, use "Others".\n` +
      `- Do not include any explanation, markdown, or code fences — just the raw JSON object.`,
    prompt: `Categorize these technologies:\n${newTechs.join("\n")}`,
  });

  let categorized: Record<string, string[]>;
  try {
    categorized = JSON.parse(text.trim());
  } catch {
    return Response.json({ error: "Failed to parse AI response", raw: text }, { status: 500 });
  }

  // Create Technology records and embed them
  const results = { created: 0, errors: [] as string[] };

  await Promise.allSettled(
    newTechs.map(async (techName) => {
      const rawCats: unknown = categorized[techName] ?? categorized[Object.keys(categorized).find((k) => k.toLowerCase() === techName.toLowerCase()) ?? ""];
      const categories = (Array.isArray(rawCats) ? rawCats : ["Others"]).filter(
        (c): c is string => VALID_CATEGORIES.includes(c),
      );
      const finalCategories = categories.length > 0 ? categories : ["Others"];

      try {
        const technology = await prisma.technology.create({
          data: { name: techName, categories: finalCategories },
        });

        const embedding = await getEmbedding(`${techName}\n\n${finalCategories.join(", ")}`);
        await technologiesIndex.upsert([{ id: technology.id, values: embedding, metadata: { userId } }]);

        results.created++;
      } catch (e) {
        results.errors.push(`${techName}: ${e}`);
      }
    }),
  );

  return Response.json(results);
};
