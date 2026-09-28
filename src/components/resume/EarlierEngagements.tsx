import { Experience } from "@prisma/client";

interface EarlierEngagementsProps {
  experiences: Experience[];
}

function extractYears(dates: string): string {
  const years = dates.match(/\d{4}/g);
  if (!years || years.length === 0) return dates;
  const first = years[0];
  const last = years[years.length - 1];
  return first === last ? first : `${first} – ${last}`;
}

export default function EarlierEngagements({ experiences }: EarlierEngagementsProps) {
  if (experiences.length === 0) return null;

  const sorted = [...experiences].sort((a, b) => b.order - a.order);

  return (
    <section aria-labelledby="earlier-heading" className="mb-8">
      <h2
        id="earlier-heading"
        className="mb-3 text-xl font-bold tracking-tight"
      >
        Earlier Engagements
      </h2>
      <ul className="space-y-1">
        {sorted.map((exp) => (
          <li
            key={exp.id}
            className="flex items-baseline justify-between gap-4 text-sm text-muted-foreground print:text-[8.5pt]"
          >
            <span>
              <span className="font-medium text-foreground">{exp.company}</span>
              {" — "}
              {exp.position}
            </span>
            <span className="shrink-0 tabular-nums">{extractYears(exp.dates)}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
