import { motion } from "motion/react";
import { ArrowUpRight, Linkedin } from "lucide-react";
import { SiGithub, SiX } from "@icons-pack/react-simple-icons";
import { heroCardVariants } from "@/components/hero/hero-motion";
import {
  magneticCardClass,
  magneticLinkArrowClass,
  magneticLinkCardClass,
  useMagneticCard,
} from "@/components/ui/magnetic-card";
import { cn } from "@/lib/utils";

const socialCardClass =
  "relative flex h-full min-h-[180px] min-w-0 flex-col overflow-hidden rounded-[25px] px-[30px] py-[26px] max-[1120px]:min-h-[170px] max-[760px]:min-h-[158px] max-[760px]:p-6 max-[480px]:p-[22px]";

interface HeroSocialLinksProps {
  initial: false | "hidden";
  delays: {
    github: number;
    linkedin: number;
    x: number;
  };
}

export default function HeroSocialLinks({
  initial,
  delays,
}: HeroSocialLinksProps) {
  const githubCardMagnetism = useMagneticCard(2.5);
  const linkedinCardMagnetism = useMagneticCard(2.5);
  const xCardMagnetism = useMagneticCard(2.5);

  return (
    <div className="grid grid-cols-3 gap-5 max-[760px]:grid-cols-2 max-[760px]:gap-4">
      <motion.div
        data-hero-motion="github"
        variants={heroCardVariants}
        initial={initial}
        animate="visible"
        custom={{ bounce: 0.12, delay: delays.github, duration: 0.43 }}
      >
        <a
          className={cn(
            magneticCardClass,
            magneticLinkCardClass,
            socialCardClass,
            "bg-portfolio-ink-strong text-white",
          )}
          data-magnetic-card=""
          href="https://github.com/RugeFX"
          {...githubCardMagnetism}
          target="_blank"
          rel="noreferrer"
        >
          <SiGithub size={38} aria-hidden="true" />
          <ArrowUpRight
            className={cn(
              magneticLinkArrowClass,
              "absolute top-[27px] right-[25px]",
            )}
          />
          <h2 className="mt-[18px] mb-1 text-[23px] font-medium tracking-[-0.8px] max-[480px]:text-xl">
            GitHub
          </h2>
          <span className="text-portfolio-on-dark-muted text-sm">RugeFX</span>
        </a>
      </motion.div>
      <motion.div
        data-hero-motion="linkedin"
        variants={heroCardVariants}
        initial={initial}
        animate="visible"
        custom={{ bounce: 0.12, delay: delays.linkedin, duration: 0.43 }}
      >
        <a
          className={cn(
            magneticCardClass,
            magneticLinkCardClass,
            socialCardClass,
            "bg-portfolio-tint text-portfolio-brand-strong",
          )}
          data-magnetic-card=""
          href="https://linkedin.com/in/rugefx"
          {...linkedinCardMagnetism}
          target="_blank"
          rel="noreferrer"
        >
          <Linkedin size={38} aria-hidden="true" />
          <ArrowUpRight
            className={cn(
              magneticLinkArrowClass,
              "absolute top-[27px] right-[25px]",
            )}
          />
          <h2 className="text-portfolio-ink mt-[18px] mb-1 text-[23px] font-medium tracking-[-0.8px] max-[480px]:text-xl">
            LinkedIn
          </h2>
          <span className="text-sm">Ahmad Zacky</span>
        </a>
      </motion.div>
      <motion.div
        className="max-[760px]:col-span-2"
        data-hero-motion="x"
        variants={heroCardVariants}
        initial={initial}
        animate="visible"
        custom={{ bounce: 0.12, delay: delays.x, duration: 0.43 }}
      >
        <a
          className={cn(
            magneticCardClass,
            magneticLinkCardClass,
            socialCardClass,
            "border-portfolio-border bg-portfolio-surface text-portfolio-ink border max-[760px]:min-h-[140px]",
          )}
          data-magnetic-card=""
          href="https://twitter.com/RugeDev"
          {...xCardMagnetism}
          target="_blank"
          rel="noreferrer"
        >
          <SiX size={34} aria-hidden="true" />
          <ArrowUpRight
            className={cn(
              magneticLinkArrowClass,
              "absolute top-[27px] right-[25px]",
            )}
          />
          <h2 className="mt-[18px] mb-1 text-[23px] font-medium tracking-[-0.8px] max-[480px]:text-xl">
            X
          </h2>
          <span className="text-portfolio-copy-muted text-sm">@RugeDev</span>
        </a>
      </motion.div>
    </div>
  );
}
