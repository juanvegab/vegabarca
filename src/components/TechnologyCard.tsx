"use client";

import { Technology } from "@prisma/client";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import Image from "next/image";
import { useState } from "react";
import AddEditTechnologyDialog from "./AddEditTechnologyDialog";

interface TechnologyCardProps {
  technology: Technology;
}

const TechnologyCard: React.FC<TechnologyCardProps> = ({ technology }) => {
  const [showEditDialog, setShowEditDialog] = useState(false);
  const { name, logo, categories, isFeatured } = technology;

  return (
    <>
      <Card
        className="relative flex h-full cursor-pointer flex-col transition-shadow hover:shadow-lg"
        onClick={() => setShowEditDialog(true)}
      >
        <CardHeader className="pb-2">
          <div className="flex items-center gap-3">
            {logo ? (
              <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded border bg-white p-0.5">
                <Image
                  src={logo}
                  alt={`${name} logo`}
                  width={32}
                  height={32}
                  className="h-full w-full object-contain"
                />
              </div>
            ) : (
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded bg-muted text-sm font-bold text-muted-foreground">
                {name[0]}
              </div>
            )}
            <CardTitle className="text-sm leading-snug">
              {name}
              {isFeatured && (
                <span className="ml-1.5 text-[10px] font-normal text-amber-600">★</span>
              )}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-1 pt-0">
          {categories.map((cat) => (
            <Badge key={cat} variant="secondary" className="text-xs">
              {cat}
            </Badge>
          ))}
        </CardContent>
      </Card>
      <AddEditTechnologyDialog
        open={showEditDialog}
        setOpen={setShowEditDialog}
        technologyToEdit={technology}
      />
    </>
  );
};

export default TechnologyCard;
