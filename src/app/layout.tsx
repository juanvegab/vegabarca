import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Inter } from "next/font/google";
import ThemeProvider from "./ThemeProvider";
import "./globals.css";
import { cookies } from "next/headers";
import NavBar from "./NavBar";
import prisma from "@/lib/db/prisma";

const inter = Inter({ subsets: ["latin"] });

export const generateMetadata = async (): Promise<Metadata> => {
  const allExperiences = await prisma.experience.findMany({});
  const allTechnologies = allExperiences
    .map((experience) => experience.techStack)
    .flat();
  return {
    title: {
      default: "Juan Carlos Vega - Software Developer - Portfolio",
      template: "%s | Juan Carlos Vega",
    },
    description: "Check all my projects and learn more about me.",
    twitter: {
      site: "@juanca23vega",
      card: "summary_large_image",
    },
    keywords: [
      "Juan Carlos Vega",
      "Software Developer",
      "Frontend Developer",
      "Fullstack Developer",
      "Web Developer",
      "Costa Rica",
      ...allTechnologies,
    ],
  };
};

function getTheme() {
  const cookieStore = cookies();
  const themeCookie = cookieStore.get("theme");
  const theme = themeCookie ? themeCookie.value : "dark";
  return theme;
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const theme = getTheme() as string;

  return (
    <ClerkProvider>
      <html
        lang="en"
        className={theme}
        style={{ colorScheme: theme }}
        suppressHydrationWarning={true}
      >
        <body className={inter.className}>
          <ThemeProvider>
            <NavBar />
            {children}
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
