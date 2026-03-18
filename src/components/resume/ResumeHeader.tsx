import { Github, Linkedin, Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";

export default function ResumeHeader() {
  return (
    <header className="mb-8 border-b pb-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">
            Juan Carlos Vega Abarca
          </h1>
          <p className="mt-1 text-xl font-medium text-blue-600 dark:text-blue-400">
            Agentic AI &amp; Full-Stack Engineer
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            15+ years of experience · MIT Applied AI &amp; Data Science Certified
          </p>
        </div>

        <address className="mt-4 flex flex-col gap-1.5 text-sm not-italic sm:mt-0 sm:text-right">
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

      <div className="mt-6 max-w-3xl text-sm leading-relaxed text-muted-foreground">
        <p>
          Software engineer with 15+ years of experience building robust
          full-stack applications. Currently specializing in Agentic AI systems,
          LLM integration, and AI-powered product development. MIT Professional
          Education certified in Applied AI &amp; Data Science. Passionate about
          building intelligent tools that automate workflows and create smarter
          user experiences.
        </p>
      </div>
    </header>
  );
}
