"use client";

import { useEffect, useState } from "react";
import Background from "@/components/Background";
import { MapPin, Download } from "lucide-react";
import { Icon } from "@iconify/react";
import { skills, SkillBadge } from "@/components/Skills";
import Footer from "@/components/Footer";
import IntroCurtain from "@/components/IntroCurtain";

function formatKolkataTime() {
  const options: Intl.DateTimeFormatOptions = {
    timeZone: "Asia/Kolkata",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  };

  return new Intl.DateTimeFormat("en-US", options).format(new Date());
}

function HeroActions() {
  return (
    <div className="flex flex-row items-stretch gap-3 w-full lg:w-auto">
      <a
        href="/resume.pdf"
        download="Aarjav_Jain_Resume.pdf"
        className="flex-grow lg:flex-grow-0 flex items-center justify-center gap-2 px-5 py-2.5 border border-foreground text-foreground rounded-lg hover:bg-foreground hover:text-background transition font-semibold text-base"
      >
        <Download className="w-5 h-5" />
        <span>Resume</span>
      </a>
      <a
        href="https://github.com/BeanieMen"
        target="_blank"
        rel="noreferrer"
        className="flex-grow lg:flex-grow-0 flex items-center justify-center gap-2 px-5 py-2.5 border border-foreground text-foreground rounded-lg hover:bg-foreground hover:text-background transition font-semibold text-base"
        aria-label="Visit BeanieMen's GitHub profile"
      >
        <Icon icon="mdi:github" className="w-6 h-6" />
      </a>
    </div>
  );
}

export default function Page() {
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const firstFrame = requestAnimationFrame(() => setCurrentTime(formatKolkataTime()));
    const intervalId = setInterval(() => setCurrentTime(formatKolkataTime()), 1000);
    return () => {
      cancelAnimationFrame(firstFrame);
      clearInterval(intervalId);
    };
  }, []);

  return (
    <div className="relative w-screen min-h-screen overflow-x-hidden bg-background text-foreground">
      <IntroCurtain />
      <Background />
      <div className="relative z-10 max-w-2xl lg:max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 pt-32 sm:pb-28 sm:pt-36">
        <header id="about" className="flex flex-col items-start mb-16 lg:mb-20">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-3 tracking-tight">Aarjav Jain</h1>
          <p className="text-text-muted text-lg sm:text-xl lg:text-2xl mb-2 font-medium">Infrastructure and music enthusiast..</p>

          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-text-muted text-base sm:text-lg mb-8 lg:mb-10">
            <span className="flex items-center gap-2">
              <MapPin className="w-5 h-5" /> Delhi, India
            </span>
            <span className="hidden sm:inline">•</span>
            <span className="font-mono">{currentTime}</span>
          </div>
          <HeroActions />
        </header>

        <section id="skills">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold mb-6 lg:mb-8 tracking-tight">Skills</h2>
          <div className="flex flex-wrap gap-3 sm:gap-4">
            {skills.map((skill) => (
              <SkillBadge key={skill.name} skill={skill} />
            ))}
          </div>
        </section>
      </div>

      <div id="contact" className="relative z-10 mt-4 flex justify-center pb-10">
        <Footer />
      </div>
    </div>
  );
}
