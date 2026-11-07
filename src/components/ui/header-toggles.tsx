import { AnimatePresence, motion } from "motion/react";
import { Moon, Sun, Volume2, VolumeX } from "lucide-react";
import { usePlayground } from "@/contexts/playground-context";
import { useTheme } from "@/contexts/theme-context";

const iconButtonClass =
  "hover:bg-brand-tint relative grid size-10 place-items-center overflow-hidden rounded-full transition-colors [&_svg]:size-[18px]";
const swap = {
  initial: { y: 18, rotate: -90, opacity: 0 },
  animate: { y: 0, rotate: 0, opacity: 1 },
  exit: { y: -18, rotate: 90, opacity: 0 },
  transition: { type: "spring" as const, stiffness: 420, damping: 20 },
};

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const { play } = usePlayground();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      className={iconButtonClass}
      aria-label={`Switch to ${isDark ? "light" : "dark"} theme`}
      onClick={() => {
        toggleTheme();
        play("click");
      }}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span key={theme} className="grid place-items-center" {...swap}>
          {isDark ? <Moon aria-hidden="true" /> : <Sun aria-hidden="true" />}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}

export function SoundToggle() {
  const { soundEnabled, toggleSound } = usePlayground();

  return (
    <button
      type="button"
      className={iconButtonClass}
      aria-label="Sound effects"
      aria-pressed={soundEnabled}
      onClick={toggleSound}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={soundEnabled ? "on" : "off"}
          className="grid place-items-center"
          {...swap}
        >
          {soundEnabled ? (
            <Volume2 aria-hidden="true" />
          ) : (
            <VolumeX aria-hidden="true" />
          )}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}
