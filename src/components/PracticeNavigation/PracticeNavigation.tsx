"use client";

import { useEffect, useId, useRef } from "react";
import Link from "next/link";
import { ArrowUpRight, Menu } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle/ThemeToggle";
import styles from "./PracticeNavigation.module.css";

export default function PracticeNavigation({ page }: { page: "practice" | "botox" }) {
  const menu = useRef<HTMLDetailsElement>(null);
  const menuId = useId();
  const isBotox = page === "botox";
  const links = [
    { href: isBotox ? "/#practice" : "#practice", label: "Our approach" },
    { href: isBotox ? "/#physician" : "#physician", label: "Your physician" },
    { href: "/botox", label: "Botox services", current: isBotox },
    { href: isBotox ? "/#faq" : "#faq", label: "FAQ" },
  ];

  useEffect(() => {
    // Keep anchor targets clear of the fixed header, including wrapped text and zoom.
    const header = menu.current?.closest("header");
    const root = document.documentElement;
    const updateHeaderHeight = () => {
      if (header) root.style.setProperty("--practice-header-height", `${header.getBoundingClientRect().height}px`);
    };
    updateHeaderHeight();
    const headerObserver = new ResizeObserver(updateHeaderHeight);
    if (header) headerObserver.observe(header);
    const closeOutside = (event: PointerEvent) => {
      if (event.target instanceof Node && !menu.current?.contains(event.target)) menu.current?.removeAttribute("open");
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && menu.current?.open) {
        menu.current.removeAttribute("open");
        menu.current.querySelector("summary")?.focus();
      }
    };
    const desktop = window.matchMedia("(min-width: 1101px)");
    const closeOnDesktop = () => { if (desktop.matches) menu.current?.removeAttribute("open"); };
    document.addEventListener("pointerdown", closeOutside);
    document.addEventListener("keydown", closeOnEscape);
    desktop.addEventListener("change", closeOnDesktop);
    return () => {
      headerObserver.disconnect();
      root.style.removeProperty("--practice-header-height");
      document.removeEventListener("pointerdown", closeOutside);
      document.removeEventListener("keydown", closeOnEscape);
      desktop.removeEventListener("change", closeOnDesktop);
    };
  }, []);

  const navigationLinks = links.map(link => <Link key={link.href} href={link.href} aria-current={link.current ? "page" : undefined} onClick={() => menu.current?.removeAttribute("open")}>{link.label}</Link>);

  return (
    <div className={styles.tools}>
      <nav className={styles.desktop} aria-label="Main navigation">
        {navigationLinks}
        {isBotox && <a className={styles.booking} href="#booking">Availability <ArrowUpRight size={16} aria-hidden="true" /></a>}
      </nav>
      <ThemeToggle appearance="brand" />
      <details className={styles.menu} ref={menu}>
        <summary aria-label="Navigation menu" aria-controls={menuId}><Menu size={20} aria-hidden="true" /><span>Menu</span></summary>
        <nav id={menuId} aria-label="Mobile navigation">
          <Link href="/" onClick={() => menu.current?.removeAttribute("open")}>Practice home</Link>
          {navigationLinks}
          {isBotox && <a className={styles.booking} href="#booking" onClick={() => menu.current?.removeAttribute("open")}>Appointment availability <ArrowUpRight size={16} aria-hidden="true" /></a>}
        </nav>
      </details>
    </div>
  );
}
