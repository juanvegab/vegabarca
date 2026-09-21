"use client";

import { Button } from "@/components/ui/button";
import { Download, Printer } from "lucide-react";

async function printWhenReady() {
  const images = Array.from(document.querySelectorAll<HTMLImageElement>("img"));
  await Promise.all(
    images.map(
      (img) =>
        img.complete
          ? Promise.resolve()
          : new Promise<void>((resolve) => {
              img.addEventListener("load", () => resolve(), { once: true });
              img.addEventListener("error", () => resolve(), { once: true });
            }),
    ),
  );
  window.print();
}

export default function ResumeDownload() {
  return (
    <div className="mb-8 flex flex-wrap gap-3 print:hidden">
      <Button
        variant="default"
        onClick={printWhenReady}
        className="gap-2"
      >
        <Printer size={16} />
        Print / Save as PDF
      </Button>
      <Button
        variant="outline"
        onClick={printWhenReady}
        className="gap-2"
      >
        <Download size={16} />
        Download PDF
      </Button>
    </div>
  );
}
