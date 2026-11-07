import { motion, useReducedMotion, type Variants } from "motion/react";
import { accentStroke, type Accent } from "@/lib/accents";
import { cn } from "@/lib/utils";

interface SectionTitleProps {
  id: string;
  note: string;
  title: string;
  accent?: Accent;
  className?: string;
}

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.045 } },
};
const noteVariants: Variants = {
  hidden: { opacity: 0, x: -24, rotate: -8 },
  visible: {
    opacity: 1,
    x: 0,
    rotate: -2,
    transition: { type: "spring", stiffness: 300, damping: 18 },
  },
};
// Letters tumble in from above and land with a little bounce.
const letterVariants: Variants = {
  hidden: (index: number) => ({
    opacity: 0,
    y: "-0.7em",
    rotate: index % 2 ? 18 : -18,
  }),
  visible: {
    opacity: 1,
    y: 0,
    rotate: 0,
    transition: { type: "spring", stiffness: 520, damping: 14 },
  },
};
const squiggleVariants: Variants = {
  hidden: { pathLength: 0 },
  visible: {
    pathLength: 1,
    transition: { duration: 0.8, ease: "easeOut", delay: 0.45 },
  },
};

export default function SectionTitle({
  id,
  note,
  title,
  accent = "brand",
  className,
}: SectionTitleProps) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      className={cn("mb-12 md:mb-16", className)}
      variants={containerVariants}
      initial={reduced ? false : "hidden"}
      whileInView="visible"
      viewport={{ once: true, amount: 0.7 }}
    >
      <motion.p
        className="font-hand text-ink-muted mb-2 w-fit origin-bottom-left -rotate-2 text-2xl md:text-3xl"
        variants={noteVariants}
      >
        {note}
      </motion.p>
      <h2
        id={id}
        className="font-display pt-[0.08em] text-[clamp(48px,7.5vw,104px)] leading-none font-extrabold tracking-[-0.04em]"
      >
        <span className="relative inline-block">
          <span className="sr-only">{title}</span>
          <span aria-hidden="true">
            {Array.from(title).map((character, index) => (
              <motion.span
                key={`${character}-${index}`}
                className="inline-block"
                custom={index}
                variants={letterVariants}
              >
                {character}
              </motion.span>
            ))}
          </span>
          <svg
            aria-hidden="true"
            viewBox="0 0 300 24"
            preserveAspectRatio="none"
            className="absolute -bottom-3 left-0 h-[0.2em] w-full overflow-visible"
          >
            <motion.path
              d="M3 14 C 28 2, 48 2, 70 13 S 115 24, 140 12 S 188 1, 212 12 S 262 23, 297 9"
              fill="none"
              strokeWidth="7"
              strokeLinecap="round"
              className={accentStroke[accent]}
              variants={squiggleVariants}
            />
          </svg>
        </span>
      </h2>
    </motion.div>
  );
}
