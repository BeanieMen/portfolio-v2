"use client";

import { useEffect, useState } from "react";

function formatTimeInKolkata(): string {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Kolkata",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(new Date());
}

export default function LocalClock() {
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const frameId = requestAnimationFrame(() => setCurrentTime(formatTimeInKolkata()));
    const intervalId = setInterval(() => setCurrentTime(formatTimeInKolkata()), 1000);

    return () => {
      cancelAnimationFrame(frameId);
      clearInterval(intervalId);
    };
  }, []);

  return <>{currentTime}</>;
}
