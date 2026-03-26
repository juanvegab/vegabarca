import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Juan Carlos Vega — Resume | Agentic AI & Full-Stack Engineer",
  description:
    "Resume of Juan Carlos Vega Abarca — Agentic AI & Full-Stack Engineer with 15+ years of experience. MIT Applied AI & Data Science certification. Expert in LLMs, Agentic AI, React, Next.js, TypeScript.",
  keywords: [
    "Juan Carlos Vega",
    "Agentic AI Engineer",
    "Full-Stack Developer",
    "Frontend Engineer",
    "React",
    "Next.js",
    "TypeScript",
    "Large Language Models",
    "LLMs",
    "Agentic AI",
    "AI Agents",
    "Prompt Engineering",
    "RAG",
    "Vercel AI SDK",
    "Claude API",
    "OpenAI",
    "Machine Learning",
    "MIT Professional Education",
    "Costa Rica",
    "Software Engineer",
  ],
  openGraph: {
    title: "Juan Carlos Vega — Agentic AI & Full-Stack Engineer",
    description:
      "15+ years of software engineering. MIT Applied AI & Data Science certified. Specialized in Agentic AI, LLMs, and full-stack web development.",
    type: "profile",
  },
};

export default function ResumeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
