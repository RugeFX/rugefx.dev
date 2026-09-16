import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { ArrowUp, ArrowUpRight } from "lucide-react";
import {
  magneticCardClass,
  magneticLinkArrowClass,
  magneticLinkCardClass,
  useMagneticCard,
} from "@/components/ui/magnetic-card";
import { portfolioRevealEase } from "@/lib/portfolio-motion";
import { cn } from "@/lib/utils";

const footerShellTransition = {
  bounce: 0.04,
  duration: 0.46,
  type: "spring" as const,
};

export default function SiteFooter() {
  const footerRef = useRef<HTMLElement>(null);
  const shouldReduceMotion = Boolean(useReducedMotion());
  const isInView = useInView(footerRef, {
    margin: "0px 0px -8% 0px",
    once: true,
  });
  const emailMagnetism = useMagneticCard(2);

  const contentTransition = (index: number) => ({
    delay: 0.07 + index * 0.045,
    duration: 0.24,
    ease: portfolioRevealEase,
  });

  return (
    <motion.footer
      animate={{
        opacity: isInView ? 1 : 0,
        scale: isInView ? 1 : shouldReduceMotion ? 1 : 0.985,
      }}
      className="bg-portfolio-brand mt-20 rounded-t-[25px] p-[45px] text-white max-[760px]:px-6 max-[760px]:py-[30px]"
      initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.985 }}
      ref={footerRef}
      style={{ transformOrigin: "bottom center" }}
      transition={{
        opacity: {
          duration: shouldReduceMotion ? 0.18 : 0.24,
          ease: portfolioRevealEase,
        },
        scale: shouldReduceMotion ? { duration: 0 } : footerShellTransition,
      }}
    >
      <div>
        <motion.h2
          animate={{
            opacity: shouldReduceMotion ? 1 : isInView ? 1 : 0,
          }}
          className="font-display mb-5 text-[42px] tracking-[-1.5px] max-[760px]:text-[32px]"
          initial={shouldReduceMotion ? false : { opacity: 0 }}
          transition={
            shouldReduceMotion ? { duration: 0 } : contentTransition(0)
          }
        >
          Let’s build something.
        </motion.h2>
        <motion.a
          animate={{
            opacity: shouldReduceMotion ? 1 : isInView ? 1 : 0,
          }}
          className={cn(
            magneticCardClass,
            magneticLinkCardClass,
            "focus-visible:ring-portfolio-on-brand inline-flex items-center gap-2 rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-offset-4 focus-visible:ring-offset-transparent",
          )}
          data-magnetic-card=""
          href="mailto:zackfxg@gmail.com"
          initial={shouldReduceMotion ? false : { opacity: 0 }}
          transition={
            shouldReduceMotion ? { duration: 0 } : contentTransition(1)
          }
          {...emailMagnetism}
        >
          zackfxg@gmail.com
          <ArrowUpRight aria-hidden="true" className={magneticLinkArrowClass} />
        </motion.a>
      </div>

      <div className="mt-[50px]">
        <motion.div
          animate={{
            opacity: shouldReduceMotion ? 1 : isInView ? 1 : 0,
          }}
          aria-hidden="true"
          className="border-portfolio-footer-line border-t"
          initial={shouldReduceMotion ? false : { opacity: 0 }}
          transition={
            shouldReduceMotion ? { duration: 0 } : contentTransition(2)
          }
        />
        <motion.div
          animate={{
            opacity: shouldReduceMotion ? 1 : isInView ? 1 : 0,
          }}
          className="text-portfolio-on-brand flex flex-wrap justify-between gap-5 pt-7 text-xs"
          initial={shouldReduceMotion ? false : { opacity: 0 }}
          transition={
            shouldReduceMotion ? { duration: 0 } : contentTransition(3)
          }
        >
          <span>© {new Date().getFullYear()} Ahmad Zacky</span>
          <a
            className="group/footer-top focus-visible:ring-portfolio-on-brand inline-flex items-center gap-1.5 rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-offset-4 focus-visible:ring-offset-transparent"
            href="#home"
          >
            Back to top
            <ArrowUp
              aria-hidden="true"
              className="size-3.5 transition-transform duration-150 ease-out motion-safe:group-hover/footer-top:-translate-y-[3px] motion-reduce:transform-none motion-reduce:transition-none"
            />
          </a>
        </motion.div>
      </div>
    </motion.footer>
  );
}
