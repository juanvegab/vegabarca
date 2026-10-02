import prisma from "@/lib/db/prisma";
import ResumeHeader from "@/components/resume/ResumeHeader";
import ResumeDownload from "@/components/resume/ResumeDownload";
import ContractorGroupedExperience from "@/components/resume/ContractorGroupedExperience";
import EarlierEngagements from "@/components/resume/EarlierEngagements";
import PersonalProjects from "@/components/resume/PersonalProjects";
import SkillsGrid from "@/components/resume/SkillsGrid";
import EducationSection from "@/components/resume/EducationSection";
export const dynamic = "force-dynamic";

export default async function ResumePage() {
  const [allExperiences, technologies] = await Promise.all([
    prisma.experience.findMany({ include: { contractorCompany: true } }),
    prisma.technology.findMany({}),
  ]);
  const visible = allExperiences.filter((e) => !e.isHidden);
  const personalProjects = visible.filter((e) => e.isPersonalProject);
  const experiences = visible.filter((e) => !e.isCondensed && !e.isPersonalProject);
  const condensed = visible.filter((e) => e.isCondensed && !e.isPersonalProject);

  return (
    <main className="mx-auto max-w-4xl px-4 py-8 print:px-0 print:py-0">
      <ResumeDownload />
      <article>
        <ResumeHeader />
        <SkillsGrid technologies={technologies} />
        <div className="hidden print:block">
          <EducationSection />
        </div>
        <ContractorGroupedExperience experiences={experiences} />
        <PersonalProjects projects={personalProjects} />
        <EarlierEngagements experiences={condensed} />
        <div className="print:hidden">
          <EducationSection />
        </div>
      </article>
    </main>
  );
}
