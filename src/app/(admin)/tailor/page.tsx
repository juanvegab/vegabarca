"use client";

import { useState } from "react";

type TailoredResult = {
  id: string;
  company: string;
  position: string;
  visibleSummary: string;
};

export default function TailorPage() {
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [results, setResults] = useState<TailoredResult[] | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  const handleTailor = async () => {
    if (!jobDescription.trim()) return;
    setLoading(true);
    setStatus(null);
    setResults(null);
    try {
      const res = await fetch("/api/experiences/tailor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobDescription }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setResults(data.results);
      setStatus(`Tailored ${data.tailored} experiences successfully.`);
    } catch (e) {
      setStatus(`Error: ${e}`);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = async () => {
    setClearing(true);
    setStatus(null);
    try {
      const res = await fetch("/api/experiences/tailor", { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setResults(null);
      setJobDescription("");
      setStatus("Cleared — resume is back to original content.");
    } catch (e) {
      setStatus(`Error: ${e}`);
    } finally {
      setClearing(false);
    }
  };

  return (
    <div className="max-w-3xl">
      <h1 className="mb-1 text-2xl font-bold">Resume Tailor</h1>
      <p className="mb-6 text-sm text-muted-foreground">
        Paste a job description and Claude will rewrite each experience&apos;s
        bullets to match it. The live resume will use the tailored version until
        you clear it.
      </p>

      <textarea
        value={jobDescription}
        onChange={(e) => setJobDescription(e.target.value)}
        placeholder="Paste the job description here…"
        rows={10}
        className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <div className="mt-3 flex gap-3">
        <button
          onClick={handleTailor}
          disabled={loading || !jobDescription.trim()}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Tailoring…" : "Tailor Resume"}
        </button>
        <button
          onClick={handleClear}
          disabled={clearing}
          className="rounded-md border px-4 py-2 text-sm hover:bg-muted disabled:opacity-50"
        >
          {clearing ? "Clearing…" : "Clear Tailoring"}
        </button>
      </div>

      {status && (
        <p className="mt-4 text-sm text-muted-foreground">{status}</p>
      )}

      {results && results.length > 0 && (
        <div className="mt-6 space-y-6">
          <h2 className="text-lg font-semibold">Preview</h2>
          {results.map((r) => (
            <div key={r.id} className="rounded-md border p-4">
              <p className="mb-2 font-medium">
                {r.position} — {r.company}
              </p>
              <ul className="list-disc space-y-1 pl-4 text-sm text-muted-foreground">
                {r.visibleSummary.split("\n").filter(Boolean).map((line, i) => (
                  <li key={i}>{line.replace(/^[-•]\s*/, "")}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
