import type { Variants } from "motion/react";
import { portfolioRevealEase } from "@/lib/portfolio-motion";

interface HeroCardMotion {
  bounce: number;
  delay: number;
  duration: number;
}

export const heroCardVariants: Variants = {
  hidden: { opacity: 0, transform: "scale(0.975)" },
  visible: ({ bounce, delay, duration }: HeroCardMotion) => ({
    opacity: 1,
    transform: "scale(1)",
    transition: {
      opacity: { delay, duration: 0.22, ease: portfolioRevealEase },
      transform: { bounce, delay, duration, type: "spring" },
    },
  }),
};

export const heroTextVariants: Variants = {
  hidden: { opacity: 0 },
  visible: (delay: number) => ({
    opacity: 1,
    transition: { delay, duration: 0.22, ease: portfolioRevealEase },
  }),
};
