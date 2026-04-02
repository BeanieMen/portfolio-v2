"use client";

import Link from "next/link";
import { Moon, Sun, Volume2, VolumeX } from "lucide-react";
import { useTheme } from "next-themes";
import { ReactNode, useEffect, useRef, useState } from "react";

const playlist = ["/music/beleza-pula.mp3"];

function IconControl({
  onClick,
  label,
  children,
}: {
  onClick: () => void;
  label: string;
  children: ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className="rounded-xl px-2 py-2 flex items-center justify-center text-[#d0d0c9] transition hover:bg-white/10"
      type="button"
    >
      <span className="flex items-center justify-center">{children}</span>
    </button>
  );
}

export default function Navbar() {
  const { resolvedTheme, setTheme } = useTheme();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [mounted, setMounted] = useState(false);
  const [playing, setPlaying] = useState(false);

  useEffect(() => setMounted(true), []);

  const isDark = mounted && resolvedTheme === "dark";

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

  function toggleTheme() {
    if (!mounted) return;
    setTheme(isDark ? "light" : "dark");
  }

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

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 p-3 flex w-full justify-center bg-gradient-to-b from-[#111617]/94 via-[#0f1415]/85 to-transparent backdrop-blur-sm border-b border-transparent [border-image:linear-gradient(to_right,transparent,#3a3c3a,#3a3c3a,transparent)_1]">
      <div className=" w-full px-1 sm:px-2 md:px-3 lg:px-4 flex items-center justify-between">
        <div className="flex items-center gap-2 px-3 py-2 border border-[#313533] rounded-3xl text-[#e2e4dc]">
          <span className="w-3 h-3 sm:w-4 sm:h-4 rounded-3xl bg-[#e2e4dc]" />
          <Link href="/" className="text-sm sm:text-lg">
            Beanie
          </Link>
        </div>

        <div className="flex items-center border border-[#313533] rounded-3xl px-3 py-2 gap-2 text-[#d0d0c9]">
          <Link href="#blogs" className="px-2 py-1 text-base rounded-lg transition hover:text-white">
            Blogs
          </Link>
          <IconControl onClick={toggleAudio} label="Toggle music">
            {playing ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
          </IconControl>
          <IconControl onClick={toggleTheme} label="Toggle theme">
            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </IconControl>
        </div>

        <Link
          href="#contact"
          className="flex items-center gap-1 border border-[#313533] rounded-3xl px-4 py-2 text-[#e2e4dc] text-base transition hover:text-white"
        >
          Contact Me
        </Link>
      </div>
      <audio ref={audioRef} src={playlist[0]} preload="none" />
    </nav>
  );
}
