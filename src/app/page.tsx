import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import logo from "/public/logo.svg";
import Image from "next/image";
import Link from "next/link";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

const Home = () => {
  const { userId } = auth();
  if (userId) redirect("/notes");

  return (
    <main className="flex flex-col items-center justify-center h-screen gap-5">
      <div className="flex items-center gap-4">
        <Image src={logo} alt="Vegabarca" width={300} height={100} />
      </div>
      <p>Web developer porfolio</p>
      <Button asChild>
        <Link href="/notes">Open Notes</Link>
      </Button>
    </main>
  );
};

export default Home;
