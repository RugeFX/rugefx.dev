import { motion, useReducedMotion } from "motion/react";
import { useTheme } from "@/contexts/theme-context";
import { portfolioRevealEase } from "@/lib/portfolio-motion";

export default function HeroName() {
  const { theme } = useTheme();
  const shouldReduceMotion = useReducedMotion();
  const isDark = theme === "dark";
  const words = ["Ahmad", "Zacky."];
  const extrusionTransform = isDark
    ? "translate3d(0px, 0px, 0px)"
    : "translate3d(5px, -5px, 0px)";
  const extrusionTransition = shouldReduceMotion
    ? {
        transform: { duration: 0 },
        opacity: { duration: 0.15, ease: "easeOut" as const },
      }
    : {
        transform: {
          type: "spring" as const,
          duration: 0.34,
          bounce: 0.08,
        },
        opacity: { duration: 0.2, ease: portfolioRevealEase },
      };
  const faceTransition = {
    duration: shouldReduceMotion ? 0.15 : 0.2,
    ease: portfolioRevealEase,
  };

  return words.map((word) => (
    <span className="relative isolate block w-fit" key={word}>
      <motion.span
        aria-hidden="true"
        className="text-portfolio-hero-name-extrusion pointer-events-none absolute inset-0 -z-10 block will-change-transform"
        animate={{
          transform: extrusionTransform,
          opacity: isDark ? 0 : 0.7,
        }}
        initial={false}
        transition={extrusionTransition}
      >
        {word}
      </motion.span>
      <span className="text-portfolio-hero-name-face-light relative z-10 block">
        {word}
      </span>
      <motion.span
        aria-hidden="true"
        className="text-portfolio-hero-name-face-dark pointer-events-none absolute inset-0 z-10 block will-change-[opacity]"
        animate={{ opacity: isDark ? 1 : 0 }}
        initial={false}
        transition={faceTransition}
      >
        {word}
      </motion.span>
      <motion.span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-20 block text-transparent [-webkit-text-stroke:2px_var(--color-portfolio-hero-name-outline)] [paint-order:stroke_fill] max-[480px]:[-webkit-text-stroke-width:1.5px]"
        animate={{ opacity: isDark ? 1 : 0 }}
        initial={false}
        transition={faceTransition}
      >
        {word}
      </motion.span>
    </span>
  ));
}
