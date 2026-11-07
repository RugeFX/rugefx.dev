import type { ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";
import type { Accent } from "@/lib/accents";

interface HighlightProps {
  children: ReactNode;
  accent?: Accent;
}

/** A marker stroke that sweeps under the words when they scroll into view. */
export default function Highlight({
  children,
  accent = "sun",
}: HighlightProps) {
  const reduced = useReducedMotion();
  const color = `color-mix(in oklab, var(--color-${accent}) 70%, transparent)`;

  return (
    <motion.span
      className="box-decoration-clone bg-no-repeat px-0.5"
      style={{
        backgroundImage: `linear-gradient(${color}, ${color})`,
        backgroundPosition: "0 88%",
      }}
      initial={reduced ? false : { backgroundSize: "0% 42%" }}
      whileInView={{ backgroundSize: "100% 42%" }}
      viewport={{ once: true, amount: 1 }}
      transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
    >
      {children}
    </motion.span>
  );
}
