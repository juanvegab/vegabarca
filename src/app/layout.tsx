import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import { ClerkProvider } from "@clerk/nextjs";
import { Inter } from "next/font/google";
import ThemeProvider from "./ThemeProvider";
import "./globals.css";
import prisma from "@/lib/db/prisma";
import { ChatProvider } from "@/contexts/ChatContext";
import AIChatBox from "@/components/AIChatBox";
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning={true}>
        <body className={inter.className}>
          <ThemeProvider>
            <ChatProvider>
              {children}
              <AIChatBox />
            </ChatProvider>
          </ThemeProvider>
          <Analytics />
        </body>
      </html>
    </ClerkProvider>
  );
}
