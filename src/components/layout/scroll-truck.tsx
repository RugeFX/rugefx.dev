import { motion, useScroll, useSpring, useTransform } from "motion/react";
import { Truck } from "lucide-react";

/** A little delivery truck that drives along the bottom as you scroll. */
export default function ScrollTruck() {
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, {
    stiffness: 200,
    damping: 30,
    restDelta: 0.001,
  });
  const left = useTransform(
    progress,
    (value) => `calc(${value * 100}% - ${value * 34}px)`,
  );
  // A small bounce on the cab, as if the road were bumpy.
  const bump = useTransform(progress, (value) => Math.sin(value * 160) * 1.5);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 bottom-0 z-50 h-8"
    >
      <div className="bg-line/10 absolute inset-x-0 bottom-0 h-1.5" />
      <motion.div
        className="bg-brand absolute bottom-0 left-0 h-1.5 w-full origin-left"
        style={{ scaleX: progress }}
      />
      <motion.div
        className="bg-sun text-on-accent border-line absolute bottom-1.5 grid size-[34px] place-items-center rounded-lg border-2"
        style={{ left, y: bump }}
      >
        <Truck className="size-5" />
      </motion.div>
    </div>
  );
}
