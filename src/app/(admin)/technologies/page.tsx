import prisma from "@/lib/db/prisma";
import { auth } from "@clerk/nextjs";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import TechnologyCard from "@/components/TechnologyCard";
import AddTechnologyButton from "@/components/AddTechnologyButton";

export const metadata: Metadata = {
  title: "Vegabarca - Technologies",
};

const CATEGORY_ORDER = ["AI/ML", "Frontend", "Mobile", "Backend", "Databases", "Others"];

const TechnologiesPage = async () => {
  const { userId } = auth();
  if (!userId) return redirect("/sign-in");

  const technologies = await prisma.technology.findMany({
    orderBy: { name: "asc" },
  });

  const grouped: Record<string, typeof technologies> = {};
  for (const tech of technologies) {
    for (const cat of tech.categories) {
      if (!grouped[cat]) grouped[cat] = [];
      grouped[cat].push(tech);
    }
  }

  const orderedCategories = [
    ...CATEGORY_ORDER.filter((c) => grouped[c]),
    ...Object.keys(grouped).filter((c) => !CATEGORY_ORDER.includes(c)),
  ];

  return (
    <main className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Technologies</h1>
        <AddTechnologyButton />
      </div>

      {technologies.length === 0 && (
        <p className="text-muted-foreground">No technologies yet. Add one above.</p>
      )}

      {orderedCategories.map((category) => (
        <section key={category}>
          <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-muted-foreground">
            {category}
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {grouped[category].map((tech) => (
              <TechnologyCard key={tech.id} technology={tech} />
            ))}
          </div>
        </section>
      ))}
    </main>
  );
};

export default TechnologiesPage;
