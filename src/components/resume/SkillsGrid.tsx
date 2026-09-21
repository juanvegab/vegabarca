import { Technology } from "@prisma/client";
import { Badge } from "@/components/ui/badge";

interface SkillsGridProps {
  technologies: Technology[];
}

const CATEGORY_ORDER = ["AI/ML", "Frontend", "Mobile", "Backend", "Databases", "Others"];

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
    "Python", "PHP", "C#",
  ],
  Databases: ["PostgreSQL", "MongoDB", "Firebase", "MySQL", "GraphQL", "Pinecone"],
  Others: ["GIT", "GitFlow", "Figma", "UI/UX Design", "Jira", "AWS Cognito", "Vercel", "Linux"],
};

function groupByCategory(technologies: Technology[]): Record<string, string[]> {
  const grouped: Record<string, string[]> = {};
  for (const tech of technologies) {
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
    <section aria-labelledby="skills-heading" className="mb-8">
      <h2
        id="skills-heading"
        className="mb-4 text-xl font-bold tracking-tight"
      >
        Skills &amp; Technologies
      </h2>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {orderedCategories.map((category) => (
          <div
            key={category}
            className={
              category === "AI/ML"
                ? "rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-950/20"
                : "rounded-lg border p-4"
            }
          >
            <h3
              className={`mb-2 text-sm font-bold uppercase tracking-wide ${
                category === "AI/ML"
                  ? "text-blue-700 dark:text-blue-300"
                  : "text-muted-foreground"
              }`}
            >
              {category}
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {grouped[category].map((skill) => (
                <Badge
                  key={skill}
                  variant={category === "AI/ML" ? "default" : "secondary"}
                  className={
                    category === "AI/ML"
                      ? "bg-blue-600 hover:bg-blue-700"
                      : ""
                  }
                >
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
