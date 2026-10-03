import { Github, Linkedin, Mail, Phone, Globe } from "lucide-react";
import Link from "next/link";

export default function ResumeHeader() {
  return (
    <header className="mb-8 border-b pb-8 print:mb-3 print:pb-3">
      <h1 className="text-4xl font-bold tracking-tight print:text-3xl">
        Juan Carlos Vega Abarca
      </h1>
      <p className="mt-1 text-xl font-medium text-blue-600 dark:text-blue-400 print:text-base print:mt-0">
        Senior Full-Stack Engineer | AI/LLM Applications
      </p>
      <p className="mt-0.5 text-sm text-muted-foreground">
        San José, Costa Rica (UTC-6) · Remote
      </p>

      <address className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm not-italic print:mt-1.5 print:gap-x-3 print:text-xs">
        <Link href="mailto:juancarlos@vegabarca.com" className="flex items-center gap-1.5 hover:text-blue-600">
          <Mail size={13} className="shrink-0" />
          juancarlos@vegabarca.com
        </Link>
        <Link href="tel:+50670123940" className="flex items-center gap-1.5 hover:text-blue-600">
          <Phone size={13} className="shrink-0" />
          (+506) 7012-3940
        </Link>
        <Link
          href="https://www.linkedin.com/in/juanvegab"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 hover:text-blue-600"
        >
          <Linkedin size={13} className="shrink-0" />
          linkedin.com/in/juanvegab
        </Link>
        <Link
          href="https://github.com/juanvegab"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 hover:text-blue-600"
        >
          <Github size={13} className="shrink-0" />
          github.com/juanvegab
        </Link>
        <Link
          href="https://www.vegabarca.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 hover:text-blue-600"
        >
          <Globe size={13} className="shrink-0" />
          www.vegabarca.com
        </Link>
      </address>

      <div className="mt-4 max-w-3xl text-sm leading-relaxed text-muted-foreground print:mt-2">
        <p className="mb-1">
          <span className="font-medium text-foreground">Languages:</span>{" "}
          English (Fluent) · Italian (B1) · Spanish (Native)
        </p>
        <p>
          Senior Full-Stack Engineer with 15+ years building web and mobile
          applications with React, Next.js, React Native, TypeScript and Node.js.
          Experienced in agentic coding workflows (Claude Code, Cursor) and in building LLM
          applications with the Claude and OpenAI APIs, Vercel AI SDK and RAG.
          Looking for remote Senior roles on AI products.
        </p>
      </div>
    </header>
  );
}

