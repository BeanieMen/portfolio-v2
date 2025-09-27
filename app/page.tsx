"use client";

import React, { useEffect, useState } from "react";
import Background from "@/components/Background";
import { MapPin, Download, Github } from "lucide-react";
import { Icon } from "@iconify/react";
import ChatWidget from "@/components/ChatWidget"; // <-- imported chat widget

const skills = [
  { name: "TypeScript", icon: "logos:typescript-icon", url: "https://www.typescriptlang.org/" },
  { name: "Docker", icon: "logos:docker-icon", url: "https://www.docker.com/" },
  { name: "CI/CD", icon: "logos:github-actions", url: "https://github.com/features/actions" },
  { name: "Git", icon: "logos:git-icon", url: "https://git-scm.com/" },
  { name: "Linux", icon: "logos:linux-tux", url: "https://www.linux.org/" },
  { name: "Three.js", icon: "logos:threejs", url: "https://threejs.org/" },
  { name: "WebGL", icon: "mdi:cube-scan", url: "https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API" },
];

export default function Page() {
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    function updateTime() {
      const options: Intl.DateTimeFormatOptions = {
        timeZone: "Asia/Kolkata",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      };
      setCurrentTime(new Intl.DateTimeFormat("en-US", options).format(new Date()));
    }

    updateTime();
    const intervalId = setInterval(updateTime, 1000);
    return () => clearInterval(intervalId);
  }, []);

  const downloadResume = async () => {
    const response = await fetch("/resume.pdf");
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "resume.pdf";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="relative w-screen min-h-screen overflow-x-hidden bg-[#161616] font-manrope">
      <Background />
      <div className="relative z-10 max-w-2xl lg:max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
        <header className="flex flex-col items-start mb-16 lg:mb-20">
          <h1 className="text-white text-4xl md:text-5xl lg:text-6xl font-bold mb-3">Aarjav Jain</h1>
          <p className="text-[#a0a0a0] text-lg sm:text-xl lg:text-2xl mb-2">Infrastructure enthusiast.</p>

          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-[#a0a0a0] text-base sm:text-lg lg:text-xl mb-8 lg:mb-10">
            <span className="flex items-center gap-2">
              <MapPin className="w-5 h-5 lg:w-6 lg:h-6" /> Delhi, India
            </span>
            <span className="hidden sm:inline">•</span>
            <span>{currentTime}</span>
          </div>

          <div className="flex flex-row items-stretch gap-3 w-full lg:w-auto">
            <button
              onClick={downloadResume}
              className="flex-grow lg:flex-grow-0 flex items-center justify-center gap-2 px-5 py-2.5 border border-white text-white rounded-lg hover:bg-white hover:text-black transition font-semibold text-base lg:text-lg"
            >
              <Download className="w-5 h-5" />
              <span>Resume</span>
            </button>

            <a
              href="https://github.com/BeanieMen"
              target="_blank"
              rel="noreferrer"
              className="flex-grow lg:flex-grow-0 flex items-center justify-center gap-2 px-5 py-2.5 border border-white text-white rounded-lg hover:bg-white hover:text-black transition font-semibold text-base lg:text-lg"
              aria-label="Visit BeanieMen's GitHub profile"
            >
              <Github className="w-6 h-6" />
            </a>
          </div>
        </header>

        <section>
          <h2 className="text-white text-3xl sm:text-4xl lg:text-5xl font-semibold mb-6 lg:mb-8">Skills</h2>
          <div className="flex flex-wrap gap-3 sm:gap-4">
            {skills.map((skill) => (
              <a
                key={skill.name}
                href={skill.url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 px-3 py-1.5 border border-gray-500 rounded-md bg-[#212121] text-white shadow-md hover:bg-[#333333] transition text-sm sm:text-base lg:text-lg"
              >
                <Icon icon={skill.icon} className="w-5 h-5 lg:w-6 lg:h-6" />
                <span>{skill.name}</span>
              </a>
            ))}
          </div>
        </section>
      </div>

      <ChatWidget />
    </div>
  );
}
