"use client";

import { usePathname } from "next/navigation";
import Header from "./Header/Header";
import Footer from "./Footer/Footer2";

export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hasOwnChrome = pathname === "/" || pathname === "/concept" || pathname === "/botox";
  return <>{!hasOwnChrome && <Header />}{children}{!hasOwnChrome && <Footer />}</>;
}
