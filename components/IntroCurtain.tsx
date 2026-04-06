"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

type IntroGreeting = {
  text: string;
  script: "default" | "cjk" | "hindi";
};

const introGreetings: IntroGreeting[] = [
  { text: "Hello", script: "default" },
  { text: "Hola", script: "default" },
  { text: "Bonjour", script: "default" },
  { text: "Ciao", script: "default" },
  { text: "やあ", script: "cjk" },
  { text: "안녕하세요", script: "cjk" },
  { text: "こんにちは", script: "cjk" },
  { text: "नमस्ते", script: "hindi" },
];

const introStepDurations = [1300, 125, 125, 125, 180, 180, 220];
const curtainLiftDelayMs = 550;
const curtainLiftDurationMs = 600;
let hasCompletedIntroThisPageLoad = false;

const cjkFontFamily =
  '"Noto Sans CJK SC", "Noto Sans CJK KR", "Noto Sans CJK JP", "Noto Sans SC", "Noto Sans KR", "Noto Sans JP", sans-serif';
const hindiFontFamily = '"FreeSerif", serif';

export default function IntroCurtain() {
  const [shouldPlayIntro] = useState(() => !hasCompletedIntroThisPageLoad);
  const [index, setIndex] = useState(0);
  const [isLifting, setIsLifting] = useState(false);
  const [isDone, setIsDone] = useState(() => hasCompletedIntroThisPageLoad);
  const [isFirstWordVisible, setIsFirstWordVisible] = useState(() => hasCompletedIntroThisPageLoad);

  useEffect(() => {
    if (!shouldPlayIntro || !isDone) {
      return;
    }

    hasCompletedIntroThisPageLoad = true;
  }, [isDone, shouldPlayIntro]);

  useEffect(() => {
    if (!shouldPlayIntro) {
      return;
    }

    const frameId = requestAnimationFrame(() => setIsFirstWordVisible(true));
    return () => cancelAnimationFrame(frameId);
  }, [shouldPlayIntro]);

  useEffect(() => {
    if (!shouldPlayIntro || isLifting || isDone) {
      return;
    }

    if (index < introGreetings.length - 1) {
      const nextWordTimeout = setTimeout(() => {
        setIndex((prev) => prev + 1);
      }, introStepDurations[Math.min(index, introStepDurations.length - 1)]);

      return () => clearTimeout(nextWordTimeout);
    }

    const startLiftTimeout = setTimeout(() => {
      setIsLifting(true);
    }, curtainLiftDelayMs);

    return () => clearTimeout(startLiftTimeout);
  }, [index, isLifting, isDone, shouldPlayIntro]);

  useEffect(() => {
    if (!shouldPlayIntro || !isLifting) {
      return;
    }

    const finishTimeout = setTimeout(() => {
      setIsDone(true);
    }, curtainLiftDurationMs + 30);

    return () => clearTimeout(finishTimeout);
  }, [isLifting, shouldPlayIntro]);

  useEffect(() => {
    if (!shouldPlayIntro || isDone) {
      return;
    }

    const html = document.documentElement;
    const body = document.body;
    const previousHtmlOverflow = html.style.overflow;
    const previousBodyOverflow = body.style.overflow;

    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    html.style.overflow = "hidden";
    body.style.overflow = "hidden";

    return () => {
      html.style.overflow = previousHtmlOverflow;
      body.style.overflow = previousBodyOverflow;
    };
  }, [isDone, shouldPlayIntro]);

  return (
    <AnimatePresence>
      {shouldPlayIntro && !isDone && (
        <motion.div
          initial={{ y: 0 }}
          animate={{ y: isLifting ? "-105%" : 0 }}
          exit={{ y: "-120%" }}
          transition={{ duration: curtainLiftDurationMs / 1000, ease: "easeInOut" }}
          className="fixed inset-0 z-200 flex items-center justify-center bg-background text-foreground"
          aria-live="polite"
          aria-label="Intro greetings animation"
        >
          <div className="relative flex items-center justify-center text-center text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-normal tracking-tight text-[#d8d8bf]">
            <span
              key={introGreetings[index].text}
              className={`whitespace-nowrap ${index === 0 ? "transition-opacity ease-in-out" : ""} ${index === 0 && !isFirstWordVisible ? "opacity-0" : "opacity-100"}`}
              style={{
                ...(index === 0 ? { transitionDuration: `${introStepDurations[0]}ms` } : {}),
                ...(introGreetings[index].script === "cjk" ? { fontFamily: cjkFontFamily } : {}),
                ...(introGreetings[index].script === "hindi" ? { fontFamily: hindiFontFamily } : {}),
              }}
            >
              <span style={{ fontFamily: '"Hanken Grotesk", "Noto Sans", sans-serif' }}>• </span>
              {introGreetings[index].text}
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}