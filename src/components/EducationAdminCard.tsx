"use client";

import { Education } from "@prisma/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import Image from "next/image";
import { useState } from "react";
import AddEditEducationDialog from "./AddEditEducationDialog";

interface Props {
  education: Education;
}

const EducationAdminCard = ({ education }: Props) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Card
        className="cursor-pointer transition-shadow hover:shadow-lg"
        onClick={() => setOpen(true)}
      >
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {education.logo ? (
              <Image
                src={education.logo}
                alt={`${education.institution} logo`}
                width={36}
                height={36}
                className="shrink-0 rounded object-contain"
              />
            ) : (
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded bg-muted text-xs font-bold text-muted-foreground">
                {education.institution[0]}
              </div>
            )}
            {education.institution}
          </CardTitle>
          <CardDescription>
            {education.degree} · {education.period}
          </CardDescription>
        </CardHeader>
        {education.highlight && (
          <CardContent>
            <span className="text-xs font-semibold text-amber-600">
              ★ Highlighted
            </span>
          </CardContent>
        )}
      </Card>

      <AddEditEducationDialog
        open={open}
        setOpen={setOpen}
        educationToEdit={education}
      />
    </>
  );
};

export default EducationAdminCard;
