"use client";

import Link from "next/link";
import ThemeToggleButton from "@/components/ThemeToggleButton";
import AIChatButton from "@/components/AIChatButton";
import LogoMark from "@/components/LogoMark";

const NavBar = () => {
  return (
    <>
      <nav className="p-4 shadow">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link href="/">
            <LogoMark />
          </Link>
          <div className="flex items-center gap-2">
            <Link
              href="/resume"
              className="rounded-md px-3 py-1.5 text-sm font-medium hover:bg-accent"
            >
              Resume
            </Link>
            <AIChatButton />
            <ThemeToggleButton />
          </div>
        </div>
      </nav>
    </>
  );
};

export default NavBar;
