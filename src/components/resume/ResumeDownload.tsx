"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";

export default function ResumeDownload() {
  const [loading, setLoading] = useState(false);

  const handleDownload = () => {
    setLoading(true);

    const images = Array.from(document.querySelectorAll<HTMLImageElement>("img"));
    const pending = images.filter((img) => !img.complete);

    const doPrint = () => {
      window.print();
      // Reset spinner after the print dialog closes (afterprint fires when dialog dismisses)
      const onAfterPrint = () => {
        setLoading(false);
        window.removeEventListener("afterprint", onAfterPrint);
      };
      window.addEventListener("afterprint", onAfterPrint);
      // Fallback in case afterprint never fires (some browsers)
      setTimeout(() => setLoading(false), 10000);
    };

    if (pending.length === 0) {
      doPrint();
      return;
    }

    let loaded = 0;
    const onLoad = () => {
      loaded++;
      if (loaded === pending.length) doPrint();
    };
    pending.forEach((img) => {
      img.addEventListener("load", onLoad, { once: true });
      img.addEventListener("error", onLoad, { once: true });
    });
  };

  return (
    <div className="mb-8 flex print:hidden">
      <Button variant="outline" onClick={handleDownload} disabled={loading} className="gap-2">
        {loading ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
        {loading ? "Preparing PDF…" : "Download PDF"}
      </Button>
    </div>
  );
}
