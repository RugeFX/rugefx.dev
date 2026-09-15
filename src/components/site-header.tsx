import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useAnimationControls,
  useReducedMotion,
  type Variants,
} from "motion/react";
import { ArrowRight, ArrowUpRight, Menu, X } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Button, LinkButton } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { portfolioRevealEase } from "@/lib/portfolio-motion";

const MotionLink = motion(Link);

const navigationItems = [
  ["About", "about"],
  ["Experience", "experience"],
  ["Work", "projects"],
] as const;
const navbarRevealLeadIn = 0.06;
const navbarContentVariants: Variants = {
  hidden: { opacity: 1 },
  visible: (delayChildren: number) => ({
    opacity: 1,
    transition: { delayChildren, staggerChildren: 0.045 },
  }),
};
const navbarItemVariants: Variants = {
  hidden: { opacity: 0, transform: "scale(0.97)" },
  visible: {
    opacity: 1,
    transform: "scale(1)",
    transition: { duration: 0.22, ease: portfolioRevealEase },
  },
};

interface SiteHeaderProps {
  shouldPlayEntrance: boolean;
  shouldReduceInitialMotion: boolean;
}

export default function SiteHeader({
  shouldPlayEntrance,
  shouldReduceInitialMotion,
}: SiteHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState(
    () => window.location.hash.slice(1) || "home",
  );
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const navbarShellRef = useRef<HTMLDivElement>(null);
  const pendingSectionRef = useRef<string | null>(null);
  const navbarRevealCompleteRef = useRef(!shouldPlayEntrance);
  const navbarShellAnimationControls = useAnimationControls();
  const navbarContentAnimationControls = useAnimationControls();
  const [usesMobileNavbarLayout] = useState(
    () => window.matchMedia("(max-width: 759.98px)").matches,
  );
  const shouldReduceMotion = useReducedMotion();
  const navbarRevealDuration = usesMobileNavbarLayout ? 0.44 : 0.54;
  const navbarContentDelay =
    navbarRevealLeadIn + (usesMobileNavbarLayout ? 0.14 : 0.18);

  useEffect(() => {
    if (!shouldPlayEntrance) return;

    if (shouldReduceInitialMotion) {
      void Promise.all([
        navbarShellAnimationControls.start(
          { opacity: 1 },
          { duration: 0.15, ease: portfolioRevealEase },
        ),
        navbarContentAnimationControls.start(
          { opacity: 1 },
          { duration: 0.15, ease: portfolioRevealEase },
        ),
      ]);
      return;
    }

    void Promise.all([
      navbarShellAnimationControls.start(
        { transform: "scaleX(1)", opacity: 1 },
        {
          delay: navbarRevealLeadIn,
          duration: navbarRevealDuration,
          bounce: 0.08,
          type: "spring",
        },
      ),
      navbarContentAnimationControls.start("visible"),
    ]);
  }, [
    navbarContentAnimationControls,
    navbarRevealDuration,
    navbarShellAnimationControls,
    shouldPlayEntrance,
    shouldReduceInitialMotion,
  ]);

  useEffect(() => {
    const updateActiveSection = () => {
      setActiveSection(window.location.hash.slice(1) || "home");
    };

    window.addEventListener("hashchange", updateActiveSection);
    return () => window.removeEventListener("hashchange", updateActiveSection);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setMenuOpen(false);
      menuButtonRef.current?.focus();
    };

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [menuOpen]);

  const closeMenuThenScroll = (sectionId: string) => {
    pendingSectionRef.current = sectionId;
    setMenuOpen(false);
  };

  const finishNavbarReveal = () => {
    if (navbarRevealCompleteRef.current) return;

    navbarRevealCompleteRef.current = true;
    navbarShellAnimationControls.stop();
    navbarContentAnimationControls.stop();
    navbarShellAnimationControls.set({ transform: "scaleX(1)", opacity: 1 });
    navbarContentAnimationControls.set("visible");
    if (navbarShellRef.current) {
      navbarShellRef.current.style.transform = "none";
      navbarShellRef.current.style.opacity = "1";
    }
  };

  const completeMobileNavigation = () => {
    const sectionId = pendingSectionRef.current;
    if (!sectionId) return;

    pendingSectionRef.current = null;
    window.requestAnimationFrame(() => {
      window.history.pushState(null, "", `#${sectionId}`);
      setActiveSection(sectionId);
      document.getElementById(sectionId)?.scrollIntoView({
        behavior: shouldReduceMotion ? "auto" : "smooth",
        block: "start",
      });
    });
  };

  return (
    <header
      className={cn(
        "relative mt-4 mb-5 flex h-[76px] items-center justify-between rounded-[24px] border border-transparent px-5 pl-7",
        "max-[760px]:mt-3 max-[760px]:mb-4 max-[760px]:block max-[760px]:h-auto max-[760px]:px-3 max-[760px]:py-3 max-[760px]:pl-5",
      )}
      onFocusCapture={finishNavbarReveal}
      onPointerDownCapture={finishNavbarReveal}
    >
      <motion.div
        ref={navbarShellRef}
        data-navbar-shell=""
        aria-hidden="true"
        className={cn(
          "border-portfolio-border-soft bg-portfolio-surface pointer-events-none absolute inset-0 rounded-[24px] border will-change-transform",
          menuOpen && "max-[760px]:shadow-portfolio-card",
        )}
        style={{ transformOrigin: "left center" }}
        initial={
          shouldPlayEntrance
            ? shouldReduceInitialMotion
              ? { opacity: 0 }
              : { transform: "scaleX(0.055)", opacity: 1 }
            : false
        }
        animate={navbarShellAnimationControls}
        onAnimationComplete={finishNavbarReveal}
      />
      <motion.div
        data-navbar-reveal=""
        className="relative z-10 flex w-full items-center justify-between max-[760px]:grid max-[760px]:grid-cols-[1fr_auto]"
        variants={navbarContentVariants}
        custom={navbarContentDelay}
        initial={
          shouldPlayEntrance
            ? shouldReduceInitialMotion
              ? { opacity: 0 }
              : "hidden"
            : false
        }
        animate={navbarContentAnimationControls}
      >
        <MotionLink
          to="/"
          className="font-display text-[28px] font-bold tracking-[-2px]"
          variants={navbarItemVariants}
          onClick={(event) => {
            if (!menuOpen) return;
            event.preventDefault();
            closeMenuThenScroll("home");
          }}
        >
          RugeFX
        </MotionLink>
        <motion.nav
          aria-label="Main navigation"
          className="hidden items-center gap-1 text-sm min-[760px]:flex"
          variants={navbarItemVariants}
        >
          {navigationItems.map(([label, id]) => {
            const isActive = activeSection === id;

            return (
              <a
                key={id}
                href={`#${id}`}
                aria-current={isActive ? "location" : undefined}
                className={cn(
                  "rounded-full px-4 py-2.5 font-medium transition-colors duration-150",
                  isActive
                    ? "bg-portfolio-tint text-portfolio-brand"
                    : "text-portfolio-ink hover:bg-portfolio-canvas",
                )}
              >
                {label}
              </a>
            );
          })}
        </motion.nav>
        <motion.div
          className="max-[760px]:hidden"
          variants={navbarItemVariants}
        >
          <LinkButton
            size="sm"
            className="h-10 gap-2.5 px-4"
            href="mailto:zackfxg@gmail.com"
          >
            Contact me
            <ArrowUpRight
              size={17}
              data-icon="inline-end"
              data-direction="diagonal"
            />
          </LinkButton>
        </motion.div>
        <motion.div
          className="hidden max-[760px]:block"
          variants={navbarItemVariants}
        >
          <Button
            variant="ghost"
            size="icon"
            ref={menuButtonRef}
            className="text-portfolio-brand bg-portfolio-tint data-hovered:bg-portfolio-tint-active size-12"
            aria-label={menuOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            onPress={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X /> : <Menu />}
          </Button>
        </motion.div>
      </motion.div>
      <AnimatePresence
        initial={false}
        onExitComplete={completeMobileNavigation}
      >
        {menuOpen && (
          <motion.nav
            id="mobile-navigation"
            aria-label="Mobile navigation"
            className="relative z-10 col-span-2 hidden overflow-hidden max-[760px]:block"
            initial={shouldReduceMotion ? false : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={
              shouldReduceMotion
                ? { display: "none" }
                : { height: 0, opacity: 0 }
            }
            transition={
              shouldReduceMotion
                ? { duration: 0 }
                : {
                    height: { duration: 0.22, ease: portfolioRevealEase },
                    opacity: { duration: 0.16, ease: "easeOut" },
                  }
            }
          >
            <div className="border-portfolio-border-soft mt-3 border-t pt-2">
              {navigationItems.map(([label, id]) => {
                const isActive = activeSection === id;

                return (
                  <a
                    key={id}
                    href={`#${id}`}
                    aria-current={isActive ? "location" : undefined}
                    className={cn(
                      "group/nav font-display flex min-h-14 items-center justify-between rounded-[15px] px-4 text-[18px] font-medium tracking-[-0.4px] transition-colors duration-150",
                      isActive
                        ? "bg-portfolio-tint text-portfolio-brand"
                        : "text-portfolio-ink hover:bg-portfolio-canvas",
                    )}
                    onClick={(event) => {
                      event.preventDefault();
                      closeMenuThenScroll(id);
                    }}
                  >
                    <span>{label}</span>
                    {isActive ? (
                      <span
                        aria-hidden="true"
                        className="bg-portfolio-brand size-2 rounded-full"
                      />
                    ) : (
                      <ArrowRight
                        aria-hidden="true"
                        className="text-portfolio-copy-subtle size-[18px] transition-transform duration-150 group-hover/nav:translate-x-0.5"
                      />
                    )}
                  </a>
                );
              })}
              <a
                className="group/contact bg-portfolio-brand font-display mt-2 flex min-h-14 items-center justify-between rounded-[15px] px-4 text-[18px] font-medium tracking-[-0.4px] text-white"
                href="mailto:zackfxg@gmail.com"
                onClick={() => setMenuOpen(false)}
              >
                <span>Contact me</span>
                <ArrowUpRight
                  aria-hidden="true"
                  className="size-[18px] transition-transform duration-150 group-hover/contact:translate-x-0.5 group-hover/contact:-translate-y-0.5"
                />
              </a>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
