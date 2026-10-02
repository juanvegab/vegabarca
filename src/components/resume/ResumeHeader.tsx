import { Github, Linkedin, Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";

export default function ResumeHeader() {
  return (
    <header className="mb-8 border-b pb-8 print:mb-3 print:pb-3">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight print:text-3xl">
            Juan Carlos Vega Abarca
          </h1>
          <p className="mt-1 text-xl font-medium text-blue-600 dark:text-blue-400 print:text-base print:mt-0">
            Senior Full-Stack Engineer | AI/LLM Applications
          </p>
          <p className="mt-1 text-sm text-muted-foreground print:mt-0">
            San José, Costa Rica (UTC-6) · Remote
          </p>
        </div>

        {/* Contact info — icons hidden globally on print, text only remains */}
        <address className="mt-4 flex flex-col gap-1.5 text-sm not-italic sm:mt-0 sm:text-right print:mt-0 print:gap-0.5 print:text-xs">
          <Link
            href="mailto:juancarlos@vegabarca.com"
            className="flex items-center gap-1.5 hover:text-blue-600 sm:flex-row-reverse"
          >
            <Mail size={14} />
            juancarlos@vegabarca.com
          </Link>
          <Link
            href="tel:+50670123940"
            className="flex items-center gap-1.5 hover:text-blue-600 sm:flex-row-reverse"
          >
            <Phone size={14} />
            (+506) 7012-3940
          </Link>
          <span className="flex items-center gap-1.5 sm:flex-row-reverse">
            <MapPin size={14} />
            San José, Costa Rica
          </span>
          <Link
            href="https://www.linkedin.com/in/juanvegab"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 hover:text-blue-600 sm:flex-row-reverse"
          >
            <Linkedin size={14} />
            linkedin.com/in/juanvegab
          </Link>
          <Link
            href="https://github.com/juanvegab"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 hover:text-blue-600 sm:flex-row-reverse"
          >
            <Github size={14} />
            github.com/juanvegab
          </Link>
        </address>
      </div>

      <div className="mt-6 max-w-3xl text-sm leading-relaxed text-muted-foreground print:mt-2">
        <p>
          Senior Full-Stack Engineer with 15+ years building scalable web and mobile
          applications with React, Next.js, React Native, TypeScript and Node.js.
          Experienced in agentic coding workflows (Claude Code, Cursor) and in building LLM
          applications with the Claude and OpenAI APIs, Vercel AI SDK and RAG.
          Looking for remote Senior/Staff roles on AI-powered products.
        </p>
      </div>
    </header>
  );
}
