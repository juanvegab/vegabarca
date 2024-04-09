"use client";

import { ThemeProvider } from "next-themes";
import { ReactNode } from "react";

const ThemeProviderWrapper = ({ children }: { children: ReactNode }) => {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={true}
      storageKey="theme"
    >
      {children}
    </ThemeProvider>
  );
};

export default ThemeProviderWrapper;
