"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import styles from "./ThemeToggle.module.css";

const ThemeToggle: React.FC<{ appearance?: "default" | "brand" }> = ({ appearance = "default" }) => {
  const { theme, setTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Trigger the animation on theme change
  useEffect(() => {
    if (mounted && appearance !== "brand") {
      setAnimating(true);
      const timer = setTimeout(() => setAnimating(false), 500);
      return () => clearTimeout(timer);
    }
  }, [theme, systemTheme, mounted, appearance]);

  if (!mounted) return appearance === "brand" ? <button type="button" className={styles.brandButton} disabled aria-label="Change color theme"><span className={styles.brandIcon} aria-hidden="true" /><span className={styles.brandLabel}>Theme</span></button> : null;

  const currentTheme = theme === "system" ? systemTheme : theme;
  const isDark = currentTheme === "dark";
  const actionLabel = appearance === "brand"
    ? isDark ? "Switch to Bright (light mode)" : "Switch to Shaded (dark mode)"
    : isDark ? "Switch to light mode" : "Switch to dark mode";

  const toggleTheme = () => {
    setTheme(currentTheme === "light" ? "dark" : "light");
  };

  // Add the animate class conditionally
  const iconClass = `${styles.icon} ${animating ? styles.animate : ""}`;

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={actionLabel}
      title={actionLabel}
      className={appearance === "brand" ? styles.brandButton : styles.toggleButton}
      data-mode={currentTheme}
    >
      {appearance === "brand" ? <>
        {isDark ? <Sun size={16} strokeWidth={1.5} className={styles.brandIcon} aria-hidden="true" /> : <Moon size={16} strokeWidth={1.5} className={styles.brandIcon} aria-hidden="true" />}
        <span className={styles.brandLabel}>{isDark ? "Bright" : "Shaded"}</span>
      </> : currentTheme === "dark" ? (
        <Sun size={30} color="var(--foreground)" className={iconClass} aria-hidden="true" />
      ) : (
        <Moon size={30} color="var(--foreground)" className={iconClass} aria-hidden="true" />
      )}
    </button>
  );
};

export default ThemeToggle;
