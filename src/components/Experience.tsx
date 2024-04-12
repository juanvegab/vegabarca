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

interface ExperienceProps {
  experience: ExperienceModel;
}

const Experience: React.FC<ExperienceProps> = ({ experience }) => {
  const [showEditDialog, setShowEditDialog] = useState(false);

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
            {experience.position} at {experience.company}
          </CardTitle>
          <CardDescription>
            {createdUpdatedAtTimestamp}
            {wasUpdated && " (updated)"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="whitespace-pre-line">{experience.content}</p>
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
