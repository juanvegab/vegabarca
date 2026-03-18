import { Badge } from "@/components/ui/badge";
import { GraduationCap } from "lucide-react";

const courseHighlights = [
  "Machine Learning & Deep Learning",
  "Neural Networks & TensorFlow",
  "Natural Language Processing (NLP)",
  "Large Language Models (LLMs)",
  "Model Training & Evaluation",
  "AI Workflow Automation",
  "Data Science & Analytics",
];

export default function MITCertSpotlight() {
  return (
    <section
      aria-labelledby="mit-cert-heading"
      className="mb-8 rounded-xl border border-amber-300 bg-amber-50 px-6 py-5 shadow-sm dark:border-amber-700 dark:bg-amber-950/20"
    >
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-amber-200 dark:bg-amber-800">
          <GraduationCap className="text-amber-800 dark:text-amber-200" size={24} />
        </div>
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2
              id="mit-cert-heading"
              className="text-lg font-bold text-amber-900 dark:text-amber-100"
            >
              MIT Professional Education
            </h2>
            <Badge
              variant="outline"
              className="border-amber-400 text-amber-800 dark:border-amber-600 dark:text-amber-200"
            >
              Certified
            </Badge>
          </div>
          <p className="text-sm font-semibold text-amber-800 dark:text-amber-200">
            Applied AI &amp; Data Science Program
          </p>
          <p className="mt-0.5 text-xs text-amber-700 dark:text-amber-400">
            September 2025 – January 2026
          </p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {courseHighlights.map((topic) => (
              <Badge
                key={topic}
                className="bg-amber-200 text-amber-900 hover:bg-amber-300 dark:bg-amber-800 dark:text-amber-100"
              >
                {topic}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
