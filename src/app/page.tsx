import prisma from "@/lib/db/prisma";
import ExperienceCard from "@/components/ExperienceCard";
import SkillsGrid from "@/components/resume/SkillsGrid";
import MITCertSpotlight from "@/components/resume/MITCertSpotlight";
import HeroSection from "@/components/home/HeroSection";
import AIShowcase from "@/components/home/AIShowcase";
import WhatIBuild from "@/components/home/WhatIBuild";
import ContactCTA from "@/components/home/ContactCTA";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const dynamic = "force-dynamic";

const Home = async () => {
  const [featuredExperiences, technologies] = await Promise.all([
    prisma.experience.findMany({
      where: { isFeatured: true },
      orderBy: { order: "asc" },
    }),
    prisma.technology.findMany({}),
  ]);

  return (
    <main>
      <HeroSection />
      <AIShowcase />
      <WhatIBuild />

      <section className="mx-auto max-w-4xl px-4 py-8">
        <MITCertSpotlight />
      </section>

      {featuredExperiences.length > 0 && (
        <section className="mx-auto max-w-5xl px-4 py-12">
          <h2 className="mb-2 text-3xl font-bold tracking-tight">
            Selected Work
          </h2>
          <p className="mb-8 text-muted-foreground">
            A few highlights — see the full timeline on my resume.
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            {featuredExperiences.map((experience) => (
              <ExperienceCard key={experience.id} experience={experience} />
            ))}
          </div>
          <div className="mt-8 text-center">
            <Button asChild variant="outline">
              <Link href="/resume">View All Experience →</Link>
            </Button>
          </div>
        </section>
      )}

      <section className="mx-auto max-w-5xl px-4 py-12">
        <SkillsGrid technologies={technologies} />
      </section>

      <ContactCTA />
    </main>
  );
};

export default Home;
