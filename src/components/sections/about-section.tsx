import { useState } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type Variants,
} from "motion/react";
import { Moon, Sun } from "lucide-react";
import Highlight from "@/components/ui/highlight";
import { popCardClass } from "@/components/ui/pop-styles";
import Reveal from "@/components/ui/reveal";
import SectionTitle from "@/components/ui/section-title";
import { SITE_LOCATION } from "@/config/site";
import { usePlayground } from "@/contexts/playground-context";
import { useLocalTime } from "@/hooks/use-local-time";
import { cn } from "@/lib/utils";

const characterSheet = [
  ["Class", "Software engineer"],
  ["Home base", "Bekasi, West Java, Indonesia"],
  [
    "Training",
    "Computer Science at Cakrawala University, picked for the Talent Scouting program",
  ],
  ["Guild", "Deputy Head of Research & Technology, Student Government"],
  [
    "Special moves",
    "Shipping apps to the stores, hooking devices up to dashboards",
  ],
] as const;

const mainKeys = [
  "React",
  "React Native",
  "TypeScript",
  "Expo",
  "Laravel",
  "Node.js",
  "PostgreSQL",
  "MQTT",
  "Docker",
  "GitHub Actions",
];

const extraKeys = [
  "JavaScript",
  "PHP",
  "Go",
  "Python",
  "Java",
  "C#",
  "Rust",
  "C++",
  "Next.js",
  "NestJS",
  "Hono",
  "Fastify",
  "Hapi",
  "Gin",
  "Fiber",
  "Axum",
  "Tailwind CSS",
  "MongoDB",
  "Git",
  "Figma",
  "Vercel",
  "AWS",
  "Fly.io",
];

// Every few keys get a coloured keycap, like a custom keyboard.
const keycapColors = [
  "bg-surface",
  "bg-surface",
  "bg-sun",
  "bg-surface",
  "bg-mint",
  "bg-surface",
  "bg-sky",
  "bg-pink",
];

// Character sheet stats load in one at a time, like a game menu.
const statVariants: Variants = {
  hidden: { opacity: 0, x: -24 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: "spring", stiffness: 300, damping: 22 },
  },
};

export default function AboutSection() {
  const reduced = useReducedMotion();

  return (
    <section
      id="about"
      aria-labelledby="about-title"
      className="mx-auto max-w-7xl scroll-mt-24 px-5 pt-24 md:px-8 md:pt-36"
    >
      <SectionTitle id="about-title" note="a little about me" title="About" />

      <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
        <div className="space-y-6 text-xl leading-relaxed md:text-2xl lg:col-span-7">
          <Reveal>
            <p>
              I&apos;m a primarily self-taught developer who builds{" "}
              <Highlight accent="sun">web and mobile apps</Highlight>, plus the
              services and integrations behind them.
            </p>
          </Reveal>
          <Reveal delay={0.08}>
            <p>
              Lately that means mobile commerce,{" "}
              <Highlight accent="mint">
                IoT-connected weighing workflows
              </Highlight>
              , and dashboards that keep operational data moving.
            </p>
          </Reveal>
          <Reveal delay={0.16}>
            <p>
              I care about <Highlight accent="sky">clear APIs</Highlight>,
              maintainable code, and software that holds up in everyday use.
              Also: good kopi.
            </p>
          </Reveal>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:col-span-5 lg:grid-cols-1">
          <NowNote />
          <ClockCard />
        </div>
      </div>

      <div className="mt-12 grid gap-6 lg:grid-cols-12">
        <Reveal className={cn(popCardClass, "p-6 md:p-8 lg:col-span-5")}>
          <p className="font-hand text-brand-ink text-2xl">character sheet</p>
          <motion.dl
            className="mt-4 space-y-3"
            variants={keyboardVariants}
            initial={reduced ? false : "hidden"}
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
          >
            {characterSheet.map(([term, detail]) => (
              <motion.div
                key={term}
                variants={statVariants}
                className="border-line/15 grid grid-cols-[7.5rem_1fr] gap-3 border-t-2 border-dashed pt-3"
              >
                <dt className="text-ink-muted text-sm font-bold tracking-wide uppercase">
                  {term}
                </dt>
                <dd className="font-semibold">{detail}</dd>
              </motion.div>
            ))}
          </motion.dl>
        </Reveal>
        <Reveal
          className={cn(popCardClass, "p-6 md:p-8 lg:col-span-7")}
          delay={0.1}
        >
          <SkillKeyboard />
        </Reveal>
      </div>
    </section>
  );
}

function NowNote() {
  const reduced = useReducedMotion();

  return (
    <motion.div
      className="bg-sun text-on-accent border-line shadow-pop relative rounded-md border-2 p-6 pt-8"
      initial={reduced ? false : { rotate: 6, opacity: 0, y: 30 }}
      whileInView={{ rotate: 2, opacity: 1, y: 0 }}
      whileHover={reduced ? undefined : { rotate: -1, y: -4 }}
      viewport={{ once: true, amount: 0.6 }}
      transition={{ type: "spring", stiffness: 220, damping: 15 }}
    >
      <span
        aria-hidden="true"
        className="absolute -top-3 left-1/2 h-6 w-24 -translate-x-1/2 -rotate-3 rounded-sm border border-white/60 bg-white/55"
      />
      <p className="font-hand text-3xl leading-none">right now:</p>
      <p className="mt-3 text-lg leading-snug font-semibold">
        Building operational dashboards at Nauchara that talk to on-site
        devices, SAP and a warehouse system.
      </p>
    </motion.div>
  );
}

