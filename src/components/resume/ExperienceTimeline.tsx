"use client";

import { Experience } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { Sparkles } from "lucide-react";
import { useState } from "react";

interface ExperienceTimelineProps {
  experiences: Experience[];
}

function CompanyLogo({ src, company }: { src: string; company: string }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded bg-muted text-xs font-bold text-muted-foreground">
        {company[0]}
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={`${company} logo`}
      width={32}
      height={32}
      className="mt-0.5 shrink-0 rounded object-contain"
      onError={() => setFailed(true)}
    />
  );
}

export default function ExperienceTimeline({
  experiences,
}: ExperienceTimelineProps) {
  const sorted = [...experiences].sort((a, b) => b.order - a.order);

  return (
    <section aria-labelledby="experience-heading" className="mb-8">
      <h2
        id="experience-heading"
        className="mb-4 text-xl font-bold tracking-tight"
      >
        Experience
      </h2>

      <ol className="relative border-l border-border pl-6">
        {sorted.map((exp) => {
          const summary = exp.visibleSummary ?? exp.content;
          const bullets = (summary?.split("\n") || []).filter(
            (p) => p.trim() !== "",
          );

          return (
            <li key={exp.id} className="mb-8 last:mb-0">
              <span className="absolute -left-1.5 mt-1.5 h-3 w-3 rounded-full border border-background bg-blue-500" />

              <div className="flex flex-wrap items-start gap-2">
                {exp.companyLogo ? (
                  <CompanyLogo src={exp.companyLogo} company={exp.company} />
                ) : (
                  <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded bg-muted text-xs font-bold text-muted-foreground">
                    {exp.company[0]}
                  </div>
                )}
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-lg font-semibold">
                      {exp.company} — {exp.position}
                    </h3>
                    {exp.isFeatured && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                        <Sparkles size={10} />
                        Agentic AI
                      </span>
                    )}
                    {exp.visibleSummary && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700 dark:bg-green-900 dark:text-green-300">
                        <Sparkles size={10} />
                        Tailored
                      </span>
                    )}
                  </div>
                  <p className="mb-2 text-sm text-muted-foreground">
                    {exp.dates}
                  </p>

                  {exp.techStack.length > 0 && (
                    <div className="mb-3 flex flex-wrap gap-1">
                      {exp.techStack.map((tech) => (
                        <Badge key={`${exp.id}_${tech}`} variant="secondary">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {bullets.length > 0 && (
                    <ul className="list-disc space-y-1 pl-4 text-sm">
                      {bullets.map((bullet, i) => (
                        <li key={i}>{bullet}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
