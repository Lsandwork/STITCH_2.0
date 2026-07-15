"use client";

import { useEffect, useRef } from "react";

export function HeroPromoVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Extra gentle slowdown on top of the slower encoded clip
    video.playbackRate = 0.82;

    const play = () => {
      void video.play().catch(() => {
        /* Autoplay may be blocked until user interaction */
      });
    };

    play();
    video.addEventListener("loadeddata", play);
    return () => video.removeEventListener("loadeddata", play);
  }, []);

  return (
    <div className="relative mx-auto w-full max-w-2xl lg:max-w-none">
      <div className="overflow-hidden rounded-stitch-xl border border-stitch-border bg-stitch-cream shadow-stitch-floating">
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster="/assets/marketing/hero-plush-promo-poster.jpg"
          className="block h-auto w-full bg-stitch-cream object-contain"
          aria-label="Crochet plush projects being crafted with Stitch"
        >
          <source src="/assets/marketing/hero-plush-promo.mp4?v=2" type="video/mp4" />
        </video>
      </div>
    </div>
  );
}
