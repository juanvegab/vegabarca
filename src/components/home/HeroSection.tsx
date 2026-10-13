"use client";

import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Bot, GraduationCap, Calendar, Layers, Download } from "lucide-react";
import { useChatContext } from "@/contexts/ChatContext";
import gsap from "gsap";

export default function HeroSection() {
  const { openChat } = useChatContext();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from("[data-hero]", {
        y: 24,
        opacity: 0,
        duration: 0.7,
        stagger: 0.12,
        ease: "power2.out",
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section className="mx-auto max-w-5xl px-4 py-20 md:py-28">
      <div ref={containerRef} className="flex flex-col items-start gap-6">
        <Badge
          data-hero
          className="border-amber-300 bg-amber-50 text-amber-800 dark:border-amber-700 dark:bg-amber-950/30 dark:text-amber-300"
          variant="outline"
        >
          ✦ Open to senior roles
        </Badge>

        <div data-hero className="flex flex-col gap-1">
          <p className="text-xl font-semibold tracking-wide">
            Juan Carlos Vega Abarca
          </p>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Senior Full-Stack Engineer
            <br />
            <span className="text-blue-600 dark:text-blue-400">AI/LLM Applications</span>
          </h1>
        </div>

        <p
          data-hero
          className="max-w-2xl text-lg text-muted-foreground sm:text-xl"
        >
          Senior Full-Stack Engineer with 15+ years building web and mobile
          applications with React, Next.js, React Native, TypeScript and Node.js.
          Experienced in agentic coding workflows (Claude Code, Cursor) and in
          building LLM applications with the Claude and OpenAI APIs, Vercel AI
          SDK and RAG.
        </p>

        <div data-hero className="flex flex-wrap gap-3">
          <span className="flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm font-medium">
            <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
            15+ Years Experience
          </span>
          <span className="flex items-center gap-1.5 rounded-full border border-amber-300 bg-amber-50 px-3 py-1 text-sm font-medium text-amber-800 dark:border-amber-700 dark:bg-amber-950/30 dark:text-amber-300">
            <GraduationCap className="h-3.5 w-3.5" />
            Applied AI & Data Science — MIT Certification
          </span>
          <span className="flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm font-medium">
            <Layers className="h-3.5 w-3.5 text-muted-foreground" />
            Full-Stack
          </span>
        </div>

        <div data-hero className="flex flex-wrap gap-3 pt-2">
          <Button size="lg" asChild>
            <Link href="/resume">
              <Download className="mr-2 h-5 w-5" />
              Resume
            </Link>
          </Button>
          <Button size="lg" variant="outline" onClick={openChat} aria-label="Ask the AI assistant about Juan Carlos">
            <Bot className="mr-2 h-5 w-5" />
            Ask My AI
          </Button>
        </div>
      </div>
    </section>
  );
}
