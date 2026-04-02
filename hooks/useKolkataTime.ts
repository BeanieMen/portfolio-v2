"use client";

import { useEffect, useState } from "react";

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

export function useKolkataTime() {
  const [time, setTime] = useState("");

  useEffect(() => {
    setTime(formatKolkataTime());
    const intervalId = setInterval(() => setTime(formatKolkataTime()), 1000);
    return () => clearInterval(intervalId);
  }, []);

  return time;
}
