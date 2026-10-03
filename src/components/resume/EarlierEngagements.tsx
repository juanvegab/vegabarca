"use client";

import Image from "next/image";
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

function InlineLogo({ src, company }: { src: string; company: string }) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <span className="inline-flex h-4 w-4 shrink-0 items-center justify-center rounded bg-muted text-[8px] font-bold text-muted-foreground">
        {company[0]}
      </span>
    );
  }
  return (
    <Image
      src={src}
      alt={`${company} logo`}
      width={16}
      height={16}
      className="inline-block h-4 w-4 shrink-0 rounded object-contain"
      loading="eager"
      onError={() => setFailed(true)}
    />
  );
}

function EngagementRow({ exp }: { exp: ExperienceWithContractor }) {
  const [expanded, setExpanded] = useState(false);
  const summary = exp.visibleSummary ?? exp.content;
  const bullets = (summary?.split("\n") ?? []).filter((b) => b.trim() !== "");

  return (
    <li className="text-sm print:text-[8.5pt]">
      <div className="flex items-center justify-between gap-4">
        <span className="flex items-center gap-1.5">
          {exp.companyLogo && (
            <InlineLogo src={exp.companyLogo} company={exp.company} />
          )}
          <span className="font-medium text-foreground">{exp.company}</span>
          <span className="text-muted-foreground">
            — {exp.position}
            {exp.contractorCompany && (
              <span className="text-muted-foreground/70"> at {exp.contractorCompany.name}</span>
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
        <span className="shrink-0 tabular-nums text-muted-foreground">
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
    <section aria-labelledby="earlier-heading" className="mb-8 print:mt-4 print:break-before-avoid">
      <h2
        id="earlier-heading"
        className="mb-3 text-xl font-bold tracking-tight print:break-after-avoid"
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
