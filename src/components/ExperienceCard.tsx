import { Experience as ExperienceModel } from "@prisma/client";
import { Badge } from "./ui/badge";
import Image from "next/image";

interface ExperienceCardProps {
  experience: ExperienceModel;
  hideDates?: boolean;
}

const ExperienceCard: React.FC<ExperienceCardProps> = ({ experience, hideDates }) => {
  const { companyLogo, position, techStack, company, dates, content } =
    experience;
  const contentInParagraphs = (content?.split("\n") || []).filter(
    (p) => p !== "",
  );

  return (
    <section className="group flex h-full flex-col rounded-lg border px-5 py-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
      <div className="mb-3 flex items-start gap-3">
        {companyLogo ? (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-md border bg-white p-0.5">
            <Image
              src={companyLogo}
              alt={`${company} logo`}
              width={36}
              height={36}
              className="h-full w-full object-contain"
            />
          </div>
        ) : (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-muted text-sm font-bold text-muted-foreground">
            {company[0]}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <h3 className="text-base font-semibold leading-snug">
            {company} — {position}
          </h3>
          {!hideDates && <p className="mt-0.5 text-sm text-muted-foreground">{dates}</p>}
        </div>
      </div>

      <div className="mb-3 flex flex-wrap gap-1">
        {techStack.map((tech) => (
          <Badge key={`technology_${company.replaceAll(" ", "_")}_${tech}`}>
            {tech}
          </Badge>
        ))}
      </div>

      <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
        {contentInParagraphs.map((paragraph, index) => (
          <li key={`tasks_${company.replaceAll(" ", "_")}_${index}`}>
            {paragraph}
          </li>
        ))}
      </ul>
    </section>
  );
};

export default ExperienceCard;
