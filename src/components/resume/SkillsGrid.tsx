import { Technology } from "@prisma/client";
import { Badge } from "@/components/ui/badge";

interface SkillsGridProps {
  technologies: Technology[];
}

const CATEGORY_ORDER = ["Languages", "Frontend", "Mobile", "Backend & Data", "AI / LLM", "Agentic Coding", "Tools & Platforms", "UI/UX", "Others"];

const CATEGORY_LABEL: Record<string, string> = {
  Languages: "Programming Languages",
};

const FALLBACK_SKILLS: Record<string, string[]> = {
  "AI/ML": [
    "Large Language Models (LLMs)",
    "Agentic AI",
    "Prompt Engineering",
    "RAG",
    "Vercel AI SDK",
    "Claude API",
    "OpenAI API",
    "Vector Databases",
    "AI Workflow Automation",
    "TensorFlow",
    "Machine Learning",
  ],
  Frontend: [
    "React.js", "Next.js", "TypeScript", "JavaScript", "Angular", "Vue",
    "SvelteKit", "Tailwind CSS", "SASS", "GSAP", "HTML", "CSS3",
    "Responsive Design", "Redux",
  ],
  Mobile: ["React Native", "Ionic", "Cordova"],
  Backend: [
    "Node.js", "NestJS", "Express", "Elixir", "Phoenix Live",
    "Python", "PHP", "C#", "Java",
  ],
  Databases: ["PostgreSQL", "MongoDB", "Firebase", "MySQL", "GraphQL", "Pinecone"],
  Others: ["GIT", "GitFlow", "Figma", "UI/UX Design", "Jira", "AWS Cognito", "Vercel", "Linux"],
};

function groupByCategory(technologies: Technology[]): Record<string, string[]> {
  const grouped: Record<string, string[]> = {};
  for (const tech of technologies) {
    if (tech.isHidden) continue;
    for (const cat of tech.categories) {
      if (!grouped[cat]) grouped[cat] = [];
      grouped[cat].push(tech.name);
    }
  }
  return grouped;
}

export default function SkillsGrid({ technologies }: SkillsGridProps) {
  const grouped =
    technologies.length > 0 ? groupByCategory(technologies) : FALLBACK_SKILLS;

  const orderedCategories = [
    ...CATEGORY_ORDER.filter((c) => grouped[c]),
    ...Object.keys(grouped).filter((c) => !CATEGORY_ORDER.includes(c)),
  ];

  return (
    <section aria-labelledby="skills-heading" className="mb-8 print:mb-3 print:mt-7 print:break-before-avoid">
      <h2
        id="skills-heading"
        className="mb-4 text-xl font-bold tracking-tight print:mb-1 print:break-after-avoid"
      >
        Skills &amp; Technologies
      </h2>

      {/* Web: pills layout */}
      <div className="space-y-2 print:hidden">
        {orderedCategories.map((category) => (
          <div key={category} className="flex flex-wrap items-baseline gap-x-3 gap-y-1.5">
            <span className="shrink-0 text-xs font-bold uppercase tracking-wide text-muted-foreground">
              {CATEGORY_LABEL[category] ?? category}
            </span>
            <div className="flex flex-wrap gap-1.5">
              {grouped[category].map((skill) => (
                <Badge key={skill} variant="secondary">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Print: comma-separated text */}
      <div className="hidden print:block space-y-0.5 text-[8.5pt]">
        {orderedCategories.map((category) => (
          <p key={category}>
            <span className="font-bold uppercase tracking-wide">{CATEGORY_LABEL[category] ?? category}:</span>{" "}
            {grouped[category].join(", ")}
          </p>
        ))}
      </div>
    </section>
  );
}
