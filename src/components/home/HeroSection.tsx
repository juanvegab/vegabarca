"use client";

import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Bot, GraduationCap, Calendar, Layers, FileText } from "lucide-react";
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
          ✦ Available for new opportunities
        </Badge>

        <h1
          data-hero
          className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl"
        >
          Agentic AI &amp;
          <br />
          Full-Stack Engineer
        </h1>

        <p
          data-hero
          className="max-w-2xl text-lg text-muted-foreground sm:text-xl"
        >
          15+ years building products people love — from early-stage startups to
          global platforms. Now leading with AI: RAG pipelines, LLM
          orchestration, and agentic workflows that ship.
        </p>

        <div data-hero className="flex flex-wrap gap-3">
          <span className="flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm font-medium">
            <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
            15+ Years Experience
          </span>
          <span className="flex items-center gap-1.5 rounded-full border border-amber-300 bg-amber-50 px-3 py-1 text-sm font-medium text-amber-800 dark:border-amber-700 dark:bg-amber-950/30 dark:text-amber-300">
            <GraduationCap className="h-3.5 w-3.5" />
            MIT AI Certified
          </span>
          <span className="flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm font-medium">
            <Layers className="h-3.5 w-3.5 text-muted-foreground" />
            Full-Stack
          </span>
        </div>

        <div data-hero className="flex flex-wrap gap-3 pt-2">
          <Button size="lg" onClick={openChat}>
            <Bot className="mr-2 h-5 w-5" />
            Chat with my AI
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/resume">
              <FileText className="mr-2 h-5 w-5" />
              View Resume
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
