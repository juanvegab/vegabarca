import prisma from "@/lib/db/prisma";
import ResumeHeader from "@/components/resume/ResumeHeader";
import MITCertSpotlight from "@/components/resume/MITCertSpotlight";
import ContractorGroupedExperience from "@/components/resume/ContractorGroupedExperience";
import SkillsGrid from "@/components/resume/SkillsGrid";
import EducationSection from "@/components/resume/EducationSection";
import ResumeDownload from "@/components/resume/ResumeDownload";

export const dynamic = "force-dynamic";

export default async function ResumePage() {
  const [experiences, technologies] = await Promise.all([
    prisma.experience.findMany({ include: { contractorCompany: true } }),
    prisma.technology.findMany({}),
  ]);

  return (
    <main className="mx-auto max-w-4xl px-4 py-8 print:px-0 print:py-0">
      <ResumeDownload />
      <article>
        <ResumeHeader />
        <MITCertSpotlight />
        <SkillsGrid technologies={technologies} />
        <ContractorGroupedExperience experiences={experiences} />
        <EducationSection />
      </article>
    </main>
  );
}
