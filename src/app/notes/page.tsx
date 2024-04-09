import Note from "@/components/Note";
import prisma from "@/lib/db/prisma";
import { auth } from "@clerk/nextjs";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Vegabarca - Notes",
};

const Notes = async () => {
  const { userId } = auth();
  if (!userId) return redirect("/sign-in");

  const allNotes = await prisma.note.findMany({ where: { userId } });

  return (
    <main className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {allNotes.map((note) => (
        <Note key={note.id} note={note} />
      ))}
      {allNotes.length === 0 && (
        <p className="col-span-full">{`You don't have any notes`}</p>
      )}
    </main>
  );
};

export default Notes;
