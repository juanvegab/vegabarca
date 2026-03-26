"use client";

import { useState } from "react";
import Image from "next/image";
import { Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ExperienceWithContractor } from "@/components/SortableExperienceGrid";

interface ContractorGroupedExperienceProps {
  experiences: ExperienceWithContractor[];
}

// ---------- helpers ----------

function ContractorLogo({
  src,
  name,
  size = 40,
}: {
  src: string;
  name: string;
  size?: number;
}) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <div
        style={{ width: size, height: size }}
        className="flex shrink-0 items-center justify-center rounded-md bg-muted text-sm font-bold text-muted-foreground"
      >
        {name[0]}
      </div>
    );
  }
  return (
    <Image
      src={src}
      alt={`${name} logo`}
      width={size}
      height={size}
      className="shrink-0 rounded-md object-contain"
      onError={() => setFailed(true)}
    />
  );
}

function AgenticBadge({ small = false }: { small?: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full bg-blue-100 font-medium text-blue-700 dark:bg-blue-900 dark:text-blue-300 ${
        small ? "px-1.5 py-0.5 text-[10px]" : "px-2 py-0.5 text-xs"
      }`}
    >
      <Sparkles size={small ? 9 : 11} />
      Agentic AI
    </span>
  );
}

// ---------- render helpers ----------

function SubProject({ exp }: { exp: ExperienceWithContractor }) {
  const bullets = (exp.content?.split("\n") ?? []).filter(
    (p) => p.trim() !== "",
  );

  return (
    <li className="break-inside-avoid">
      <div className="flex flex-wrap items-center gap-2">
        <h4 className="font-semibold">
          {exp.company} — {exp.position}
        </h4>
        {exp.isFeatured && <AgenticBadge small />}
      </div>
      <p className="mb-1.5 text-xs text-muted-foreground">{exp.dates}</p>
      {exp.techStack.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-1">
          {exp.techStack.map((tech) => (
            <Badge key={`${exp.id}_${tech}`} variant="secondary">
              {tech}
            </Badge>
          ))}
        </div>
      )}
      {bullets.length > 0 && (
        <ul className="list-disc space-y-0.5 pl-4 text-sm">
          {bullets.map((b, i) => (
            <li key={i}>{b}</li>
          ))}
        </ul>
      )}
    </li>
  );
}

function UngroupedItem({ exp }: { exp: ExperienceWithContractor }) {
  const bullets = (exp.content?.split("\n") ?? []).filter(
    (p) => p.trim() !== "",
  );

  return (
    <div className="break-inside-avoid mb-6 flex items-start gap-3">
      {exp.companyLogo ? (
        <ContractorLogo src={exp.companyLogo} name={exp.company} size={32} />
      ) : (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-muted text-xs font-bold text-muted-foreground">
          {exp.company[0]}
        </div>
      )}
      <div className="flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="font-semibold">
            {exp.company} — {exp.position}
          </h3>
          {exp.isFeatured && <AgenticBadge small />}
        </div>
        <p className="mb-1.5 text-sm text-muted-foreground">{exp.dates}</p>
        {exp.techStack.length > 0 && (
          <div className="mb-2 flex flex-wrap gap-1">
            {exp.techStack.map((tech) => (
              <Badge key={`${exp.id}_${tech}`} variant="secondary">
                {tech}
              </Badge>
            ))}
          </div>
        )}
        {bullets.length > 0 && (
          <ul className="list-disc space-y-0.5 pl-4 text-sm">
            {bullets.map((b, i) => (
              <li key={i}>{b}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

// ---------- main component ----------

export default function ContractorGroupedExperience({
  experiences,
}: ContractorGroupedExperienceProps) {
  // Sort ascending by order field (lowest order = oldest = shown last when we want newest first)
  const sorted = [...experiences].sort((a, b) => b.order - a.order);

  // Build a Map: contractorCompanyId → experiences[]
  // and collect ungrouped ones
  const groupMap = new Map<string, ExperienceWithContractor[]>();
  const ungrouped: ExperienceWithContractor[] = [];

  for (const exp of sorted) {
    if (exp.contractorCompany) {
      const key = exp.contractorCompanyId!;
      groupMap.set(key, [...(groupMap.get(key) ?? []), exp]);
    } else {
      ungrouped.push(exp);
    }
  }

  // Build a flat render list interleaving groups and ungrouped items
  // Each item in the list is either a contractor group or a single ungrouped experience.
  // We determine position by the highest `order` value in each group (since we sorted descending,
  // the first element of each group has the highest order = most recent).
  type RenderItem =
    | { kind: "group"; key: string; exps: ExperienceWithContractor[] }
    | { kind: "single"; exp: ExperienceWithContractor };

  const renderItems: RenderItem[] = [];
  const addedGroups = new Set<string>();

  for (const exp of sorted) {
    if (exp.contractorCompany) {
      const key = exp.contractorCompanyId!;
      if (!addedGroups.has(key)) {
        addedGroups.add(key);
        renderItems.push({ kind: "group", key, exps: groupMap.get(key)! });
      }
    } else {
      renderItems.push({ kind: "single", exp });
    }
  }

  return (
    <section aria-labelledby="experience-heading" className="mb-8">
      <h2
        id="experience-heading"
        className="mb-6 text-xl font-bold tracking-tight"
      >
        Experience
      </h2>

      <div className="flex flex-col gap-6">
        {renderItems.map((item, idx) => {
          if (item.kind === "single") {
            return <UngroupedItem key={item.exp.id} exp={item.exp} />;
          }

          // Contractor group card
          const { exps } = item;
          const company = exps[0].contractorCompany!;
          const hasAgentic = exps.some((e) => e.isFeatured);

          // Date range: first item in sorted list = most recent, last = oldest
          const newestDates = exps[0].dates;
          const oldestDates = exps[exps.length - 1].dates;
          const dateRange =
            newestDates === oldestDates
              ? newestDates
              : `${oldestDates} – ${newestDates}`;

          return (
            <div
              key={item.key}
              className="break-inside-avoid rounded-lg border bg-card p-5 shadow-sm print:shadow-none print:border-border"
            >
              {/* Umbrella header */}
              <div className="mb-4 flex items-center gap-3">
                {company.logo ? (
                  <ContractorLogo src={company.logo} name={company.name} size={40} />
                ) : (
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-muted text-sm font-bold text-muted-foreground">
                    {company.name[0]}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-base font-bold">{company.name}</h3>
                    {hasAgentic && <AgenticBadge />}
                  </div>
                  <p className="text-xs text-muted-foreground">{dateRange}</p>
                </div>
              </div>

              {/* Sub-projects */}
              <ol className="space-y-5 border-l border-border pl-5">
                {exps.map((exp) => (
                  <SubProject key={exp.id} exp={exp} />
                ))}
              </ol>
            </div>
          );
        })}
      </div>
    </section>
  );
}
