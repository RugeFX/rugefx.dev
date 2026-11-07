import { useEffect, useState } from "react";
import { SITE_LOCATION } from "@/config/site";

const formatter =
  typeof Intl === "undefined"
    ? null
    : new Intl.DateTimeFormat("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
        timeZone: SITE_LOCATION.timeZone,
      });

// Returns null until mounted so prerendered HTML and hydration agree.
export function useLocalTime(): string | null {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    if (!formatter) return;
    const tick = () => setTime(formatter.format(new Date()));
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  return time;
}
