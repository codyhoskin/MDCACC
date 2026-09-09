"use client";
import React, { useEffect, useRef } from "react";
import Image from "next/image";
import TitleSection from "./TitleSection";

interface TitleOverlayProps {
  scrollOffsetRef: React.MutableRefObject<number>;
}

const TitleOverlay: React.FC<TitleOverlayProps> = ({ scrollOffsetRef }) => {
  const logoRef = useRef<HTMLDivElement>(null!);
  const titleRef = useRef<HTMLDivElement>(null!);

  useEffect(() => {
    let animationFrameId: number;

    const animate = () => {
      const offset = scrollOffsetRef.current;

      // --- LOGO ANIMATION ---
      let logoY = 0;
      if (offset < 0.2) {
        const progress = offset / 0.2;
        logoY = 200 * (1 - progress);
      } else if (offset >= 0.2 && offset < 0.4) {
        const progress = (offset - 0.2) / 0.2;
        logoY = -500 * progress;
      } else {
        logoY = -500;
      }

      if (logoRef.current) {
        logoRef.current.style.transform = `translateY(${logoY}px)`;
      }

      // --- TITLE ANIMATION ---
      let titleY = 200;
      let titleX = 0;
      
      if (offset < 0.3) {
        titleY = 200;
      } else if (offset >= 0.3 && offset < 0.6) {
        const progress = (offset - 0.3) / 0.3;
        titleY = 200 - (820 * progress); // Animate in earlier
      } else if (offset >= 0.6 && offset < 0.85) {
        titleY = -620; // Pause earlier
      } else if (offset >= 0.85 && offset <= 1.05) {
        const progress = (offset - 0.85) / 0.2;
        titleY = -620;
        titleX = -window.innerWidth * 1.5 * progress;
      } else {
        titleX = -window.innerWidth * 1.5;
        titleY = -620;
      }
      

      if (titleRef.current) {
        titleRef.current.style.transform = `translate(${titleX}px, ${titleY}px)`;
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => cancelAnimationFrame(animationFrameId);
  }, [scrollOffsetRef]);

  return (
    <div
      style={{
        position: "fixed",
        top: "80%",
        left: "52%",
        transform: "translate(-50%, -50%)",
        pointerEvents: "none",
        zIndex: 10,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "400px",
        }}
      >
        {/* Logo */}
        <div ref={logoRef} style={{ transition: "transform 0.1s ease-out" }}>
          <Image
            src="/images/logoRectangle.png"
            alt="Logo Overlay"
            width={320}
            height={70}
            loading="eager"
          />
        <div style={{padding: "20px"}}>
        <TitleSection title="Your Critical Care Experts" align="left"/>
        </div>
        </div>

        {/* Title */}
        <div
          ref={titleRef}
          style={{
            transition: "transform 0.1s ease-out",
        
          }}
        >
          <TitleSection title="Know Every Beat Counts." />
        </div>
      </div>
    </div>
  );
};

export default TitleOverlay;
