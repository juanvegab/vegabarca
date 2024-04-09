import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Inter } from "next/font/google";
import ThemeProvider from "./ThemeProvider";
import "./globals.css";
import { cookies } from "next/headers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Vegabarca",
  description: "Portfolio of Vegabarca",
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
      <html lang="en" className={theme} style={{ colorScheme: theme }}>
        <body className={inter.className}>
          <ThemeProvider>{children}</ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
