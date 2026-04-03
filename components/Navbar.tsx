"use client";

import Link from "next/link";
import { Volume2, VolumeX } from "lucide-react";
import { type MouseEvent, useEffect, useRef, useState } from "react";

const playlist = ["/music/beleza-pula.mp3"];

export default function Navbar() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

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
    <header className="fixed left-1/2 top-10 z-[120] w-full -translate-x-1/2 px-3 md:w-auto md:px-0">
      <nav className="relative">
        <ul
          className="relative mx-auto grid w-full max-w-3xl grid-cols-4 items-center rounded-full border border-foreground/20 bg-panel/80 px-1 py-2.5 shadow-lg backdrop-blur-md md:mx-0 md:w-auto"
          onMouseLeave={() => setActiveIndex(0)}
        >
          <div
            className="pointer-events-none absolute top-1.5 bottom-1.5 rounded-full bg-foreground/10 transition-all duration-300 ease-in-out"
            style={{ width: "calc(25% - 0.5rem)", left: `calc(${activeIndex * 25}% + 0.25rem)` }}
            aria-hidden="true"
          />

          <li className="relative z-10 text-center">
            <Link
              href="/"
              onMouseEnter={() => setActiveIndex(0)}
              onFocus={() => setActiveIndex(0)}
              className="block rounded-full px-2 py-2.5 text-sm text-text-muted transition-colors duration-200 hover:text-foreground md:px-4 md:text-base"
            >
              Home
            </Link>
          </li>

          <li className="relative z-10 text-center">
            <a
              href="https://github.com/BeanieMen"
              target="_blank"
              rel="noreferrer"
              onMouseEnter={() => setActiveIndex(1)}
              onFocus={() => setActiveIndex(1)}
              className="block rounded-full px-2 py-2.5 text-sm text-text-muted transition-colors duration-200 hover:text-foreground md:px-4 md:text-base"
            >
              Projects
            </a>
          </li>

          <li className="relative z-10 text-center">
            <Link
              href="#about"
              onMouseEnter={() => setActiveIndex(2)}
              onFocus={() => setActiveIndex(2)}
              className="block rounded-full px-2 py-2.5 text-sm text-text-muted transition-colors duration-200 hover:text-foreground md:px-4 md:text-base"
            >
              About Me
            </Link>
          </li>

          <li className="relative z-10 flex justify-center">
            <button
              type="button"
              onFocus={() => {
                setActiveIndex(3);
                setShowTooltip(true);
              }}
              onMouseEnter={() => {
                setActiveIndex(3);
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
          className="pointer-events-none fixed z-[140] rounded-md border border-foreground/20 bg-panel px-2 py-1 text-xs text-foreground shadow-md backdrop-blur-sm"
          style={{ left: tooltipPosition.x, top: tooltipPosition.y }}
        >
          listen to my playlist
        </div>
      )}

      <audio ref={audioRef} src={playlist[0]} preload="none" />
    </header>
  );
}
