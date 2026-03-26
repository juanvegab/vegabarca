import prisma from "@/lib/db/prisma";
import { auth } from "@clerk/nextjs";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import ContractorCompanyList from "@/components/ContractorCompanyList";

export const metadata: Metadata = {
  title: "Vegabarca - Contractor Companies",
};

const ContractorCompaniesPage = async () => {
  const { userId } = auth();
  if (!userId) return redirect("/sign-in");

  const companies = await prisma.contractorCompany.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <main>
      <ContractorCompanyList companies={companies} />
    </main>
  );
};

export default ContractorCompaniesPage;
