"use client";

import React, { useState } from "react";
import Image from "next/image";
import Script from "next/script";

interface MovieViewingComponentProps {
  videoId: string;
  title?: string;
  description?: string;
  uploadDate?: string; // Format: "YYYY-MM-DD"
  thumbnailUrl?: string;
  showCaption?: boolean;
}

const MovieViewingComponent: React.FC<MovieViewingComponentProps> = ({
  videoId,
  title = "Tint It Pro Marble Protection Video",
  description = "Watch how Tint It Pro protects marble surfaces using TuffSkin film.",
  uploadDate = "2024-03-10",
  thumbnailUrl,
  showCaption = true,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const thumbUrl = thumbnailUrl || `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
  const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: title,
    description,
    thumbnailUrl: [thumbUrl],
    uploadDate,
    contentUrl: videoUrl,
    embedUrl,
    publisher: {
      "@type": "Organization",
      name: "MD Cardiac Anesthesia & Critical Care",
      logo: {
        "@type": "ImageObject",
        url: "https://mdcacc.netlify.app/images/mainLogo.png",
      },
    },
  };

  const handlePlay = () => {
    if (!isPlaying) setIsPlaying(true);
  };

  return (
    <section
      aria-labelledby="video-title"
      style={{
        width: "100%",
        backgroundColor: "var(--primary)",
        padding: "50px 0",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginBottom: "80px",
      }}
    >
      <Script
        id={`video-structured-data-${videoId}`}
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <figure
        style={{
          width: "90%",
          maxWidth: "1200px",
          position: "relative",
          paddingBottom: "56.25%",
          height: 0,
          border: "5px solid #fff",
          borderRadius: "12px",
          overflow: "hidden",
        }}
      >
        {isPlaying ? (
          <iframe
            src={embedUrl}
            title={title}
            frameBorder="0"
            allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            loading="lazy"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
            }}
          />
        ) : (
          <div
            onClick={handlePlay}
            onMouseEnter={handlePlay}
            role="button"
            aria-label={`Play video: ${title}`}
            style={{
              cursor: "pointer",
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
            }}
          >
            <Image
              src={thumbUrl}
              alt={`Thumbnail for ${title}`}
              fill
              sizes="(max-width: 768px) 100vw, 1200px"
              style={{ objectFit: "cover" }}
              priority
            />
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: "70px",
                height: "70px",
                background: "url('/images/play.svg') no-repeat center center",
                backgroundSize: "contain",
              }}
            />
          </div>
        )}
        {showCaption && (
          <figcaption
            id="video-title"
            style={{
              textAlign: "center",
              marginTop: "20px",
              color: "#fff",
              fontWeight: "bold",
              fontSize: "1.1rem",
            }}
          >
            {title}
          </figcaption>
        )}
      </figure>
    </section>
  );
};

export default MovieViewingComponent;
