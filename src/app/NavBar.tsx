"use client";

import Link from "next/link";
import Image from "next/image";
import logo from "/public/logo.svg";
import ThemeToggleButton from "@/components/ThemeToggleButton";
import AIChatButton from "@/components/AIChatButton";

const NavBar = () => {
  return (
    <>
      <nav className="p-4 shadow">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link className="flex items-center gap-1" href="/">
            <Image src={logo} alt="Vegabarca" width={100} />
          </Link>
          <div className="flex items-center gap-2">
            <AIChatButton />
            <ThemeToggleButton />
          </div>
        </div>
      </nav>
    </>
  );
};

export default NavBar;
