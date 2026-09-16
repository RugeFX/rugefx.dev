import { useState, type ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";
import { useMagneticCard } from "@/components/ui/magnetic-card";
import { portfolioRevealEase } from "@/lib/portfolio-motion";
import { cn } from "@/lib/utils";

interface ProjectDetailPanelProps {
  children: ReactNode;
  className: string;
  delay?: number;
  reveal?: boolean;
}

export default function ProjectDetailPanel({
  children,
  className,
  delay = 0,
  reveal = true,
}: ProjectDetailPanelProps) {
  const reduced = useReducedMotion();
  const [settled, setSettled] = useState(!reveal || Boolean(reduced));
  const magnetism = useMagneticCard(2);
  return (
    <motion.div
      data-project-detail-panel=""
      className={cn(
        "motion-safe:transition-[translate] motion-safe:duration-150 motion-safe:ease-out motion-safe:data-[magnetic-returning=true]:duration-300",
        className,
      )}
      initial={reduced || !reveal ? false : { opacity: 0, scale: 0.985 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: reduced ? 0 : 0.26,
        delay: reduced ? 0 : delay,
        ease: portfolioRevealEase,
      }}
      onAnimationComplete={() => setSettled(true)}
      {...magnetism}
      onPointerMove={(event) => {
        if (settled && !document.querySelector("[data-project-transition]"))
          magnetism.onPointerMove(event);
      }}
    >
      {children}
    </motion.div>
  );
}
