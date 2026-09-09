"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { getParallaxOffset, PARALLAX_OVERSCAN } from "./parallax";
import styles from "./ParallaxBackground.module.css";

export default function ParallaxBackground({ src, className, position = "center" }: { src: string; className?: string; position?: string }) {
  const layer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = layer.current;
    const section = element?.parentElement;
    if (!element || !section) return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let visible = true;
    let frame = 0;
    const update = () => {
      frame = 0;
      if (preference.matches) {
        element.style.transform = "none";
        element.style.willChange = "auto";
        return;
      }
      if (!visible) return;
      const rect = section.getBoundingClientRect();
      const y = getParallaxOffset(rect.top, rect.height, window.innerHeight, window.innerWidth <= 760);
      element.style.transform = `translate3d(0, ${y.toFixed(2)}px, 0)`;
      element.style.willChange = "transform";
    };
    const requestUpdate = () => { if (!frame) frame = requestAnimationFrame(update); };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      element.style.willChange = visible && !preference.matches ? "transform" : "auto";
      if (visible) requestUpdate();
    });
    const resizeObserver = new ResizeObserver(requestUpdate);
    observer.observe(section);
    resizeObserver.observe(section);
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    preference.addEventListener("change", requestUpdate);
    update();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      resizeObserver.disconnect();
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      preference.removeEventListener("change", requestUpdate);
    };
  }, []);

  return <div ref={layer} className={`${styles.layer} ${className ?? ""}`} style={{ top: -PARALLAX_OVERSCAN, bottom: -PARALLAX_OVERSCAN }} aria-hidden="true">
    <Image src={src} alt="" fill sizes="100vw" className={styles.image} style={{ objectPosition: position }} />
  </div>;
}
