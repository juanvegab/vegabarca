"use client";

import { useState } from "react";
import { RefreshCw, Tags } from "lucide-react";

export default function SyncButton() {
  const [syncing, setSyncing] = useState(false);
  const [recategorizing, setRecategorizing] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const handleSync = async () => {
    setSyncing(true);
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
      if (data.created > 0) setTimeout(() => window.location.reload(), 1200);
    } catch (e) {
      setStatus(`Error: ${e}`);
    } finally {
      setSyncing(false);
    }
  };

  const handleRecategorize = async () => {
    setRecategorizing(true);
    setStatus(null);
    try {
      const res = await fetch("/api/admin/sync-technologies", { method: "PATCH" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setStatus(`Re-categorized ${data.updated} technologies.${data.errors?.length ? ` ${data.errors.length} errors.` : ""}`);
      setTimeout(() => window.location.reload(), 1200);
    } catch (e) {
      setStatus(`Error: ${e}`);
    } finally {
      setRecategorizing(false);
    }
  };

  return (
    <div className="flex flex-col items-end gap-1">
      <div className="flex items-center gap-2">
        <button
          onClick={handleRecategorize}
          disabled={recategorizing || syncing}
          className="flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm hover:bg-muted disabled:opacity-50"
        >
          <Tags size={14} className={recategorizing ? "animate-pulse" : ""} />
          {recategorizing ? "Re-categorizing…" : "Re-categorize All"}
        </button>
        <button
          onClick={handleSync}
          disabled={syncing || recategorizing}
          className="flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm hover:bg-muted disabled:opacity-50"
        >
          <RefreshCw size={14} className={syncing ? "animate-spin" : ""} />
          {syncing ? "Syncing…" : "Sync from Experiences"}
        </button>
      </div>
      {status && <p className="text-xs text-muted-foreground">{status}</p>}
    </div>
  );
}
