"use client";

import { useEffect, useState } from "react";

/* eslint-disable @next/next/no-img-element -- remote Pexels photos (static export); move to next/image when we host our own assets */

type Slide = {
  id: number; // Pexels photo id
  caption: string;
  // Keeps the landmark in view when a tall photo is cropped to a wide hero.
  position: string;
};

// Free-to-use photos from Pexels (no attribution required): the Kaaba, Al-Masjid an-Nabawi, the Makkah Clock Tower.
const slides: readonly Slide[] = [
  { id: 36573970, caption: "The Kaaba, Makkah", position: "50% 35%" },
  { id: 33840568, caption: "Al-Masjid an-Nabawi, Madinah", position: "50% 52%" },
  { id: 27291499, caption: "Abraj Al Bait Clock Tower, Makkah", position: "50% 40%" },
];

const src = (id: number, width: number) => `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${width}`;
const INTERVAL_MS = 6500;

// Full-bleed background photos for the landing hero: a slow crossfade, still for visitors who prefer less motion.
export function HeroSlides() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduce.matches || paused) return;
    const timer = setInterval(() => setActive((i) => (i + 1) % slides.length), INTERVAL_MS);
    return () => clearInterval(timer);
  }, [paused]);

  return (
    <>
      <div aria-hidden="true" className="absolute inset-0 bg-night">
        {slides.map((slide, i) => (
          <img
            key={slide.id}
            src={src(slide.id, 1920)}
            srcSet={`${src(slide.id, 800)} 800w, ${src(slide.id, 1920)} 1920w`}
            sizes="100vw"
            alt=""
            loading={i === 0 ? "eager" : "lazy"}
            fetchPriority={i === 0 ? "high" : "auto"}
            decoding="async"
            style={{ objectPosition: slide.position }}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[1600ms] ease-in-out motion-reduce:transition-none ${i === active ? "opacity-100" : "opacity-0"}`}
          />
        ))}
        {/* Dark wash so the text stays readable on any photo. */}
        <div className="absolute inset-0 bg-gradient-to-r from-night/90 via-night/60 to-night/25" />
        <div className="absolute inset-0 bg-gradient-to-t from-night/70 via-transparent to-night/30" />
      </div>

      <div className="absolute inset-x-0 bottom-4 z-10">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <p className="font-mono text-xs text-white/80" aria-live="polite">
            {slides[active]?.caption}
          </p>
          <div className="flex gap-2" role="group" aria-label="Background photo">
            {slides.map((slide, i) => (
              <button
                key={slide.id}
                type="button"
                aria-label={`Show ${slide.caption}`}
                aria-pressed={i === active}
                onClick={() => {
                  setActive(i);
                  setPaused(true);
                }}
                className={`h-2 rounded-full transition-all ${i === active ? "w-6 bg-white" : "w-2 bg-white/50 hover:bg-white/80"}`}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
