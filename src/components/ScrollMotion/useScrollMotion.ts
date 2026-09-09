"use client";

import { useEffect, useRef } from "react";
import { setupScrollReveals } from "./reveal";

export function useScrollMotion() {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (root.current) return setupScrollReveals(root.current);
  }, []);
  return root;
}
