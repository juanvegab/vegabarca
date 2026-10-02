"use client";

import { useState } from "react";
import { RefreshCw } from "lucide-react";

export default function SyncButton() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const handleSync = async () => {
    setLoading(true);
    setStatus(null);
    try {
      const res = await fetch("/api/admin/sync-technologies", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setStatus(
        data.created === 0
          ? data.message
          : `Created ${data.created} new technologies.${data.errors?.length ? ` ${data.errors.length} errors.` : ""}`,
      );
      if (data.created > 0) {
        setTimeout(() => window.location.reload(), 1200);
      }
    } catch (e) {
      setStatus(`Error: ${e}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        onClick={handleSync}
        disabled={loading}
        className="flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm hover:bg-muted disabled:opacity-50"
      >
        <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
        {loading ? "Syncing…" : "Sync from Experiences"}
      </button>
      {status && <p className="text-xs text-muted-foreground">{status}</p>}
    </div>
  );
}
