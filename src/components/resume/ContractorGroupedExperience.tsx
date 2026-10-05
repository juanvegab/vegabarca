"use client";

import { useState } from "react";
import Image from "next/image";
import { ExternalLink } from "lucide-react";
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

// ---------- sub-components ----------

const ENGAGEMENT_LABELS: Record<string, string> = {
  "full-time": "Full-time",
  "part-time": "Part-time",
  contract: "Contract",
  freelance: "Freelance",
};

function engagementLabel(type: string): string {
  return ENGAGEMENT_LABELS[type] ?? type;
}

function EngagementTypeBadge({ type }: { type: string }) {
  const label = engagementLabel(type);
  return (
    <span className="inline-flex items-center rounded-full border px-1.5 py-0 text-[10px] font-medium text-muted-foreground print:hidden">
      {label}
    </span>
  );
}

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
      <span>{exp.company}</span>
      {" "}<span className="print:text-blue-600 print:font-normal">— {exp.position}</span>
      <ExternalLink size={11} className="shrink-0 opacity-60 print:hidden" />
    </a>
  ) : (
    <span className="font-semibold text-sm">
      <span>{exp.company}</span>
      {" "}<span className="print:text-blue-600 print:font-normal">— {exp.position}</span>
    </span>
  );

  return (
    <div className="flex flex-col rounded-lg border bg-card p-4 shadow-sm print:p-2 print:shadow-none">
      <div className="flex items-start gap-2">
        {/* Logo: web only */}
        <span className="print:hidden shrink-0">
          {exp.companyLogo ? (
            <SmallLogo src={exp.companyLogo} company={exp.company} />
          ) : (
            <div className="h-5 w-5" />
          )}
        </span>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-1">
            {title}
            {exp.engagementType && (
              <span className="font-normal hidden print:inline"> — {engagementLabel(exp.engagementType)}</span>
            )}
          </div>
          <div className="flex items-center gap-1.5">
            <p className="text-xs text-muted-foreground">{exp.dates.replace(/ - /g, " – ")}</p>
            {exp.engagementType && <EngagementTypeBadge type={exp.engagementType} />}
          </div>
        </div>
      </div>

      {exp.techStack.length > 0 && (
        <p className="mt-1 text-xs text-muted-foreground">{exp.techStack.join(", ")}</p>
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

function CompactSubProject({ exp }: { exp: ExperienceWithContractor }) {
  const [expanded, setExpanded] = useState(false);
  const summary = exp.visibleSummary ?? exp.content;
  const bullets = (summary?.split("\n") ?? []).filter((p) => p.trim() !== "");

  const title = exp.link ? (
    <a
      href={exp.link}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 font-semibold text-sm hover:underline print:text-blue-600"
    >
      {exp.company} — {exp.position}
      <ExternalLink size={11} className="shrink-0 opacity-60 print:hidden" />
    </a>
  ) : (
    <span className="font-semibold text-sm print:text-blue-600 print:font-normal">
      {exp.company} — {exp.position}
    </span>
  );

  return (
    <li className="col-span-1 flex flex-col gap-1">
      <div className="flex items-start gap-2">
        {/* Logo: web only */}
        <span className="print:hidden shrink-0">
          {exp.companyLogo ? (
            <SmallLogo src={exp.companyLogo} company={exp.company} />
          ) : (
            <div className="h-5 w-5" />
          )}
        </span>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-1">
            {title}
            {exp.engagementType && (
              <span className="font-normal hidden print:inline"> — {engagementLabel(exp.engagementType)}</span>
            )}
          </div>
          <div className="flex items-center gap-1.5">
            <p className="text-xs text-muted-foreground">{exp.dates.replace(/ - /g, " – ")}</p>
            {exp.engagementType && <EngagementTypeBadge type={exp.engagementType} />}
          </div>
        </div>
      </div>
      {exp.techStack.length > 0 && (
        <p className="mt-1 ml-7 text-xs text-muted-foreground print:ml-0">{exp.techStack.join(", ")}</p>
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
      ? "rounded-lg border bg-card px-4 py-3 shadow-sm print:border-0 print:bg-transparent print:p-0 print:shadow-none"
      : "",
  ].join(" ");

  const title = exp.link ? (
    <a
      href={exp.link}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 font-semibold hover:underline print:text-blue-600"
    >
      {exp.company} — {exp.position}
      <ExternalLink size={12} className="shrink-0 opacity-60 print:hidden" />
    </a>
  ) : (
    <span className="font-semibold print:text-blue-600 print:font-normal">
      {exp.company} — {exp.position}
    </span>
  );

  return (
    <li className={liClass}>
      <div className="flex items-start gap-2">
        {/* Logo: web only */}
        <span className="print:hidden shrink-0">
          {exp.companyLogo ? (
            <SmallLogo src={exp.companyLogo} company={exp.company} />
          ) : (
            <div className="h-5 w-5" />
          )}
        </span>
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2">
            {title}
            {exp.engagementType && (
              <span className="font-normal hidden print:inline"> — {engagementLabel(exp.engagementType)}</span>
            )}
          </div>
          <div className="mb-1.5 flex items-center gap-1.5 print:mb-0.5">
            <p className="text-xs text-muted-foreground">{exp.dates.replace(/ - /g, " – ")}</p>
            {exp.engagementType && <EngagementTypeBadge type={exp.engagementType} />}
          </div>
          {exp.techStack.length > 0 && (
            <p className="mt-1 mb-2 text-xs text-muted-foreground">{exp.techStack.join(", ")}</p>
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
      <span>{exp.company}</span>
      {" "}<span className="print:text-blue-600 print:font-normal">— {exp.position}</span>
    </span>
  );

  const wrapClass = exp.isFeatured
    ? "flex items-start gap-3 rounded-lg border bg-card px-4 py-3 shadow-sm print:border-0 print:bg-transparent print:p-0 print:shadow-none"
    : "flex items-start gap-3";

  return (
    <div className={wrapClass}>
      {/* Logo: web only */}
      <span className="print:hidden shrink-0">
        {exp.companyLogo ? (
          <SmallLogo src={exp.companyLogo} company={exp.company} />
        ) : (
          <div className="h-5 w-5" />
        )}
      </span>
      <div className="flex-1">
        <div className="flex flex-wrap items-center gap-2">
          {title}
          {exp.engagementType && (
            <span className="font-normal hidden print:inline"> — {engagementLabel(exp.engagementType)}</span>
          )}
        </div>
        <div className="mb-1.5 flex items-center gap-1.5 print:mb-0.5">
          <p className="text-sm text-muted-foreground">{exp.dates.replace(/ - /g, " – ")}</p>
          {exp.engagementType && <EngagementTypeBadge type={exp.engagementType} />}
        </div>
        {exp.techStack.length > 0 && (
          <p className="mt-1 mb-2 text-xs text-muted-foreground">{exp.techStack.join(", ")}</p>
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
    <section aria-labelledby="experience-heading" className="mb-8 print:mb-3 print:mt-8 print:break-before-avoid">
      <h2
        id="experience-heading"
        className="mb-6 text-xl font-bold tracking-tight print:text-sm print:uppercase print:tracking-wide print:border-b print:border-gray-400 print:pb-0.5 print:mb-2 print:break-after-avoid"
      >
        Experience
      </h2>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 print:gap-1 items-start">
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

          if (exps.length === 1 && exps[0].isCompact) {
            return <CompactExperienceCard key={item.key} exp={exps[0]} />;
          }

          const company = exps[0].contractorCompany!;

          const companyName = company.url ? (
            <a
              href={company.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-bold hover:underline print:text-blue-600"
            >
              {company.name}
              <ExternalLink size={13} className="shrink-0 opacity-60 print:hidden" />
            </a>
          ) : (
            <span className="font-bold print:text-blue-600">{company.name}</span>
          );

          return (
            <div
              key={item.key}
              className="col-span-1 sm:col-span-2 rounded-lg border bg-card p-5 shadow-sm print:border-0 print:bg-transparent print:p-0 print:shadow-none"
            >
              {/* Umbrella header */}
              <div className="mb-4 flex items-center gap-3 print:mb-1">
                {/* Logo: web only */}
                <span className="print:hidden shrink-0">
                  {company.logo ? (
                    <ContractorLogo src={company.logo} name={company.name} />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-md bg-muted text-sm font-bold text-muted-foreground">
                      {company.name[0]}
                    </div>
                  )}
                </span>
                <div className="min-w-0 flex-1">
                  <h3 className="text-base print:text-sm">{companyName}</h3>
                </div>
              </div>

              {/* Sub-projects */}
              <ol className="grid grid-cols-1 gap-3 sm:grid-cols-2 items-start print:gap-2">
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
