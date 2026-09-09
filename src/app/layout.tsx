import type { Metadata } from "next";
import ThemeProviderWrapper from "../util/ThemeProviderWrapper";
import "./globals.css";
import SiteChrome from "@/components/SiteChrome";
//import Footer from "@/components/Footer/Footer";
import localFont from "next/font/local";
import { siteUrl, siteName, siteDescription } from "@/util/site";


const interFontBold = localFont({
  src: "./fonts/inter.ttf",
  variable: "--font-inter-bold",
  weight: "900",
  display: "swap",
});

const interFontThin = localFont({
  src: "./fonts/inter.ttf",
  variable: "--font-inter-thin",
  weight: "600",
  display: "swap",
});


export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteName,
    template: "%s | MDCACC",
  },
  description: siteDescription,
  openGraph: {
    title: siteName,
    description: siteDescription,
    url: "/",
    siteName,
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/images/mainLogo.png",
        alt: siteName,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MDCACC",
    description: "Cardiac Anesthesia and Critical Care",
    images: ["/images/mainLogo.png"],
    creator: "@mdcacc",
  },
  icons: {
    icon: "/favicon.ico",
  },
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${interFontBold.variable} ${interFontThin.variable}`}
      suppressHydrationWarning
    >
      <body>
        <ThemeProviderWrapper>  
          <SiteChrome>{children}</SiteChrome>
        </ThemeProviderWrapper>
      </body>
    </html>
  );
}
