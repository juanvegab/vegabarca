"use client";

import { useState } from "react";
import { RefreshCw, Tags, Wand2 } from "lucide-react";

export default function SyncButton() {
  const [syncing, setSyncing] = useState(false);
  const [recategorizing, setRecategorizing] = useState(false);
  const [tailoring, setTailoring] = useState(false);
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

  const handleTailor = async () => {
    setTailoring(true);
    setStatus(null);
    try {
      const res = await fetch("/api/experiences/tailor-skills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobDescription: "" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setStatus(
        `Curated: ${data.updated} updated, ${data.hidden} hidden.${data.notFound?.length ? ` Not found: ${data.notFound.join(", ")}.` : ""}`,
      );
      setTimeout(() => window.location.reload(), 1800);
    } catch (e) {
      setStatus(`Error: ${e}`);
    } finally {
      setTailoring(false);
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
          onClick={handleTailor}
          disabled={tailoring || syncing || recategorizing}
          className="flex items-center gap-2 rounded-md border border-blue-200 bg-blue-50 px-3 py-1.5 text-sm text-blue-700 hover:bg-blue-100 disabled:opacity-50 dark:border-blue-800 dark:bg-blue-950/20 dark:text-blue-300"
        >
          <Wand2 size={14} className={tailoring ? "animate-pulse" : ""} />
          {tailoring ? "Curating…" : "Curate Skills"}
        </button>
        <button
          onClick={handleRecategorize}
          disabled={recategorizing || syncing || tailoring}
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
