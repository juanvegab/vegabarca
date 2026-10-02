"use client";

import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

function printWhenReady() {
  const images = Array.from(document.querySelectorAll<HTMLImageElement>("img"));
  const pending = images.filter((img) => !img.complete);
  if (pending.length === 0) {
    window.print();
    return;
  }
  let loaded = 0;
  const onLoad = () => {
    loaded++;
    if (loaded === pending.length) window.print();
  };
  pending.forEach((img) => {
    img.addEventListener("load", onLoad, { once: true });
    img.addEventListener("error", onLoad, { once: true });
  });
}

export default function ResumeDownload() {
  return (
    <div className="mb-8 flex print:hidden">
      <Button variant="outline" onClick={printWhenReady} className="gap-2">
        <Download size={16} />
        Download PDF
      </Button>
    </div>
  );
}
