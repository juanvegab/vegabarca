"use client";
import { ExperienceWithContractor } from "./SortableExperienceGrid";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { useState } from "react";
import AddEditExperienceDialog from "./AddEditExperienceDialog";
import { Badge } from "./ui/badge";
import Image from "next/image";
import { Building2, GripVertical } from "lucide-react";

interface ExperienceProps {
  experience: ExperienceWithContractor;
  dragHandleProps?: React.HTMLAttributes<HTMLDivElement>;
}

const Experience: React.FC<ExperienceProps> = ({
  experience,
  dragHandleProps,
}) => {
  const [showEditDialog, setShowEditDialog] = useState(false);
  const { companyLogo, position, techStack, company, dates, contractorCompany } =
    experience;

  return (
    <>
      <Card
        className="relative flex h-full cursor-pointer flex-col transition-shadow hover:shadow-lg"
        onClick={() => setShowEditDialog(true)}
      >
        {dragHandleProps && (
          <div
            className="absolute right-2 top-2 cursor-grab p-1 text-muted-foreground hover:text-foreground active:cursor-grabbing"
            onClick={(e) => e.stopPropagation()}
            {...dragHandleProps}
          >
            <GripVertical className="h-4 w-4" />
          </div>
        )}
        <CardHeader>
          <div className="flex min-h-[44px] items-center gap-3">
            {companyLogo ? (
              <Image
                src={companyLogo}
                alt="Company Logo"
                width={40}
                height={40}
                className="shrink-0 rounded object-contain"
              />
            ) : (
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded bg-muted text-sm font-bold text-muted-foreground">
                {company[0]}
              </div>
            )}
            <div className="min-w-0 flex-1 pr-6">
              <CardTitle className="text-base leading-snug">
                {position} at {company}
              </CardTitle>
              <CardDescription>{dates}</CardDescription>
            </div>
          </div>
          {contractorCompany && (
            <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
              <Building2 className="h-3 w-3 shrink-0" />
              <span>via {contractorCompany.name}</span>
            </div>
          )}
        </CardHeader>
        <CardContent className="flex flex-1 flex-wrap content-start gap-2">
          {techStack.map((tech) => (
            <Badge key={`technology_${company.replaceAll(" ", "_")}_${tech}`}>
              {tech}
            </Badge>
          ))}
        </CardContent>
      </Card>
      <AddEditExperienceDialog
        open={showEditDialog}
        setOpen={setShowEditDialog}
        experienceToEdit={experience}
      />
    </>
  );
};

export default Experience;
