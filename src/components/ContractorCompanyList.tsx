"use client";

import { ContractorCompany } from "@prisma/client";
import { useState } from "react";
import { Card, CardHeader, CardTitle } from "./ui/card";
import Image from "next/image";
import AddEditContractorCompanyDialog from "./AddEditContractorCompanyDialog";

interface ContractorCompanyListProps {
  companies: ContractorCompany[];
}

const ContractorCompanyList = ({ companies }: ContractorCompanyListProps) => {
  const [selected, setSelected] = useState<ContractorCompany | undefined>();
  const [showDialog, setShowDialog] = useState(false);

  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        {companies.map((company) => (
          <Card
            key={company.id}
            className="cursor-pointer transition-shadow hover:shadow-lg"
            onClick={() => {
              setSelected(company);
              setShowDialog(true);
            }}
          >
            <CardHeader className="flex flex-row items-center gap-3">
              {company.logo && (
                <Image
                  src={company.logo}
                  alt={company.name}
                  width={40}
                  height={40}
                  className="rounded object-contain"
                />
              )}
              <CardTitle>{company.name}</CardTitle>
            </CardHeader>
          </Card>
        ))}
      </div>
      <AddEditContractorCompanyDialog
        open={showDialog}
        setOpen={setShowDialog}
        companyToEdit={selected}
      />
    </>
  );
};

export default ContractorCompanyList;
