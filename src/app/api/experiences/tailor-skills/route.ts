import prisma from "@/lib/db/prisma";
import { anthropic } from "@ai-sdk/anthropic";
import { generateText } from "ai";
import { auth } from "@clerk/nextjs";

export const maxDuration = 60;

const VALID_CATEGORIES = ["Languages", "Frontend", "Mobile", "Backend & Data", "AI / LLM", "Agentic Coding", "Tools & Platforms", "UI/UX", "Others"];

const normalize = (s: string) => s.toLowerCase().replace(/[\s\-_.]/g, "");

export const POST = async (req: Request) => {
  const { userId } = auth();
  if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { jobDescription } = await req.json();

  const [experiences, technologies] = await Promise.all([
    prisma.experience.findMany({ orderBy: { order: "desc" } }),
    prisma.technology.findMany({ select: { id: true, name: true } }),
  ]);

  const experienceData = experiences
    .map(
      (e) =>
        `${e.position} at ${e.company} (${e.dates})\n` +
        `Tags: ${e.techStack.join(", ")}\n` +
        (e.content ? e.content : ""),
    )
    .join("\n\n---\n\n");

  const { text } = await generateText({
    model: anthropic("claude-sonnet-4-6"),
    system:
      `You are a resume optimization assistant for a Senior Full-Stack Engineer targeting remote AI/LLM product roles.\n\n` +
      `Your task: select and organize the Skills section. Output must be ATS-friendly and recruiter-friendly.\n\n` +
      `CATEGORIES (use exactly these names, in this order):\n` +
      `${VALID_CATEGORIES.join(", ")}\n\n` +
      `SELECTION RULES:\n` +
      `1. Evidence-based only: include a skill only if it appears in the experience data. Never invent skills.\n` +
      `2. Prioritize recency: skills from the last 3 years and AI/LLM work come first. Skills only in roles older than 5 years are excluded unless core to the target role.\n` +
      `3. If a job description is provided, prioritize skills that match it using the JD's exact wording.\n` +
      `4. Exclude legacy/low-value technologies unless in recent work: Angular 8, AngularJS, jQuery, Jekyll, PHP, WordPress, .Net, Salesforce, Vue.js, Java, C#.\n` +
      `5. Exclude project-specific services that don't help a recruiter: Clerk, RevenueCat, AdMob, Stytch. These belong in project bullets.\n` +
      `6. Exclude vague terms: "AI", "Gen AI", "AI Tooling", "PDFProcessing", "UI/UX" variants. Use specific terms instead.\n` +
      `7. Deduplicate: one entry per technology.\n` +
      `8. Limit: max 45 skills total, max 12 per category.\n\n` +
      `CANONICAL NAMES (use exactly): TypeScript, JavaScript, Next.js, Node.js, React, React Native, Claude API, OpenAI API, Vercel AI SDK, GitHub Copilot, Claude Code, Cursor, Tailwind CSS, Core Web Vitals, Accessibility (WCAG), SEO, CI/CD, RAG, LangChain, LangSmith, RAGAS, Pinecone, Prompt Engineering, Agentic Pipelines.\n\n` +
      `OUTPUT FORMAT — return ONLY valid JSON, no markdown, no explanation:\n` +
      `{\n` +
      `  "skills": { "Category Name": ["Skill", "Skill", ...], ... },\n` +
      `  "hidden": ["TechName", ...]\n` +
      `}\n` +
      `"hidden" is the list of technology names that should be hidden from the resume (legacy, excluded, or vague).`,
    prompt:
      `Experience data:\n${experienceData}\n\n` +
      (jobDescription?.trim() ? `Job Description:\n${jobDescription}\n\n` : `Job Description: none\n\n`) +
      `Now select and organize the skills.`,
  });

  let parsed: { skills: Record<string, string[]>; hidden: string[] };
  try {
    parsed = JSON.parse(text.trim());
  } catch {
    return Response.json({ error: "Failed to parse AI response", raw: text }, { status: 500 });
  }

  // Build a normalized lookup of existing Technology records
  const techByKey = new Map(technologies.map((t) => [normalize(t.name), t]));

  const results = { updated: 0, hidden: 0, notFound: [] as string[] };

  // Update categories for skills that appear in the output
  for (const [category, skills] of Object.entries(parsed.skills)) {
    if (!VALID_CATEGORIES.includes(category)) continue;
    for (const skillName of skills) {
      const tech = techByKey.get(normalize(skillName));
      if (!tech) { results.notFound.push(skillName); continue; }
      await prisma.technology.update({
        where: { id: tech.id },
        data: { categories: [category], isHidden: false },
      });
      results.updated++;
    }
  }

  // Hide technologies flagged by the AI
  for (const skillName of parsed.hidden ?? []) {
    const tech = techByKey.get(normalize(skillName));
    if (!tech) continue;
    await prisma.technology.update({ where: { id: tech.id }, data: { isHidden: true } });
    results.hidden++;
  }

  return Response.json({ ...results, categories: Object.keys(parsed.skills) });
};

// DELETE — restore all hidden technologies
export const DELETE = async () => {
  const { userId } = auth();
  if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 });

  await prisma.technology.updateMany({ data: { isHidden: false } });
  return Response.json({ message: "All technologies restored to visible." });
};
