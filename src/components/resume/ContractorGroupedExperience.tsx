"use client";

import { useState } from "react";
import Image from "next/image";
import { ExternalLink, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ExperienceWithContractor } from "@/components/SortableExperienceGrid";

interface ContractorGroupedExperienceProps {
  experiences: ExperienceWithContractor[];
}

// ---------- logo helpers ----------

function ContractorLogo({ src, name }: { src: string; name: string }) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-muted text-sm font-bold text-muted-foreground">
        {name[0]}
      </div>
    );
  }
  return (
    <Image
      src={src}
      alt={`${name} logo`}
      width={40}
      height={40}
      className="shrink-0 rounded-md object-contain"
      loading="eager"
      onError={() => setFailed(true)}
    />
  );
}

function SmallLogo({ src, company }: { src: string; company: string }) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-muted text-[10px] font-bold text-muted-foreground">
        {company[0]}
      </div>
    );
  }
  return (
    <Image
      src={src}
      alt={`${company} logo`}
      width={20}
      height={20}
      className="mt-0.5 shrink-0 rounded object-contain"
      loading="eager"
      onError={() => setFailed(true)}
    />
  );
}

// ---------- compact card ----------

function CompactExperienceCard({ exp }: { exp: ExperienceWithContractor }) {
  const [expanded, setExpanded] = useState(false);
  const summary = exp.visibleSummary ?? exp.content;
  const bullets = (summary?.split("\n") ?? []).filter((p) => p.trim() !== "");

  const title = exp.link ? (
    <a
      href={exp.link}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 font-semibold text-sm hover:underline"
    >
      {exp.company} — {exp.position}
      <ExternalLink size={11} className="shrink-0 opacity-60" />
    </a>
  ) : (
    <span className="font-semibold text-sm">
      {exp.company} — {exp.position}
    </span>
  );

  return (
    <div className="flex flex-col rounded-lg border bg-card p-4 shadow-sm print:p-2 print:shadow-none">
      <div className="flex items-start gap-2">
        {exp.companyLogo ? (
          <SmallLogo src={exp.companyLogo} company={exp.company} />
        ) : (
          <div className="h-5 w-5 shrink-0" />
        )}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-1">
            {title}
            {exp.isFeatured && <AgenticBadge />}
          </div>
          <p className="text-xs text-muted-foreground">{exp.dates}</p>
        </div>
      </div>

      {exp.techStack.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {exp.techStack.map((tech) => (
            <Badge key={`${exp.id}_${tech}`} variant="secondary">
              {tech}
            </Badge>
          ))}
        </div>
      )}

      {bullets.length > 0 && (
        <>
          <button
            onClick={() => setExpanded(!expanded)}
            className="mt-2 self-start text-xs text-muted-foreground underline-offset-2 hover:text-foreground hover:underline transition-colors print:hidden"
          >
            {expanded ? "Hide details ↑" : "Details ↓"}
          </button>
          {expanded && (
            <ul className="mt-2 list-disc space-y-0.5 pl-4 text-sm print:hidden">
              {bullets.map((b, i) => (
                <li key={i}>{b.replace(/^[-•*]\s*/, "")}</li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
}

// ---------- sub-components ----------

function AgenticBadge({ header = false }: { header?: boolean }) {
  const base = "inline-flex items-center gap-1 rounded-full font-medium";
  if (header) {
    return (
      <span className={`${base} bg-amber-100 px-2 py-0.5 text-xs text-amber-800 dark:bg-amber-900 dark:text-amber-200`}>
        <Sparkles size={10} />
        Agentic AI
      </span>
    );
  }
  return (
    <span className={`${base} bg-amber-200 px-1.5 py-0.5 text-[10px] text-amber-900 dark:bg-amber-800 dark:text-amber-100`}>
      <Sparkles size={9} />
      Agentic AI
    </span>
  );
}

function CompactSubProject({ exp }: { exp: ExperienceWithContractor }) {
  const [expanded, setExpanded] = useState(false);
  const summary = exp.visibleSummary ?? exp.content;
  const bullets = (summary?.split("\n") ?? []).filter((p) => p.trim() !== "");

  const title = exp.link ? (
    <a
      href={exp.link}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 font-semibold text-sm hover:underline"
    >
      {exp.company} — {exp.position}
      <ExternalLink size={11} className="shrink-0 opacity-60" />
    </a>
  ) : (
    <span className="font-semibold text-sm">
      {exp.company} — {exp.position}
    </span>
  );

  return (
    <li className="col-span-1 flex flex-col gap-1">
      <div className="flex items-start gap-2">
        {exp.companyLogo ? (
          <SmallLogo src={exp.companyLogo} company={exp.company} />
        ) : (
          <div className="h-5 w-5 shrink-0" />
        )}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-1">
            {title}
            {exp.isFeatured && <AgenticBadge />}
          </div>
          <p className="text-xs text-muted-foreground">{exp.dates}</p>
        </div>
      </div>
      {exp.techStack.length > 0 && (
        <div className="ml-7 flex flex-wrap gap-1">
          {exp.techStack.map((tech) => (
            <Badge key={`${exp.id}_${tech}`} variant="secondary">
              {tech}
            </Badge>
          ))}
        </div>
      )}
      {bullets.length > 0 && (
        <>
          <button
            onClick={() => setExpanded(!expanded)}
            className="ml-7 self-start text-xs text-muted-foreground underline-offset-2 hover:text-foreground hover:underline transition-colors print:hidden"
          >
            {expanded ? "Hide details ↑" : "Details ↓"}
          </button>
          {expanded && (
            <ul className="ml-7 list-disc space-y-0.5 pl-4 text-sm print:hidden">
              {bullets.map((b, i) => (
                <li key={i}>{b.replace(/^[-•*]\s*/, "")}</li>
              ))}
            </ul>
          )}
        </>
      )}
    </li>
  );
}

function SubProject({ exp }: { exp: ExperienceWithContractor }) {
  const summary = exp.visibleSummary ?? exp.content;
  const bullets = (summary?.split("\n") ?? []).filter((p) => p.trim() !== "");

  const liClass = [
    "col-span-1 sm:col-span-2",
    exp.isFeatured
      ? "print:break-inside-avoid rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 dark:border-amber-700 dark:bg-amber-950/20"
      : "",
  ].join(" ");

  const title = exp.link ? (
    <a
      href={exp.link}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 font-semibold hover:underline"
    >
      {exp.company} — {exp.position}
      <ExternalLink size={12} className="shrink-0 opacity-60" />
    </a>
  ) : (
    <span className="font-semibold">
      {exp.company} — {exp.position}
    </span>
  );

  return (
    <li className={liClass}>
      <div className="flex items-start gap-2">
        {exp.companyLogo ? (
          <SmallLogo src={exp.companyLogo} company={exp.company} />
        ) : (
          <div className="h-5 w-5 shrink-0" />
        )}
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2">
            {title}
            {exp.isFeatured && <AgenticBadge />}
          </div>
          <p className="mb-1.5 text-xs text-muted-foreground print:mb-0.5">{exp.dates}</p>
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
                <li key={i}>{b.replace(/^[-•*]\s*/, "")}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </li>
  );
}

function UngroupedItem({ exp }: { exp: ExperienceWithContractor }) {
  const summary = exp.visibleSummary ?? exp.content;
  const bullets = (summary?.split("\n") ?? []).filter((p) => p.trim() !== "");

  const title = exp.link ? (
    <a
      href={exp.link}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 font-semibold hover:underline"
    >
      {exp.company} — {exp.position}
      <ExternalLink size={12} className="shrink-0 opacity-60" />
    </a>
  ) : (
    <span className="font-semibold">
      {exp.company} — {exp.position}
    </span>
  );

  const wrapClass = exp.isFeatured
    ? "print:break-inside-avoid flex items-start gap-3 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 dark:border-amber-700 dark:bg-amber-950/20"
    : "flex items-start gap-3";

  return (
    <div className={wrapClass}>
      {exp.companyLogo ? (
        <SmallLogo src={exp.companyLogo} company={exp.company} />
      ) : (
        <div className="h-5 w-5 shrink-0" />
      )}
      <div className="flex-1">
        <div className="flex flex-wrap items-center gap-2">
          {title}
          {exp.isFeatured && <AgenticBadge />}
        </div>
        <p className="mb-1.5 text-sm text-muted-foreground print:mb-0.5">{exp.dates}</p>
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
              <li key={i}>{b.replace(/^[-•*]\s*/, "")}</li>
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
  const sorted = [...experiences].sort((a, b) => b.order - a.order);

  const groupMap = new Map<string, ExperienceWithContractor[]>();

  for (const exp of sorted) {
    if (exp.contractorCompany) {
      const key = exp.contractorCompanyId!;
      groupMap.set(key, [...(groupMap.get(key) ?? []), exp]);
    }
  }

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

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 print:gap-3 items-start">
        {renderItems.map((item) => {
          if (item.kind === "single") {
            if (item.exp.isCompact) {
              return <CompactExperienceCard key={item.exp.id} exp={item.exp} />;
            }
            return (
              <div key={item.exp.id} className="col-span-1 sm:col-span-2">
                <UngroupedItem exp={item.exp} />
              </div>
            );
          }

          const { exps } = item;
          const company = exps[0].contractorCompany!;
          const hasAgentic = exps.some((e) => e.isFeatured);

          const newestDates = exps[0].dates;
          const oldestDates = exps[exps.length - 1].dates;
          const dateRange =
            newestDates === oldestDates
              ? newestDates
              : `${oldestDates} – ${newestDates}`;

          const companyName = company.url ? (
            <a
              href={company.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-bold hover:underline"
            >
              {company.name}
              <ExternalLink size={13} className="shrink-0 opacity-60" />
            </a>
          ) : (
            <span className="font-bold">{company.name}</span>
          );

          return (
            <div
              key={item.key}
              className="col-span-1 sm:col-span-2 rounded-lg border bg-card p-5 shadow-sm print:p-3 print:shadow-none"
            >
              {/* Umbrella header */}
              <div className="mb-4 flex items-center gap-3 print:mb-1">
                {company.logo ? (
                  <ContractorLogo src={company.logo} name={company.name} />
                ) : (
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-muted text-sm font-bold text-muted-foreground">
                    {company.name[0]}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-base">{companyName}</h3>
                    {hasAgentic && <AgenticBadge header />}
                  </div>
                  <p className="text-xs text-muted-foreground">{dateRange}</p>
                </div>
              </div>

              {/* Sub-projects */}
              <ol className="grid grid-cols-1 gap-3 sm:grid-cols-2 items-start border-l border-border pl-5 print:border-0 print:pl-4 print:gap-2">
                {exps.map((exp) =>
                  exp.isCompact ? (
                    <CompactSubProject key={exp.id} exp={exp} />
                  ) : (
                    <SubProject key={exp.id} exp={exp} />
                  )
                )}
              </ol>
            </div>
          );
        })}
      </div>
    </section>
  );
}
