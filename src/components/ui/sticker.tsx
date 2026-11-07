import type { ReactNode, RefObject } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type MotionValue,
} from "motion/react";
import { usePlayground } from "@/contexts/playground-context";
import { cn } from "@/lib/utils";

interface StickerProps {
  children: ReactNode;
  /** Placement classes for the sticker's resting spot. */
  position: string;
  className?: string;
  rotate?: number;
  delay?: number;
  bounds: RefObject<HTMLElement | null>;
  /** Scroll progress of the section; with depth, the sticker drifts. */
  progress?: MotionValue<number>;
  depth?: number;
}

/** A die-cut sticker that can be peeled off and thrown around its section. */
export default function Sticker({
  children,
  position,
  className,
  rotate = 0,
  delay = 0,
  bounds,
  progress,
  depth = 0,
}: StickerProps) {
  const reduced = useReducedMotion();
  const { play } = usePlayground();
  const still = useMotionValue(0);
  const drift = useTransform(
    progress ?? still,
    [0, 1],
    [0, reduced ? 0 : depth],
  );

  return (
    // The outer layer drifts with scroll; the inner layer is what you drag.
    <motion.div
      aria-hidden="true"
      className={cn("absolute z-20", position)}
      style={{ y: drift }}
    >
      <motion.div
        className={cn(
          "shadow-sticker flex cursor-grab touch-none items-center gap-2 border-[3px] border-white select-none active:cursor-grabbing",
          className,
        )}
        initial={reduced ? false : { scale: 0, rotate: rotate - 25 }}
        animate={{ scale: 1, rotate }}
        transition={{ type: "spring", stiffness: 260, damping: 13, delay }}
        drag
        dragConstraints={bounds}
        dragElastic={0.2}
        dragTransition={{ power: 0.35, timeConstant: 260 }}
        whileHover={reduced ? undefined : { scale: 1.07, rotate: rotate - 5 }}
        whileDrag={{ scale: 1.14, rotate: rotate + 9, zIndex: 40 }}
        onDragStart={() => play("pop")}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
