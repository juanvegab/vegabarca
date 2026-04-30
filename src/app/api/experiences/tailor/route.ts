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
          "You are a professional resume writer. Given an original experience description and a job description, " +
          "rewrite the experience bullets to highlight the most relevant skills and impact for that specific role. " +
          "Keep the same number of bullets or fewer. Be specific, use action verbs, quantify where possible. " +
          "Return ONLY the bullet text, one per line, with NO leading dashes, hyphens, asterisks, or bullet symbols. No extra commentary.",
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
