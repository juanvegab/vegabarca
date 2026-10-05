"use client";

import { useState } from "react";
import { ExperienceWithContractor } from "@/components/SortableExperienceGrid";

interface EarlierEngagementsProps {
  experiences: ExperienceWithContractor[];
}

function extractYears(dates: string): string {
  const years = dates.match(/\d{4}/g);
  if (!years || years.length === 0) return dates;
  const first = years[0];
  const last = years[years.length - 1];
  return first === last ? first : `${first} – ${last}`;
}

function EngagementRow({ exp }: { exp: ExperienceWithContractor }) {
  const [expanded, setExpanded] = useState(false);
  const summary = exp.visibleSummary ?? exp.content;
  const bullets = (summary?.split("\n") ?? []).filter((b) => b.trim() !== "");

  return (
    <li className="text-sm print:text-[8.5pt]">
      <div className="flex items-center justify-between gap-4">
        <span className="flex items-center gap-1.5">
          <span className="font-medium text-foreground">{exp.company}</span>
          <span className="text-foreground/80">
            — {exp.position}
            {exp.contractorCompany && (
              <span className="text-foreground/60"> at {exp.contractorCompany.name}</span>
            )}
          </span>
          {bullets.length > 0 && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="print:hidden ml-1 text-xs text-muted-foreground underline-offset-2 hover:text-foreground hover:underline transition-colors"
            >
              {expanded ? "less ↑" : "more ↓"}
            </button>
          )}
        </span>
        <span className="shrink-0 tabular-nums text-foreground/70">
          {extractYears(exp.dates)}
        </span>
      </div>
      {exp.techStack.length > 0 && (
        <p className="mt-0.5 pl-5 text-xs text-muted-foreground">
          {exp.techStack.join(", ")}
        </p>
      )}
      {expanded && bullets.length > 0 && (
        <ul className="print:hidden mt-2 list-disc space-y-0.5 pl-9 text-sm text-muted-foreground">
          {bullets.map((b, i) => (
            <li key={i}>{b.replace(/^[-•*]\s*/, "")}</li>
          ))}
        </ul>
      )}
    </li>
  );
}

export default function EarlierEngagements({ experiences }: EarlierEngagementsProps) {
  if (experiences.length === 0) return null;

  const sorted = [...experiences].sort((a, b) => b.order - a.order);

  return (
    <section aria-labelledby="earlier-heading" className="mb-8 print:mt-8 print:break-before-avoid">
      <h2
        id="earlier-heading"
        className="mb-3 text-xl font-bold tracking-tight print:text-sm print:uppercase print:tracking-wide print:border-b print:border-gray-400 print:pb-0.5 print:break-after-avoid"
      >
        Previous Experience
      </h2>
      <ul className="space-y-2">
        {sorted.map((exp) => (
          <EngagementRow key={exp.id} exp={exp} />
        ))}
      </ul>
    </section>
  );
}
