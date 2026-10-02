"use client";

import { useState } from "react";
import Image from "next/image";
// useState kept for ProjectLogo error fallback
import { ExternalLink, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Experience } from "@prisma/client";

interface PersonalProjectsProps {
  projects: Experience[];
}

function ProjectLogo({ src, name }: { src: string; name: string }) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-muted text-[10px] font-bold text-muted-foreground">
        {name[0]}
      </div>
    );
  }
  return (
    <Image
      src={src}
      alt={`${name} logo`}
      width={20}
      height={20}
      className="mt-0.5 h-5 w-5 shrink-0 rounded object-contain"
      loading="eager"
      onError={() => setFailed(true)}
    />
  );
}

function AgenticBadge() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-amber-200 px-1.5 py-0.5 text-[10px] font-medium text-amber-900 dark:bg-amber-800 dark:text-amber-100">
      <Sparkles size={9} />
      Agentic AI
    </span>
  );
}

function ProjectCard({ project }: { project: Experience }) {
  const summary = project.visibleSummary ?? project.content;
  const bullets = (summary?.split("\n") ?? []).filter((b) => b.trim() !== "");

  const wrapClass = project.isFeatured
    ? "print:break-inside-avoid flex items-start gap-3 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 dark:border-amber-700 dark:bg-amber-950/20"
    : "flex items-start gap-3";

  const nameEl = project.link ? (
    <a
      href={project.link}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 font-semibold hover:underline"
    >
      {project.company} — {project.position}
      <ExternalLink size={12} className="shrink-0 opacity-60" />
    </a>
  ) : (
    <span className="font-semibold">
      {project.company} — {project.position}
    </span>
  );

  return (
    <div className={wrapClass}>
      {project.companyLogo ? (
        <ProjectLogo src={project.companyLogo} name={project.company} />
      ) : (
        <div className="h-5 w-5 shrink-0" />
      )}
      <div className="flex-1">
        <div className="flex flex-wrap items-center gap-2">
          {nameEl}
          {project.isFeatured && <AgenticBadge />}
        </div>
        <div className="mb-1.5 flex items-center gap-1.5 print:mb-0.5">
          <p className="text-sm text-muted-foreground">{project.dates}</p>
        </div>
        {project.techStack.length > 0 && (
          <div className="mb-2 flex flex-wrap gap-1">
            {project.techStack.map((tech) => (
              <Badge key={tech} variant="secondary">
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

export default function PersonalProjects({ projects }: PersonalProjectsProps) {
  if (projects.length === 0) return null;

  const sorted = [...projects].sort((a, b) => b.order - a.order);

  return (
    <section aria-labelledby="projects-heading" className="mb-8">
      <h2
        id="projects-heading"
        className="mb-6 text-xl font-bold tracking-tight"
      >
        Personal Projects
      </h2>
      <div className="grid grid-cols-1 gap-6 print:gap-3">
        {sorted.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </section>
  );
}
