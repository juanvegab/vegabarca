import prisma from "@/lib/db/prisma";
import { anthropic } from "@ai-sdk/anthropic";
import { generateText } from "ai";
import { auth } from "@clerk/nextjs";

export const maxDuration = 60;

export const POST = async (req: Request) => {
  const { userId } = auth();
  if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { jobDescription } = await req.json();
  if (!jobDescription?.trim())
    return Response.json({ error: "jobDescription is required" }, { status: 400 });

  const experiences = await prisma.experience.findMany({
    orderBy: { order: "desc" },
  });

  const results: { id: string; company: string; position: string; visibleSummary: string }[] = [];

  await Promise.all(
    experiences.map(async (exp) => {
      if (!exp.content?.trim()) return;

      const { text } = await generateText({
        model: anthropic("claude-sonnet-4-6"),
        system:
          "You are a professional resume writer specializing in concise, high-impact bullet points.\n\n" +
          "Rules (follow strictly):\n" +
          "1. Output a MAXIMUM of 4 bullets per experience — fewer is fine if the content doesn't justify 4.\n" +
          "2. Each bullet must be 230 characters or fewer (including spaces).\n" +
          "3. Each bullet must start with a strong action verb.\n" +
          "4. Structure each bullet to cover one or more of: the TASK performed, the TECHNOLOGIES used, and the IMPACT or outcome.\n" +
          "5. If AI tools were used in the work (e.g. Claude, OpenAI, agentic workflows, prompt engineering, LLMs), highlight that explicitly and describe HOW it was applied.\n" +
          "6. Naturally reflect the tech stack in the bullets — do not list technologies separately.\n" +
          "7. Tailor the bullets to match the job description's priorities and language.\n" +
          "8. Return ONLY the bullet lines, one per line, with NO leading dashes, hyphens, asterisks, or bullet symbols. No headers, no commentary.",
        prompt:
          `Job Description:\n${jobDescription}\n\n` +
          `Experience: ${exp.position} at ${exp.company}\n` +
          `Tech Stack: ${exp.techStack.join(", ")}\n\n` +
          `Original bullets:\n${exp.content}`,
      });

      await prisma.experience.update({
        where: { id: exp.id },
        data: { visibleSummary: text.trim() },
      });

      results.push({ id: exp.id, company: exp.company, position: exp.position, visibleSummary: text.trim() });
    }),
  );

  return Response.json({ tailored: results.length, results });
};

export const DELETE = async () => {
  const { userId } = auth();
  if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 });

  await prisma.experience.updateMany({ data: { visibleSummary: null } });

  return Response.json({ message: "Cleared all tailored summaries" });
};
