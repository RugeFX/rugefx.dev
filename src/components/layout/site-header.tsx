import { Link } from "@tanstack/react-router";
import { motion, useReducedMotion } from "motion/react";
import { SoundToggle, ThemeToggle } from "@/components/ui/header-toggles";
import LogoMark from "@/components/ui/logo-mark";
import ScrollTruck from "@/components/layout/scroll-truck";

const sections = [
  ["About", "about"],
  ["Work", "work"],
  ["Experience", "experience"],
  ["Contact", "contact"],
] as const;

export default function SiteHeader() {
  const reduced = useReducedMotion();

  return (
    <>
      <ScrollTruck />
      <header className="pointer-events-none fixed inset-x-0 top-3 z-50 flex justify-center px-3">
        <motion.nav
          aria-label="Main"
          className="border-line bg-surface shadow-pop pointer-events-auto flex items-center gap-0.5 rounded-full border-2 p-1.5"
          initial={reduced ? false : { y: -80, rotate: -3 }}
          animate={{ y: 0, rotate: 0 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 18,
            delay: 0.1,
          }}
        >
          <Link
            to="/"
            hash="top"
            className="group font-display flex items-center gap-2 rounded-full py-1 pr-3 pl-1 text-lg font-extrabold tracking-tight"
          >
            <LogoMark className="size-9 transition-transform duration-500 ease-(--ease-spring) group-hover:scale-110 group-hover:-rotate-12" />
            RugeFX
          </Link>
          <ul className="hidden items-center md:flex">
            {sections.map(([label, hash]) => (
              <li key={hash}>
                <Link
                  to="/"
                  hash={hash}
                  className="hover:bg-brand hover:text-on-brand rounded-full px-3.5 py-2 text-sm font-bold transition-colors"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
          <span
            aria-hidden="true"
            className="bg-line/20 mx-1 h-6 w-0.5 rounded-full"
          />
          <SoundToggle />
          <ThemeToggle />
        </motion.nav>
      </header>
    </>
  );
}
