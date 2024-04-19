import { Experience as ExperienceModel } from "@prisma/client";
import { Badge } from "./ui/badge";
import Image from "next/image";

interface ExperienceCardProps {
  experience: ExperienceModel;
}

const ExperienceCard: React.FC<ExperienceCardProps> = ({ experience }) => {
  const { companyLogo, position, techStack, company, dates, content } =
    experience;
  const contentInParagraphs = (content?.split("\n") || []).filter(
    (p) => p !== "",
  );
  return (
    <>
      <section className="mb-4 w-full rounded-lg border px-6 py-4 shadow-lg">
        <div>
          <div>
            <h3 className="flex gap-2 text-2xl font-semibold">
              {companyLogo && (
                <Image
                  src={companyLogo}
                  alt="Company Logo"
                  width={40}
                  height={40}
                />
              )}
              {company} — {position}
            </h3>
            <p className="mb-2">{dates}</p>
            <div className="mb-6 flex flex-wrap gap-1">
              {techStack.map((tech) => (
                <Badge
                  key={`technology_${company.replaceAll(" ", "_")}_${tech}`}
                >
                  {tech}
                </Badge>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <ul className="list-disc pl-6">
              {contentInParagraphs.map((paragraph, index) => (
                <li key={`tasks_${company.replaceAll(" ", "_")}_${index}`}>
                  {paragraph}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  );
};

export default ExperienceCard;
