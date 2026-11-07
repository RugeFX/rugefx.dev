import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { Atom, Bot, Coffee, Hand, Layers, Smartphone } from "lucide-react";
import BouncyText from "@/components/ui/bouncy-text";
import CopyEmailButton from "@/components/ui/copy-email-button";
import LogoMark from "@/components/ui/logo-mark";
import { popButtonClass } from "@/components/ui/pop-styles";
import Sticker from "@/components/ui/sticker";
import { RESUME_URL } from "@/config/site";
import { cn } from "@/lib/utils";

const pillSticker =
  "font-display rounded-full px-4 py-2 text-sm font-extrabold md:text-base [&_svg]:size-5";

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  // The copy sinks and fades a little as the hero scrolls away, while the
  // stickers drift at their own depths.
  const contentY = useTransform(
    scrollYProgress,
    [0, 1],
    [0, reduced ? 0 : 140],
  );
  const contentOpacity = useTransform(
    scrollYProgress,
    [0, 0.85],
    [1, reduced ? 1 : 0.25],
  );
  const rise = (delay: number) => ({
    initial: reduced ? false : { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { type: "spring" as const, stiffness: 200, damping: 20, delay },
  });
  const sticker = { bounds: sectionRef, progress: scrollYProgress };

  return (
    <section
      ref={sectionRef}
      id="top"
      aria-label="Introduction"
      className="relative isolate flex min-h-svh flex-col items-center justify-center overflow-hidden px-5 pt-32 pb-24 text-center"
    >
      <Sticker
        {...sticker}
        depth={-220}
        rotate={-12}
        delay={0.5}
        position="top-[13%] left-[4%] md:top-[20%] md:left-[8%]"
        className={cn(pillSticker, "bg-sky text-on-accent")}
      >
        <Atom aria-hidden="true" /> React
      </Sticker>
      <Sticker
        {...sticker}
        depth={-120}
        rotate={9}
        delay={0.6}
        position="top-[13%] right-[4%] md:top-[30%] md:right-[7%]"
        className={cn(pillSticker, "bg-mint text-on-accent")}
      >
        <Layers aria-hidden="true" /> full-stack
      </Sticker>
      <Sticker
        {...sticker}
        depth={-300}
        rotate={7}
        delay={0.7}
        position="bottom-[13%] left-[4%] md:bottom-[18%] md:left-[9%]"
        className={cn(pillSticker, "bg-sun text-on-accent")}
      >
        <Bot aria-hidden="true" /> AI whisperer
      </Sticker>
      <Sticker
        {...sticker}
        depth={-180}
        rotate={-8}
        delay={0.8}
        position="right-[4%] bottom-[5%] md:right-[11%] md:bottom-[16%]"
        className={cn(pillSticker, "bg-tomato text-on-accent")}
      >
        <Smartphone aria-hidden="true" /> shipped to the stores
      </Sticker>
      <Sticker
        {...sticker}
        depth={-80}
        rotate={14}
        delay={0.9}
        position="top-[14%] right-[13%] hidden md:block"
        className="bg-brand text-on-brand font-display size-28 flex-col justify-center rounded-full text-center text-sm leading-tight font-extrabold"
      >
        made in
        <span className="text-xl">Bekasi</span>
      </Sticker>
      <Sticker
        {...sticker}
        depth={-260}
        rotate={-6}
        delay={1}
        position="top-[58%] left-[3%] hidden md:block"
        className={cn(pillSticker, "bg-pink text-on-accent")}
      >
        <Coffee aria-hidden="true" /> kopi-powered
      </Sticker>
      <Sticker
        {...sticker}
        depth={-160}
        rotate={12}
        delay={1.1}
        position="top-[56%] right-[4%] hidden md:block"
        className="bg-surface size-24 justify-center rounded-[28px]"
      >
        <LogoMark className="size-16" />
      </Sticker>

      <motion.div
        className="relative z-10 max-w-5xl"
        style={{ y: contentY, opacity: contentOpacity }}
      >
        <motion.p
          className="font-hand text-ink-muted inline-flex items-center gap-2 text-3xl md:text-4xl"
          {...rise(0.15)}
        >
          <Hand
            aria-hidden="true"
            className="animate-wave text-brand size-8 origin-[70%_80%]"
          />
          Halo! I&apos;m
        </motion.p>
        <motion.h1
          className="font-display mt-2 text-[clamp(56px,13.5vw,200px)] leading-[0.88] font-extrabold tracking-[-0.05em]"
          {...rise(0.25)}
        >
          <BouncyText text="Ahmad Zacky" />
        </motion.h1>
        <motion.p
          className="text-ink-soft mx-auto mt-7 max-w-[34ch] text-lg leading-snug md:text-2xl"
          {...rise(0.4)}
        >
          A software engineer in Bekasi, Indonesia. I build web apps, mobile
          apps, and the IoT plumbing that connects them.
        </motion.p>
        <motion.div
          className="mt-9 flex flex-wrap justify-center gap-3"
          {...rise(0.5)}
        >
          <CopyEmailButton
            label="Say halo"
            className="bg-brand text-on-brand"
          />
          <a
            href={RESUME_URL}
            target="_blank"
            rel="noreferrer"
            className={cn(popButtonClass, "bg-surface")}
          >
            Résumé ↗
          </a>
        </motion.div>
        <motion.p
          className="font-hand text-ink-muted mt-10 text-xl md:text-2xl"
          {...rise(0.65)}
        >
          psst, the stickers peel off. Go on, throw one.
        </motion.p>
      </motion.div>
    </section>
  );
}
