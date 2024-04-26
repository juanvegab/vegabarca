import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import { ClerkProvider } from "@clerk/nextjs";
import { Inter } from "next/font/google";
import ThemeProvider from "./ThemeProvider";
import "./globals.css";
import { cookies } from "next/headers";
import NavBar from "./NavBar";
import prisma from "@/lib/db/prisma";
import {
  DEFAULT_SITE_DESCRIPTION,
  DEFAULT_TITLE_VALUES,
  METADATA_COMMON_KEYWORDS,
  SOCIAL_MEDIA_INFO,
} from "@/constants/analitics";

const inter = Inter({ subsets: ["latin"] });

export const generateMetadata = async (): Promise<Metadata> => {
  const allExperiences = await prisma.experience.findMany({});
  const allTechnologies = allExperiences
    .map((experience) => experience.techStack)
    .flat();
  return {
    title: DEFAULT_TITLE_VALUES,
    description: DEFAULT_SITE_DESCRIPTION,
    twitter: SOCIAL_MEDIA_INFO.twitter,
    keywords: [...METADATA_COMMON_KEYWORDS, ...allTechnologies],
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
          <Analytics />
        </body>
      </html>
    </ClerkProvider>
  );
}
