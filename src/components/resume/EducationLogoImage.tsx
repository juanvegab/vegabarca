"use client";

import Image from "next/image";
import { useState } from "react";

interface Props {
  src: string;
  institution: string;
}

const EducationLogoImage = ({ src, institution }: Props) => {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded bg-muted text-xs font-bold text-muted-foreground">
        {institution[0]}
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={`${institution} logo`}
      width={36}
      height={36}
      className="shrink-0 rounded object-contain"
      onError={() => setFailed(true)}
    />
  );
};

export default EducationLogoImage;
