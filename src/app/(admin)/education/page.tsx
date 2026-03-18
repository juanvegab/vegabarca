import EducationAdminCard from "@/components/EducationAdminCard";
import prisma from "@/lib/db/prisma";
import { auth } from "@clerk/nextjs";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Vegabarca - Education",
};

const DEFAULT_ITEMS = [
  {
    institution: "MIT Professional Education",
    degree: "Applied AI & Data Science Program",
    period: "September 2025 – January 2026",
    highlight: true,
    order: 0,
  },
  {
    institution: "Universidad Cenfotec",
    degree: "Software Engineering Diploma",
    period: "2008 – 2011",
    order: 1,
  },
  {
    institution: "Universidad Cenfotec",
    degree: "Web Development Diploma",
    period: "2010 – 2012",
    order: 2,
  },
  {
    institution: "Ultimate Courses by Todd Motto",
    degree: "Angular Framework Certification",
    period: "February 2020",
    order: 3,
  },
  {
    institution: "Ultimate Courses by Todd Motto",
    degree: "NGRX State Management Certification",
    period: "May 2020",
    order: 4,
  },
  {
    institution: "Origami Academy",
    degree: "WordPress Theming Certification",
    period: "2013",
    order: 5,
  },
];

const EducationPage = async () => {
  const { userId } = auth();
  if (!userId) return redirect("/sign-in");

  let allEducation = await prisma.education.findMany({
    orderBy: { order: "asc" },
  });

  // Auto-seed on first load
  if (allEducation.length === 0) {
    await prisma.education.createMany({ data: DEFAULT_ITEMS });
    allEducation = await prisma.education.findMany({
      orderBy: { order: "asc" },
    });
  }

  return (
    <main className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {allEducation.map((item) => (
        <EducationAdminCard key={item.id} education={item} />
      ))}
    </main>
  );
};

export default EducationPage;
