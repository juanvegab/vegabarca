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

interface ExperienceProps {
  experience: ExperienceModel;
}

const Experience: React.FC<ExperienceProps> = ({ experience }) => {
  const [showEditDialog, setShowEditDialog] = useState(false);
  const { companyLogo, position, techStack, company, dates } = experience;

  const wasUpdated = experience.updatedAt > experience.createdAt;
  const createdUpdatedAtTimestamp = (
    wasUpdated ? experience.updatedAt : experience.createdAt
  ).toDateString();

  return (
    <>
      <Card
        className="cursor-pointer transition-shadow hover:shadow-lg"
        onClick={() => setShowEditDialog(true)}
      >
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
