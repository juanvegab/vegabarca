"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTheme } from "next-themes";
import { dark } from "@clerk/themes";
import { UserButton } from "@clerk/nextjs";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "/public/logo.svg";
import AddEditNoteDialog from "@/components/AddEditNoteDialog";
import ThemeToggleButton from "@/components/ThemeToggleButton";
import AIChatButton from "@/components/AIChatButton";

const NavBar = () => {
  const { theme } = useTheme();
  const [showAddeditNoteDialog, setShowAddeditNoteDialog] = useState(false);

  return (
    <>
      <nav className="p-4 shadow">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link className="flex items-center gap-1" href="/">
            <Image src={logo} alt="Vegabarca" width={100} />
          </Link>
          <div className="flex items-center gap-2">
            <Button onClick={() => setShowAddeditNoteDialog(true)}>
              <Plus className="mr-2" /> Add Note
            </Button>
            <AIChatButton />
            <UserButton
              afterSignOutUrl="/"
              appearance={{
                baseTheme: theme === "dark" ? dark : undefined,
                elements: {
                  avatarBox: {
                    width: "2.5 rem",
                    height: "2.5 rem",
                    border: "2px solid darkblue",
                  },
                },
              }}
            />
            <ThemeToggleButton />
          </div>
        </div>
      </nav>
      <AddEditNoteDialog
        open={showAddeditNoteDialog}
        setOpen={setShowAddeditNoteDialog}
      />
    </>
  );
};

export default NavBar;