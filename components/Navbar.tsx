"use client";

import Link from "next/link";
import { Volume2, VolumeX } from "lucide-react";
import { type MouseEvent, useEffect, useRef, useState } from "react";

const playlist = ["/music/beleza-pula.mp3"];

type NavItem = {
  label: string;
  href: string;
  external?: boolean;
};

const navItems: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Projects", href: "https://github.com/BeanieMen", external: true },
  { label: "About", href: "#about" },
];

export default function Navbar() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const segmentCount = navItems.length + 1;
  const segmentWidth = 100 / segmentCount;

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onEnded = () => {
      audio.currentTime = 0;
      audio.play().catch(() => setPlaying(false));
    };

    audio.addEventListener("ended", onEnded);
    return () => audio.removeEventListener("ended", onEnded);
  }, []);

  async function toggleAudio() {
    if (!audioRef.current) return;

    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
      return;
    }

    try {
      await audioRef.current.play();
      setPlaying(true);
    } catch {
      setPlaying(false);
    }
  }

  function handleSpeakerMouseMove(event: MouseEvent<HTMLButtonElement>) {
    setShowTooltip(true);
    setTooltipPosition({ x: event.clientX + 14, y: event.clientY - 36 });
  }

  return (
    <header className="fixed left-1/2 top-10 z-120 w-full -translate-x-1/2 px-3 md:w-auto md:px-0">
      <nav className="relative">
        <ul
          className="relative mx-auto grid w-full max-w-5xl items-center rounded-full border border-foreground/20 bg-panel/80 px-1 py-2.5 shadow-lg backdrop-blur-md md:mx-0 md:w-auto"
          style={{ gridTemplateColumns: `repeat(${segmentCount}, minmax(0, 1fr))` }}
          onMouseLeave={() => setActiveIndex(0)}
        >
          <div
            className="pointer-events-none absolute top-1.5 bottom-1.5 rounded-full bg-foreground/10 transition-all duration-300 ease-in-out"
            style={{ width: `calc(${segmentWidth}% - 0.5rem)`, left: `calc(${activeIndex * segmentWidth}% + 0.25rem)` }}
            aria-hidden="true"
          />

          {navItems.map((item, index) => (
            <li key={item.label} className="relative z-10 text-center">
              {item.external ? (
                <a
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  onMouseEnter={() => setActiveIndex(index)}
                  onFocus={() => setActiveIndex(index)}
                  className="block rounded-full px-1.5 py-2.5 text-[0.72rem] text-text-muted transition-colors duration-200 hover:text-foreground sm:px-2 sm:text-sm md:px-3 md:text-base"
                >
                  {item.label}
                </a>
              ) : (
                <Link
                  href={item.href}
                  onMouseEnter={() => setActiveIndex(index)}
                  onFocus={() => setActiveIndex(index)}
                  className="block rounded-full px-1.5 py-2.5 text-[0.72rem] text-text-muted transition-colors duration-200 hover:text-foreground sm:px-2 sm:text-sm md:px-3 md:text-base"
                >
                  {item.label}
                </Link>
              )}
            </li>
          ))}

          <li className="relative z-10 flex justify-center">
            <button
              type="button"
              onFocus={() => {
                setActiveIndex(navItems.length);
                setShowTooltip(true);
              }}
              onMouseEnter={() => {
                setActiveIndex(navItems.length);
                setShowTooltip(true);
              }}
              onMouseMove={handleSpeakerMouseMove}
              onMouseLeave={() => setShowTooltip(false)}
              onBlur={() => setShowTooltip(false)}
              onClick={toggleAudio}
              aria-label="Toggle music"
              className="rounded-full px-2 py-2.5 text-text-muted transition-colors duration-200 hover:text-foreground"
            >
              {playing ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
            </button>
          </li>
        </ul>
      </nav>

      {showTooltip && (
        <div
          className="pointer-events-none fixed z-140 rounded-md border border-foreground/20 bg-panel px-2 py-1 text-xs text-foreground shadow-md backdrop-blur-sm"
          style={{ left: tooltipPosition.x, top: tooltipPosition.y }}
        >
          listen to my playlist
        </div>
      )}

      <audio ref={audioRef} src={playlist[0]} preload="none" />
    </header>
  );
}
