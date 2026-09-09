import type { Metadata } from "next";
import Botox from "./Botox";
import { siteName } from "@/util/site";

export const metadata: Metadata = {
  title: { absolute: "Botox Consultations & Treatments — MDCACC" },
  description: "Botox consultations and treatments at MD Cardiac Anesthesia & Critical Care. View appointment availability.",
  alternates: { canonical: "/botox" },
  openGraph: {
    title: "Botox Consultations & Treatments — MDCACC",
    description: "Botox consultations and treatments at MD Cardiac Anesthesia & Critical Care. View appointment availability.",
    url: "/botox",
    siteName,
    type: "website",
    images: [{ url: "/images/mainLogo.png", alt: siteName }],
  },
};

export default function BotoxPage() {
  return <Botox />;
}
