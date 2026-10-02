"use client";

import { useState } from "react";
import Image from "next/image";
import { ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Experience } from "@prisma/client";

interface PersonalProjectsProps {
  projects: Experience[];
}

function ProjectLogo({ src, name }: { src: string; name: string }) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-muted text-xs font-bold text-muted-foreground print:h-5 print:w-5">
        {name[0]}
      </div>
    );
  }
  return (
    <Image
      src={src}
      alt={`${name} logo`}
      width={32}
      height={32}
      className="h-8 w-8 shrink-0 rounded-md object-contain print:h-5 print:w-5"
      loading="eager"
      onError={() => setFailed(true)}
    />
  );
}

function ProjectCard({ project }: { project: Experience }) {
  const [expanded, setExpanded] = useState(false);
  const summary = project.visibleSummary ?? project.content;
  const bullets = (summary?.split("\n") ?? []).filter((b) => b.trim() !== "");

  const nameEl = project.link ? (
    <a
      href={project.link}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 font-semibold hover:underline"
    >
      {project.company}
      <ExternalLink size={12} className="shrink-0 opacity-60" />
    </a>
  ) : (
    <span className="font-semibold">{project.company}</span>
  );

  return (
    <div className="flex flex-col rounded-lg border bg-card p-4 shadow-sm print:p-2 print:shadow-none print:break-inside-avoid">
      <div className="flex items-start gap-2">
        {project.companyLogo && (
          <ProjectLogo src={project.companyLogo} name={project.company} />
        )}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-1">
            {nameEl}
          </div>
          {project.position && (
            <p className="text-xs text-muted-foreground">{project.position}</p>
          )}
          <p className="text-xs text-muted-foreground">{project.dates}</p>
        </div>
      </div>

      {project.techStack.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {project.techStack.map((tech) => (
            <Badge key={tech} variant="secondary" className="text-xs">
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
          <ul className={`mt-2 list-disc space-y-0.5 pl-4 text-sm ${expanded ? "" : "print:block hidden"}`}>
            {bullets.map((b, i) => (
              <li key={i}>{b.replace(/^[-•*]\s*/, "")}</li>
            ))}
          </ul>
        </>
      )}
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
        className="mb-4 text-xl font-bold tracking-tight"
      >
        Personal Projects
      </h2>
      <div className="grid gap-4 sm:grid-cols-2 print:gap-2">
        {sorted.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </section>
  );
}
