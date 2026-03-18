import prisma from "@/lib/db/prisma";
import EducationLogoImage from "./EducationLogoImage";

export default async function EducationSection() {
  const educationItems = await prisma.education.findMany({
    orderBy: { order: "asc" },
  });

  if (educationItems.length === 0) return null;

  return (
    <section aria-labelledby="education-heading" className="mb-8">
      <h2
        id="education-heading"
        className="mb-4 text-xl font-bold tracking-tight"
      >
        Education
      </h2>

      <div className="space-y-3">
        {educationItems.map((item) => (
          <div
            key={`${item.institution}_${item.degree}`}
            className={`flex items-center gap-4 rounded-lg border px-4 py-3 ${
              item.highlight
                ? "border-amber-300 bg-amber-50 dark:border-amber-700 dark:bg-amber-950/20"
                : ""
            }`}
          >
            {item.logo ? (
              <EducationLogoImage
                src={item.logo}
                institution={item.institution}
              />
            ) : (
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded bg-muted text-xs font-bold text-muted-foreground">
                {item.institution[0]}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="font-semibold">{item.institution}</h3>
                <span className="text-sm text-muted-foreground">
                  {item.period}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">{item.degree}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
