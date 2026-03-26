import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot, Layers, PenTool } from "lucide-react";

const CAPABILITIES = [
  {
    icon: Bot,
    title: "Agentic AI Systems",
    description:
      "RAG pipelines, LLM orchestration, autonomous agents, and vector search. Building AI-native products with Claude, OpenAI, Pinecone, and the Vercel AI SDK.",
    highlight: true,
  },
  {
    icon: Layers,
    title: "Full-Stack Products",
    description:
      "End-to-end web applications with React, Next.js, Node.js, and NestJS. From database design and API architecture to deployment on Vercel and AWS.",
    highlight: false,
  },
  {
    icon: PenTool,
    title: "Frontend Architecture",
    description:
      "Design systems, component libraries, and performance-optimized UIs. Technical leadership for frontend teams — code reviews, standards, and mentoring.",
    highlight: false,
  },
];

export default function WhatIBuild() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-16">
      <h2 className="mb-2 text-center text-3xl font-bold tracking-tight">
        What I Build
      </h2>
      <p className="mb-10 text-center text-muted-foreground">
        15+ years turning complex problems into clean, scalable products.
      </p>
      <div className="grid gap-6 md:grid-cols-3">
        {CAPABILITIES.map(({ icon: Icon, title, description, highlight }) => (
          <Card
            key={title}
            className={
              highlight
                ? "border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/20"
                : ""
            }
          >
            <CardHeader className="pb-3">
              <div
                className={`mb-3 flex h-10 w-10 items-center justify-center rounded-lg ${highlight ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300" : "bg-muted text-muted-foreground"}`}
              >
                <Icon className="h-5 w-5" />
              </div>
              <CardTitle
                className={`text-lg ${highlight ? "text-blue-700 dark:text-blue-300" : ""}`}
              >
                {title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
