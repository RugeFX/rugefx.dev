import { MotionConfig, motion, useReducedMotion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import HeroName from "@/components/hero/hero-name";
import {
  heroCardVariants,
  heroTextVariants,
} from "@/components/hero/hero-motion";
import HeroSocialLinks from "@/components/hero/hero-social-links";
import IndonesiaLocationMap from "@/components/hero/indonesia-location-map";
import { LinkButton } from "@/components/ui/button";
import {
  magneticCardClass,
  magneticLinkArrowClass,
  magneticLinkCardClass,
  useMagneticCard,
} from "@/components/ui/magnetic-card";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useMediaQuery } from "@/hooks/use-media-query";
import { portfolioRevealEase } from "@/lib/portfolio-motion";
import { cn } from "@/lib/utils";

const resume =
  "https://docs.google.com/document/d/1Fh4tgO5LSXGCdzDGPtST5pniM-a08Ar-O8dW1SvMmDY/edit?usp=sharing";
const heroCardClass = "rounded-[25px]";
const desktopHeroDelays = {
  main: 0,
  about: 0.06,
  github: 0.1,
  linkedin: 0.14,
  x: 0.18,
  location: 0.22,
  current: 0.26,
};
const stackedHeroDelays = {
  main: 0,
  github: 0.06,
  linkedin: 0.1,
  x: 0.14,
  about: 0.18,
  location: 0.22,
  current: 0.26,
};

interface HeroSectionProps {
  shouldPlayInitialEntrance: boolean;
}

