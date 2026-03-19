import SortableExperienceGrid from "@/components/SortableExperienceGrid";
import prisma from "@/lib/db/prisma";
import { auth } from "@clerk/nextjs";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Vegabarca - Experiences",
};

const Experiences = async () => {
  const { userId } = auth();
  if (!userId) return redirect("/sign-in");

  const allExperiences = await prisma.experience.findMany({
    orderBy: { order: "asc" },
  });

  return (
    <main>
      <SortableExperienceGrid experiences={allExperiences} />
    </main>
  );
};

export default Experiences;
