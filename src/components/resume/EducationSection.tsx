interface EducationItem {
  institution: string;
  degree: string;
  period: string;
  highlight?: boolean;
}

const educationItems: EducationItem[] = [
  {
    institution: "MIT Professional Education",
    degree: "Applied AI & Data Science Program",
    period: "September 2025 – January 2026",
    highlight: true,
  },
  {
    institution: "Universidad Cenfotec",
    degree: "Software Engineering Diploma",
    period: "2008 – 2011",
  },
  {
    institution: "Universidad Cenfotec",
    degree: "Web Development Diploma",
    period: "2010 – 2012",
  },
  {
    institution: "Ultimate Courses by Todd Motto",
    degree: "Angular Framework Certification",
    period: "February 2020",
  },
  {
    institution: "Ultimate Courses by Todd Motto",
    degree: "NGRX State Management Certification",
    period: "May 2020",
  },
  {
    institution: "Origami Academy",
    degree: "WordPress Theming Certification",
    period: "2013",
  },
];

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
            className={`flex flex-col gap-0.5 rounded-lg border px-4 py-3 ${
              item.highlight
                ? "border-amber-300 bg-amber-50 dark:border-amber-700 dark:bg-amber-950/20"
                : ""
            }`}
          >
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="font-semibold">{item.institution}</h3>
              <span className="text-sm text-muted-foreground">{item.period}</span>
            </div>
            <p className="text-sm text-muted-foreground">{item.degree}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
