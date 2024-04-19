import Experience from "@/components/Experience";
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

  const allExperiences = await prisma.experience.findMany({});

  return (
    <main className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {allExperiences.map((experience) => (
        <Experience key={experience.id} experience={experience} />
      ))}
      {allExperiences.length === 0 && (
        <p className="col-span-full">{`You don't have any experiencess`}</p>
      )}
    </main>
  );
};

export default Experiences;
