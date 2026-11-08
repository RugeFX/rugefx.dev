import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { AnimatePresence, motion } from "motion/react";
import { Sparkles } from "lucide-react";
import {
  PlaygroundContext,
  type PlaygroundContextValue,
} from "@/contexts/playground-context";
import { createConfetti, type ConfettiEngine } from "@/lib/confetti";
import { playSound, type SoundName } from "@/lib/sound";

const soundStorageKey = "rugefx-sound";

interface PlaygroundProviderProps {
  children: ReactNode;
}

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Sound effects, confetti and toasts shared by every playful element. */
export function PlaygroundProvider({ children }: PlaygroundProviderProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<ConfettiEngine | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [message, setMessage] = useState<{ id: number; text: string } | null>(
    null,
  );

  useEffect(() => {
    try {
      setSoundEnabled(localStorage.getItem(soundStorageKey) === "on");
    } catch {
      // Sound simply stays off when storage is unavailable.
    }
  }, []);

  useEffect(() => {
    if (!canvasRef.current) return;
    const engine = createConfetti(canvasRef.current);
    engineRef.current = engine;
    return () => {
      engine.destroy();
      clearTimeout(toastTimer.current);
    };
  }, []);

  const play = useCallback(
    (sound: SoundName) => {
      if (soundEnabled) playSound(sound);
    },
    [soundEnabled],
  );

  const toggleSound = useCallback(() => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    if (next) playSound("toggle");
    try {
      localStorage.setItem(soundStorageKey, next ? "on" : "off");
    } catch {
      // The choice still applies for this visit.
    }
  }, [soundEnabled]);

  const burst = useCallback((x: number, y: number, count?: number) => {
    if (!prefersReducedMotion()) engineRef.current?.burst(x, y, count);
  }, []);

  const burstFrom = useCallback(
    (element: Element, count?: number) => {
      const rect = element.getBoundingClientRect();
      burst(rect.left + rect.width / 2, rect.top + rect.height / 2, count);
    },
    [burst],
  );

  const rain = useCallback(() => {
    if (!prefersReducedMotion()) engineRef.current?.rain();
  }, []);

  const toast = useCallback((text: string) => {
    clearTimeout(toastTimer.current);
    setMessage({ id: Date.now(), text });
    toastTimer.current = setTimeout(() => setMessage(null), 2600);
  }, []);

  const value = useMemo<PlaygroundContextValue>(
    () => ({ soundEnabled, toggleSound, play, burst, burstFrom, rain, toast }),
    [burst, burstFrom, play, rain, soundEnabled, toast, toggleSound],
  );

  return (
    <PlaygroundContext.Provider value={value}>
      {children}
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[60] h-full w-full"
      />
      <div
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 bottom-6 z-[70] flex justify-center px-4"
      >
        <AnimatePresence>
          {message && (
            <motion.p
              key={message.id}
              className="border-line bg-sun text-on-accent shadow-pop font-display flex items-center gap-2 rounded-full border-2 px-5 py-3 text-base font-bold"
              initial={{ opacity: 0, y: 30, scale: 0.8, rotate: -4 }}
              animate={{ opacity: 1, y: 0, scale: 1, rotate: -1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 420, damping: 22 }}
            >
              <Sparkles aria-hidden="true" className="size-4" />
              {message.text}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </PlaygroundContext.Provider>
  );
}
