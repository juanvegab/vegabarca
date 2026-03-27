"use client";

import { useState } from "react";

export default function ReindexPage() {
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleReindex = async () => {
    setLoading(true);
    setStatus(null);
    try {
      const res = await fetch("/api/admin/reindex", { method: "POST" });
      const data = await res.json();
      setStatus(JSON.stringify(data, null, 2));
    } catch (e) {
      setStatus(`Error: ${e}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg">
      <h1 className="mb-2 text-2xl font-bold">Re-index Pinecone</h1>
      <p className="mb-6 text-muted-foreground text-sm">
        Re-embeds all experiences, notes, and technologies into Pinecone using
        Voyage AI. Run this once after recreating the index.
      </p>
      <button
        onClick={handleReindex}
        disabled={loading}
        className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Indexing…" : "Run Re-index"}
      </button>
      {status && (
        <pre className="mt-6 rounded-md bg-muted p-4 text-sm">{status}</pre>
      )}
    </div>
  );
}
