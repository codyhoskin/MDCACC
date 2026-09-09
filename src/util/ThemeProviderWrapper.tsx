"use client";

import { ThemeProvider } from "next-themes";

const ThemeProviderWrapper = ({ children }: { children: React.ReactNode }) => {
  return <ThemeProvider attribute="class" defaultTheme="system">
    {children}</ThemeProvider>;
};

export default ThemeProviderWrapper;
