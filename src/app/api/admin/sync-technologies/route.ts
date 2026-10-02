import prisma from "@/lib/db/prisma";
import { getEmbedding } from "@/lib/embeddings";
import { technologiesIndex } from "@/lib/db/pinecone";
import { anthropic } from "@ai-sdk/anthropic";
import { generateText } from "ai";
import { auth } from "@clerk/nextjs";

export const maxDuration = 60;

const VALID_CATEGORIES = ["AI/ML", "Frontend", "Mobile", "Backend", "Databases", "Tools & Platforms", "UI/UX", "Others"];

const normalize = (s: string) => s.toLowerCase().replace(/[\s\-_.]/g, "");

async function categorizeWithClaude(techNames: string[]): Promise<Record<string, string[]>> {
  const { text } = await generateText({
    model: anthropic("claude-sonnet-4-6"),
    system:
      `You are a software engineering taxonomy expert. Categorize each technology into one or more of these exact categories: ${VALID_CATEGORIES.join(", ")}.\n\n` +
      `Guidelines per category:\n` +
      `- AI/ML: LLMs, AI frameworks, prompt engineering, embeddings, vector DBs, AI APIs and coding assistants — includes Claude, OpenAI, LangChain, RAG, Cursor, Copilot, AI SDK, ML Kit, etc.\n` +
      `- Frontend: UI frameworks/libraries, CSS, HTML, JS frameworks, state management, web performance metrics — includes React, Next.js, Vue, Angular, Tailwind, GSAP, Redux, TypeScript (when used in frontend context), CWV, etc.\n` +
      `- Mobile: mobile-specific frameworks, build tools and runtimes — includes React Native, Expo, EAS Build, NativeWind, Ionic, Cordova, etc.\n` +
      `- Backend: server-side frameworks, programming languages, runtimes, CMS platforms — includes Node.js, NestJS, Elixir, Phoenix, PHP, Python, Java, C#, .Net, Microservices, Wordpress, Sitecore, Cloud Functions, etc.\n` +
      `- Databases: databases, ORMs, data stores, search engines — includes PostgreSQL, MongoDB, MySQL, Firebase, Firestore, Prisma, Pinecone, GraphQL, Redis, etc.\n` +
      `- Tools & Platforms: cloud infrastructure, SaaS/third-party services, auth providers, payment platforms, analytics SDKs, DevOps and CI/CD tools — includes AWS, Vercel, Clerk, Salesforce, Stytch, Stripe, RevenueCat, AdMob, GitHub, CI/CD, YAML, SEO tools, etc. NOT programming languages or frameworks.\n` +
      `- UI/UX: design tools, design methodologies, accessibility standards, UX practices — includes Figma, A11y, UI/UX Design, UX/UI Design, Responsive Design, etc.\n` +
      `- Others: only use for things that genuinely don't fit any category above.\n\n` +
      `Rules:\n` +
      `- Return ONLY valid JSON: an object where each key is a technology name (exactly as given) and the value is an array of category strings.\n` +
      `- Use ONLY the categories listed above, spelled exactly as shown.\n` +
      `- Most technologies belong to one category. Use two only when genuinely cross-cutting.\n` +
      `- Do not include any explanation, markdown, or code fences — just the raw JSON object.`,
    prompt: `Categorize these technologies:\n${techNames.join("\n")}`,
  });

  try {
    return JSON.parse(text.trim());
  } catch {
    return {};
  }
}

function resolveCategories(techName: string, categorized: Record<string, string[]>): string[] {
  const matchKey = Object.keys(categorized).find(
    (k) => normalize(k) === normalize(techName),
  );
  const rawCats: unknown = matchKey ? categorized[matchKey] : undefined;
  const categories = (Array.isArray(rawCats) ? rawCats : ["Others"]).filter(
    (c): c is string => VALID_CATEGORIES.includes(c),
  );
  return categories.length > 0 ? categories : ["Others"];
}

// POST — sync new techs from experiences
export const POST = async () => {
  const { userId } = auth();
  if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const experiences = await prisma.experience.findMany({ select: { techStack: true } });
  const canonicalByKey = new Map<string, string>();
  for (const exp of experiences) {
    for (const tech of exp.techStack) {
      const t = tech.trim();
      if (!t) continue;
      const key = normalize(t);
      if (!canonicalByKey.has(key)) canonicalByKey.set(key, t);
    }
  }

  const existing = await prisma.technology.findMany({ select: { name: true } });
  const existingKeys = new Set(existing.map((t) => normalize(t.name)));

  const newEntries = Array.from(canonicalByKey.entries()).filter(([key]) => !existingKeys.has(key));

  if (newEntries.length === 0) {
    return Response.json({ created: 0, message: "All technologies already synced." });
  }

  const newTechs = newEntries.map(([, name]) => name);
  const categorized = await categorizeWithClaude(newTechs);
  const results = { created: 0, errors: [] as string[] };

  await Promise.allSettled(
    newTechs.map(async (techName) => {
      const finalCategories = resolveCategories(techName, categorized);
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

// PATCH — re-categorize all existing technologies with the current category set
export const PATCH = async () => {
  const { userId } = auth();
  if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const all = await prisma.technology.findMany({ select: { id: true, name: true } });
  if (all.length === 0) return Response.json({ updated: 0, message: "No technologies found." });

  const categorized = await categorizeWithClaude(all.map((t) => t.name));
  const results = { updated: 0, errors: [] as string[] };

  await Promise.allSettled(
    all.map(async ({ id, name }) => {
      const finalCategories = resolveCategories(name, categorized);
      try {
        await prisma.technology.update({ where: { id }, data: { categories: finalCategories } });
        results.updated++;
      } catch (e) {
        results.errors.push(`${name}: ${e}`);
      }
    }),
  );

  return Response.json(results);
};
