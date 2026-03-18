interface EducationItem {
  institution: string;
  degree: string;
  period: string;
  highlight?: boolean;
  logo?: string;
}

const educationItems: EducationItem[] = [
  {
    institution: "MIT Professional Education",
    degree: "Applied AI & Data Science Program",
    period: "September 2025 – January 2026",
    highlight: true,
    logo: "https://logo.clearbit.com/mit.edu",
  },
  {
    institution: "Universidad Cenfotec",
    degree: "Software Engineering Diploma",
    period: "2008 – 2011",
    logo: "https://logo.clearbit.com/ucenfotec.ac.cr",
  },
  {
    institution: "Universidad Cenfotec",
    degree: "Web Development Diploma",
    period: "2010 – 2012",
    logo: "https://logo.clearbit.com/ucenfotec.ac.cr",
  },
  {
    institution: "Ultimate Courses by Todd Motto",
    degree: "Angular Framework Certification",
    period: "February 2020",
    logo: "https://logo.clearbit.com/ultimatecourses.com",
  },
  {
    institution: "Ultimate Courses by Todd Motto",
    degree: "NGRX State Management Certification",
    period: "May 2020",
    logo: "https://logo.clearbit.com/ultimatecourses.com",
  },
  {
    institution: "Origami Academy",
    degree: "WordPress Theming Certification",
    period: "2013",
  },
];

import Image from "next/image";

export default function EducationSection() {
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
            {item.logo && (
              <Image
                src={item.logo}
                alt={`${item.institution} logo`}
                width={36}
                height={36}
                className="shrink-0 rounded object-contain"
              />
            )}
            {!item.logo && (
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded bg-muted text-xs font-bold text-muted-foreground">
                {item.institution[0]}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="font-semibold">{item.institution}</h3>
                <span className="text-sm text-muted-foreground">{item.period}</span>
              </div>
              <p className="text-sm text-muted-foreground">{item.degree}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
