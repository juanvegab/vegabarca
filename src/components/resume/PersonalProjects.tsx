"use client";

import { ExternalLink } from "lucide-react";
import { Experience } from "@prisma/client";

interface PersonalProjectsProps {
  projects: Experience[];
}

function ProjectCard({ project }: { project: Experience }) {
  const summary = project.visibleSummary ?? project.content;
  const bullets = (summary?.split("\n") ?? []).filter((b) => b.trim() !== "");

  const wrapClass = project.isFeatured
    ? "rounded-lg border bg-card px-4 py-3 shadow-sm print:border-0 print:bg-transparent print:p-0 print:shadow-none print:break-inside-avoid"
    : "print:break-inside-avoid";

  const nameEl = project.link ? (
    <a
      href={project.link}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 font-semibold hover:underline"
    >
      <span className="text-blue-600">{project.company}</span>
      {" "}<span className="text-blue-600 font-normal">— {project.position}</span>
      <ExternalLink size={12} className="shrink-0 opacity-60 print:hidden" />
    </a>
  ) : (
    <span className="font-semibold">
      <span className="text-blue-600">{project.company}</span>
      {" "}<span className="text-blue-600 font-normal">— {project.position}</span>
    </span>
  );

  return (
    <div className={wrapClass}>
      <div className="flex flex-wrap items-center gap-2">
        {nameEl}
      </div>
      <div className="mb-1.5 flex items-center gap-1.5 print:mb-0.5">
        <p className="text-xs text-muted-foreground">{project.dates.replace(/ - /g, " – ")}</p>
      </div>
      {project.techStack.length > 0 && (
        <p className="mt-1 mb-2 text-xs text-muted-foreground">{project.techStack.join(", ")}</p>
      )}
      {bullets.length > 0 && (
        <ul className="list-disc space-y-0.5 pl-4 text-sm">
          {bullets.map((b, i) => (
            <li key={i}>{b.replace(/^[-•*]\s*/, "")}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function PersonalProjects({ projects }: PersonalProjectsProps) {
  if (projects.length === 0) return null;

  const sorted = [...projects].sort((a, b) => b.order - a.order);

  return (
    <section aria-labelledby="projects-heading" className="mb-8 print:mb-3 print:mt-8 print:break-before-avoid">
      <h2
        id="projects-heading"
        className="mb-6 text-xl font-bold tracking-tight print:text-sm print:uppercase print:tracking-wide print:border-b print:border-gray-400 print:pb-0.5 print:mb-2 print:break-after-avoid"
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