export default function HeroSection({
  shouldPlayInitialEntrance,
}: HeroSectionProps) {
  const usesStackedHeroLayout = useMediaQuery("(max-width: 1120px)");
  const usesMobileNavbarLayout = useMediaQuery("(max-width: 759.98px)");
  const mainCardMagnetism = useMagneticCard();
  const aboutCardMagnetism = useMagneticCard();
  const locationCardMagnetism = useMagneticCard(2.5);
  const currentCardMagnetism = useMagneticCard(2.5);
  const shouldReduceMotion = Boolean(useReducedMotion());
  const shouldAnimateHeroCards =
    shouldPlayInitialEntrance && !shouldReduceMotion;
  const heroCardInitial = shouldAnimateHeroCards ? "hidden" : false;
  const baseHeroDelays = usesStackedHeroLayout
    ? stackedHeroDelays
    : desktopHeroDelays;
  const navbarRevealLeadIn = 0.06;
  const heroStartDelay = usesMobileNavbarLayout ? 0.25 : 0.33;
  const heroDelayOffset = shouldAnimateHeroCards
    ? heroStartDelay + navbarRevealLeadIn
    : 0;
  const heroDelays = {
    main: baseHeroDelays.main + heroDelayOffset,
    about: baseHeroDelays.about + heroDelayOffset,
    github: baseHeroDelays.github + heroDelayOffset,
    linkedin: baseHeroDelays.linkedin + heroDelayOffset,
    x: baseHeroDelays.x + heroDelayOffset,
    location: baseHeroDelays.location + heroDelayOffset,
    current: baseHeroDelays.current + heroDelayOffset,
  };

  return (
    <MotionConfig reducedMotion="user">
      <motion.section
        id="home"
        className="grid scroll-mt-6 grid-cols-[1.15fr_1fr] gap-[22px] max-[1120px]:grid-cols-1 max-[760px]:gap-4"
        aria-label="Introduction"
        initial={
          shouldPlayInitialEntrance && shouldReduceMotion
            ? { opacity: 0 }
            : false
        }
        animate={
          shouldPlayInitialEntrance && shouldReduceMotion
            ? { opacity: 1 }
            : undefined
        }
        transition={{
          delay: shouldPlayInitialEntrance && shouldReduceMotion ? 0.105 : 0,
          duration: 0.15,
          ease: portfolioRevealEase,
        }}
      >
        <div className="flex min-w-0 flex-col gap-5 max-[760px]:gap-4">
          <motion.div
            className={cn(
              heroCardClass,
              magneticCardClass,
              "bg-portfolio-brand relative flex-1 p-12 text-white max-[1120px]:p-[clamp(36px,6vw,56px)] max-[760px]:px-[30px] max-[760px]:py-[34px] max-[480px]:px-6 max-[480px]:py-[30px] min-[1121px]:min-h-[540px]",
            )}
            data-hero-motion="main"
            data-magnetic-card=""
            {...mainCardMagnetism}
            variants={heroCardVariants}
            initial={heroCardInitial}
            animate="visible"
            custom={{
              bounce: 0.1,
              delay: heroDelays.main,
              duration: 0.52,
            }}
          >
            <ThemeToggle className="absolute top-6 right-6 z-30 max-[760px]:top-5 max-[760px]:right-5 max-[480px]:top-[18px] max-[480px]:right-[18px]" />
            <motion.h1
              className="font-display mb-[35px] pr-[92px] text-[clamp(65px,7.8vw,108px)] leading-[1.02] font-semibold tracking-[-7px] max-[1120px]:text-[clamp(76px,11vw,108px)] max-[1120px]:tracking-[-6px] max-[760px]:mb-[25px] max-[760px]:pr-[84px] max-[760px]:text-[clamp(66px,16vw,92px)] max-[760px]:tracking-[-4px] max-[480px]:pr-[76px] max-[480px]:text-[clamp(58px,18vw,78px)] max-[480px]:tracking-[-3px]"
              variants={heroTextVariants}
              initial={heroCardInitial}
              animate="visible"
              custom={heroDelayOffset + 0.08}
            >
              <HeroName />
            </motion.h1>
            <motion.div
              variants={heroTextVariants}
              initial={heroCardInitial}
              animate="visible"
              custom={heroDelayOffset + 0.15}
            >
              <h2 className="mb-6 text-[26px] font-medium tracking-[-1px] max-[760px]:text-2xl">
                Software engineer
              </h2>
              <p className="text-portfolio-on-brand text-[21px] leading-[1.55] max-[760px]:text-[19px]">
                Building web, mobile, and
                <br className="desktop-break" /> connected systems.
              </p>
              <div className="mt-[42px] flex flex-wrap gap-3.5 max-[1120px]:gap-2.5 max-[760px]:mt-8 max-[480px]:grid max-[480px]:grid-cols-1">
                <LinkButton
                  variant="inverse"
                  size="lg"
                  className="text-portfolio-ink-strong max-[1120px]:h-12 max-[1120px]:px-[18px] max-[480px]:w-full"
                  href="mailto:zackfxg@gmail.com"
                >
                  Get in touch
                  <ArrowUpRight
                    data-icon="inline-end"
                    data-direction="diagonal"
                  />
                </LinkButton>
                <LinkButton
                  variant="inverse-outline"
                  size="lg"
                  className="max-[1120px]:h-12 max-[1120px]:px-[18px] max-[480px]:w-full"
                  href={resume}
                  target="_blank"
                  rel="noreferrer"
                >
                  View resume
                </LinkButton>
              </div>
            </motion.div>
          </motion.div>
          <HeroSocialLinks initial={heroCardInitial} delays={heroDelays} />
        </div>
        <div className="flex min-w-0 flex-col gap-5 max-[760px]:gap-4">
          <motion.div
            className={cn(
              magneticCardClass,
              "border-portfolio-border-soft bg-portfolio-surface flex-1 rounded-[25px] border p-11 max-[1120px]:p-[clamp(34px,5vw,52px)] max-[760px]:p-[30px]",
            )}
            data-hero-motion="about"
            data-magnetic-card=""
            {...aboutCardMagnetism}
            variants={heroCardVariants}
            initial={heroCardInitial}
            animate="visible"
            custom={{
              bounce: 0.1,
              delay: heroDelays.about,
              duration: 0.52,
            }}
          >
            <h2 className="font-display mb-7 text-[33px] font-semibold tracking-[-1.3px] max-[1120px]:text-[32px] max-[760px]:text-[28px]">
              A bit about me.
            </h2>
            <p className="mb-[26px] text-[21px] leading-[1.6] last:mb-0 max-[1120px]:max-w-[38ch] max-[1120px]:text-xl max-[760px]:max-w-none max-[760px]:text-lg">
              I'm a primarily self-taught developer based in Bekasi, Indonesia.
            </p>
            <p className="mb-[26px] text-[21px] leading-[1.6] last:mb-0 max-[1120px]:max-w-[38ch] max-[1120px]:text-xl max-[760px]:max-w-none max-[760px]:text-lg">
              My work spans mobile commerce apps, websites, and operational
              dashboards that connect with on-site devices.
            </p>
          </motion.div>
          <div className="grid min-h-[260px] flex-1 grid-cols-2 gap-5 max-[1120px]:min-h-[280px] max-[760px]:min-h-[235px] max-[760px]:gap-4 max-[480px]:min-h-0 max-[480px]:flex-none max-[480px]:grid-cols-1">
            <motion.div
              className={cn(
                magneticCardClass,
                "bg-portfolio-tint relative flex flex-col overflow-hidden rounded-[25px] p-[27px] max-[1120px]:p-[30px] max-[760px]:p-[22px] max-[480px]:min-h-[220px]",
              )}
              data-hero-motion="location"
              data-magnetic-card=""
              {...locationCardMagnetism}
              variants={heroCardVariants}
              initial={heroCardInitial}
              animate="visible"
              custom={{
                bounce: 0.12,
                delay: heroDelays.location,
                duration: 0.43,
              }}
            >
              <h2 className="text-[23px] leading-[1.4] font-medium tracking-[-0.8px] max-[760px]:text-[21px]">
                Bekasi,
                <br />
                Indonesia
              </h2>
              <div className="relative min-h-[140px] flex-1">
                <IndonesiaLocationMap />
              </div>
            </motion.div>
            <motion.a
              className={cn(
                magneticCardClass,
                magneticLinkCardClass,
                "bg-portfolio-ink-strong flex flex-col rounded-[25px] p-7 text-white max-[1120px]:p-[30px] max-[760px]:p-[22px] max-[480px]:min-h-[220px]",
              )}
              href="#experience"
              data-hero-motion="current"
              data-magnetic-card=""
              {...currentCardMagnetism}
              variants={heroCardVariants}
              initial={heroCardInitial}
              animate="visible"
              custom={{
                bounce: 0.12,
                delay: heroDelays.current,
                duration: 0.43,
              }}
            >
              <h2 className="text-[23px] leading-[1.4] font-medium tracking-[-0.8px] max-[760px]:text-[21px]">
                Currently
              </h2>
              <p className="my-5 mb-8 text-[22px] leading-normal max-[1120px]:max-w-[22ch] max-[760px]:text-[19px]">
                Building operational tools at Nauchara.
              </p>
              <span className="text-portfolio-on-dark-accent mt-auto flex items-center gap-1.5 text-sm max-[760px]:text-xs">
                My experience
                <ArrowUpRight className={magneticLinkArrowClass} size={17} />
              </span>
            </motion.a>
          </div>
        </div>
      </motion.section>
    </MotionConfig>
  );
}
