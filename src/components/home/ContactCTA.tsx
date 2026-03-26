import { Button } from "@/components/ui/button";
import { Mail, Linkedin, FileText } from "lucide-react";
import Link from "next/link";

export default function ContactCTA() {
  return (
    <section className="border-t bg-muted/30 py-20">
      <div className="mx-auto max-w-3xl px-4 text-center">
        <h2 className="mb-3 text-3xl font-bold tracking-tight">
          Let&apos;s Build Something Together
        </h2>
        <p className="mb-8 text-lg text-muted-foreground">
          Open to senior and staff-level roles in AI-first companies. Based in
          Costa Rica — available for remote work globally.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button asChild variant="outline" size="lg">
            <Link href="mailto:juancarlos@vegabarca.com">
              <Mail className="mr-2 h-4 w-4" />
              juancarlos@vegabarca.com
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link
              href="https://www.linkedin.com/in/juanvegab"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Linkedin className="mr-2 h-4 w-4" />
              LinkedIn
            </Link>
          </Button>
          <Button asChild size="lg">
            <Link href="/resume">
              <FileText className="mr-2 h-4 w-4" />
              View Full Resume
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
