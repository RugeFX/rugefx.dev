import { createContext, useContext } from "react";
import type { SoundName } from "@/lib/sound";

export interface PlaygroundContextValue {
  soundEnabled: boolean;
  toggleSound: () => void;
  play: (sound: SoundName) => void;
  burst: (x: number, y: number, count?: number) => void;
  burstFrom: (element: Element, count?: number) => void;
  rain: () => void;
  toast: (message: string) => void;
}

export const PlaygroundContext = createContext<PlaygroundContextValue | null>(
  null,
);

export function usePlayground(): PlaygroundContextValue {
  const context = useContext(PlaygroundContext);

  if (!context) {
    throw new Error("usePlayground must be used within a PlaygroundProvider.");
  }

  return context;
}
