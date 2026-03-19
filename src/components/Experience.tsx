"use client";
import { Experience as ExperienceModel } from "@prisma/client";
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
import { GripVertical } from "lucide-react";

interface ExperienceProps {
  experience: ExperienceModel;
  dragHandleProps?: React.HTMLAttributes<HTMLDivElement>;
}

const Experience: React.FC<ExperienceProps> = ({
  experience,
  dragHandleProps,
}) => {
  const [showEditDialog, setShowEditDialog] = useState(false);
  const { companyLogo, position, techStack, company, dates } = experience;

  const wasUpdated = experience.updatedAt > experience.createdAt;
  const createdUpdatedAtTimestamp = (
    wasUpdated ? experience.updatedAt : experience.createdAt
  ).toDateString();

  return (
    <>
      <Card
        className="relative cursor-pointer transition-shadow hover:shadow-lg"
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
          <CardTitle>
            {companyLogo && (
              <Image
                src={companyLogo}
                alt="Company Logo"
                width={40}
                height={40}
              />
            )}
            {position} at {company}
          </CardTitle>
          <CardDescription>{dates}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
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
