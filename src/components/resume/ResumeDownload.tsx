"use client";

import { Button } from "@/components/ui/button";
import { Download, Printer } from "lucide-react";

export default function ResumeDownload() {
  return (
    <div className="mb-8 flex flex-wrap gap-3 print:hidden">
      <Button
        variant="default"
        onClick={() => window.print()}
        className="gap-2"
      >
        <Printer size={16} />
        Print / Save as PDF
      </Button>
      <Button
        variant="outline"
        onClick={() => window.print()}
        className="gap-2"
      >
        <Download size={16} />
        Download PDF
      </Button>
    </div>
  );
}
