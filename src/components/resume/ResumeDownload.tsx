"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";

export default function ResumeDownload() {
  const [loading, setLoading] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const listenerRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (listenerRef.current) window.removeEventListener("afterprint", listenerRef.current);
    };
  }, []);

  const handleDownload = () => {
    if (loading) return;
    setLoading(true);

    const cleanup = () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (listenerRef.current) window.removeEventListener("afterprint", listenerRef.current);
      listenerRef.current = null;
      setLoading(false);
    };

    listenerRef.current = cleanup;
    window.addEventListener("afterprint", cleanup, { once: true });
    timerRef.current = setTimeout(cleanup, 15000);

    window.print();
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