function ClockCard() {
  const time = useLocalTime();
  const hour = time ? Number(time.slice(0, 2)) : 12;
  const isNight = hour < 6 || hour >= 18;
  const mood =
    hour < 6
      ? "probably asleep. Probably."
      : hour < 11
        ? "the kopi is brewing."
        : hour < 18
          ? "shipping things."
          : "debugging something, most likely.";

  return (
    <Reveal
      className={cn(
        "border-line shadow-pop rounded-[28px] border-2 p-6 transition-colors duration-700",
        isNight ? "bg-brand text-on-brand" : "bg-sky text-on-accent",
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <p className="text-sm font-bold tracking-wide uppercase opacity-80">
          Local time in {SITE_LOCATION.city}
        </p>
        <motion.span
          key={isNight ? "moon" : "sun"}
          initial={{ rotate: -90, scale: 0 }}
          animate={{ rotate: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 14 }}
        >
          {isNight ? (
            <Moon aria-hidden="true" className="size-8 fill-current" />
          ) : (
            <Sun aria-hidden="true" className="size-8" />
          )}
        </motion.span>
      </div>
      <p className="font-display mt-2 text-6xl font-extrabold tracking-tight tabular-nums">
        {time ? (
          <>
            {time.slice(0, 2)}
            <span className="animate-blink">:</span>
            {time.slice(3, 5)}
          </>
        ) : (
          "--:--"
        )}
        <span className="ml-2 text-xl">{SITE_LOCATION.timeZoneLabel}</span>
      </p>
      <p className="font-hand mt-1 text-2xl">
        {time ? `Right now I'm ${mood}` : "Checking the clock…"}
      </p>
    </Reveal>
  );
}

// The keyboard "types itself in" when it scrolls into view.
const keyboardVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05, delayChildren: 0.2 } },
};
const keyVariants: Variants = {
  hidden: { opacity: 0, y: -16, scale: 0.6 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 500, damping: 18 },
  },
};
const keycapClass =
  "border-line font-display rounded-xl border-2 px-3.5 py-2 text-sm font-bold shadow-[0_5px_0_0_var(--color-line)] transition-[translate,box-shadow] duration-100 hover:-translate-y-0.5 hover:shadow-[0_7px_0_0_var(--color-line)] active:translate-y-1 active:shadow-[0_1px_0_0_var(--color-line)]";

function SkillKeyboard() {
  const [expanded, setExpanded] = useState(false);
  const reduced = useReducedMotion();
  const { play } = usePlayground();
  const count = mainKeys.length + (expanded ? extraKeys.length : 0);

  return (
    <>
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="font-hand text-brand-ink text-2xl">
          my inventory. Press the keys!
        </p>
        <p className="text-ink-muted text-sm font-semibold">
          {count} items equipped
        </p>
      </div>
      <motion.ul
        className="mt-5 flex flex-wrap gap-x-2.5 gap-y-3.5"
        variants={keyboardVariants}
        initial={reduced ? false : "hidden"}
        whileInView="visible"
        viewport={{ once: true, amount: 0.4 }}
      >
        {mainKeys.map((key, index) => (
          <motion.li key={key} layout variants={keyVariants}>
            <Keycap label={key} index={index} />
          </motion.li>
        ))}
        <AnimatePresence initial={false}>
          {expanded &&
            extraKeys.map((key, index) => (
              <motion.li
                key={key}
                layout
                initial={{ opacity: 0, scale: 0.5, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 22,
                  delay: index * 0.02,
                }}
              >
                <Keycap label={key} index={mainKeys.length + index} />
              </motion.li>
            ))}
        </AnimatePresence>
        <motion.li layout variants={keyVariants}>
          <button
            type="button"
            aria-expanded={expanded}
            onClick={() => {
              setExpanded((open) => !open);
              play("click");
            }}
            className={cn(keycapClass, "bg-brand text-on-brand")}
          >
            {expanded ? "Fewer keys" : `+${extraKeys.length} more`}
          </button>
        </motion.li>
      </motion.ul>
    </>
  );
}

interface KeycapProps {
  label: string;
  index: number;
}

function Keycap({ label, index }: KeycapProps) {
  const { play, burstFrom } = usePlayground();
  const color = keycapColors[index % keycapColors.length];

  return (
    <button
      type="button"
      onClick={(event) => {
        play("key");
        burstFrom(event.currentTarget, 8);
      }}
      className={cn(
        keycapClass,
        color,
        color === "bg-surface" ? "text-ink" : "text-on-accent",
      )}
    >
      {label}
    </button>
  );
}
