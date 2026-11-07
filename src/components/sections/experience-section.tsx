import { useState } from "react";
import { motion, useReducedMotion, type Variants } from "motion/react";
import { RotateCw } from "lucide-react";
import { chipClass } from "@/components/ui/pop-styles";
import SectionTitle from "@/components/ui/section-title";
import { workExperiences, type WorkExperience } from "@/content/portfolio";
import { usePlayground } from "@/contexts/playground-context";
import { useMediaQuery } from "@/hooks/use-media-query";
import { accentBackground, type Accent } from "@/lib/accents";
import { cn } from "@/lib/utils";

const cardAccents: Accent[] = ["brand", "mint", "sun", "pink"];

function yearsLabel(duration: string) {
  const years = duration.match(/\d{4}/g) ?? [];
  const isCurrent = /present/i.test(duration);
  const [start, end] = [years[0], isCurrent ? "Now" : years[1]];
  if (!end || end === start) return start ?? duration;
  return `${start}–${end === "Now" ? end : end.slice(2)}`;
}

export default function ExperienceSection() {
  const reduced = useReducedMotion();
  const twoColumns = useMediaQuery("(min-width: 768px)");

  return (
    <section
      id="experience"
      aria-labelledby="experience-title"
      className="mx-auto max-w-7xl scroll-mt-24 overflow-x-clip px-5 pt-24 md:px-8 md:pt-36"
    >
      <SectionTitle
        id="experience-title"
        note="where I've levelled up"
        title="Experience"
        accent="mint"
      />
      <p className="font-hand text-ink-muted -mt-6 mb-10 text-2xl">
        tap a card to flip it ↻
      </p>
      <motion.ol
        className="grid gap-8 md:grid-cols-2 md:gap-10"
        variants={dealVariants}
        initial={reduced ? false : "hidden"}
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        {workExperiences.map((job, index) => (
          <li key={job.company}>
            <FlipCard
              job={job}
              index={index}
              dealFrom={
                twoColumns
                  ? {
                      x: index % 2 ? "-55%" : "55%",
                      y: index < 2 ? "35%" : "-35%",
                    }
                  : { x: "0%", y: "30%" }
              }
            />
          </li>
        ))}
      </motion.ol>
    </section>
  );
}

interface DealOrigin {
  x: string;
  y: string;
}

interface FlipCardProps {
  job: WorkExperience;
  index: number;
  dealFrom: DealOrigin;
}

// Cards start as a messy pile in the middle, then get dealt to their spots.
const dealVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};
const cardVariants: Variants = {
  hidden: ({ from, index }: { from: DealOrigin; index: number }) => ({
    opacity: 0,
    scale: 0.85,
    x: from.x,
    y: from.y,
    rotate: (index - 1.5) * 9,
  }),
  visible: ({ tilt }: { tilt: number }) => ({
    opacity: 1,
    scale: 1,
    x: 0,
    y: 0,
    rotate: tilt,
    transition: { type: "spring", stiffness: 150, damping: 17 },
  }),
};

function FlipCard({ job, index, dealFrom }: FlipCardProps) {
  const [flipped, setFlipped] = useState(false);
  const reduced = useReducedMotion();
  const { play } = usePlayground();
  const accent = cardAccents[index % cardAccents.length];
  const isCurrent = /present/i.test(job.duration);
  const restingTilt = [-2, 1.5, -1, 2][index % 4];
  const faceClass =
    "backface-hidden border-line bg-surface shadow-pop absolute inset-0 flex flex-col overflow-hidden rounded-[28px] border-2 text-left";

  return (
    <motion.div
      className="h-[580px] [perspective:1400px] lg:h-[440px]"
      custom={{ from: dealFrom, index, tilt: restingTilt }}
      variants={cardVariants}
      whileHover={reduced ? undefined : { rotate: 0, y: -6 }}
    >
      <motion.button
        type="button"
        aria-pressed={flipped}
        onClick={() => {
          setFlipped((value) => !value);
          play("flip");
        }}
        className="relative block h-full w-full [transform-style:preserve-3d]"
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={
          reduced
            ? { duration: 0 }
            : { type: "spring", stiffness: 160, damping: 17 }
        }
      >
        <span className={faceClass}>
          <span
            className={cn(
              "border-line block border-b-2 p-6",
              accentBackground[accent],
            )}
          >
            <span className="block text-sm font-bold tracking-wide uppercase opacity-80">
              {job.duration.replace(" - ", " → ")}
            </span>
            <span className="font-display mt-8 block text-5xl font-extrabold tracking-tight">
              {yearsLabel(job.duration)}
            </span>
          </span>
          <span className="flex flex-1 flex-col p-6">
            {isCurrent && (
              <span className="bg-mint text-on-accent border-line mb-4 inline-flex w-fit items-center gap-2 rounded-full border-2 px-3 py-1 text-xs font-extrabold uppercase">
                <span className="animate-pulse-ring size-2 rounded-full bg-white" />
                Now playing
              </span>
            )}
            <span className="font-display block text-2xl leading-tight font-extrabold">
              {job.company}
            </span>
            <span className="text-ink-soft mt-1 block text-lg">
              {job.position}
            </span>
            <span className="font-hand text-ink-muted mt-auto flex items-center gap-2 text-2xl">
              <RotateCw aria-hidden="true" className="size-5" />
              flip for details
            </span>
          </span>
        </span>

        <span className={cn(faceClass, "[transform:rotateY(180deg)] p-6")}>
          <span className="font-hand text-brand-ink text-2xl">
            quest log: {job.company.split(" (")[0]}
          </span>
          <span role="list" className="mt-3 block space-y-2.5">
            {job.description.map((line) => (
              <span
                role="listitem"
                key={line}
                className="flex gap-2.5 text-[15px] leading-snug"
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    "border-line mt-1.5 size-2.5 shrink-0 rounded-full border-2",
                    accentBackground[accent],
                  )}
                />
                {line}
              </span>
            ))}
          </span>
          {job.technologies && (
            <span role="list" className="mt-auto flex flex-wrap gap-1.5 pt-4">
              {job.technologies.map((technology) => (
                <span role="listitem" key={technology} className={chipClass}>
                  {technology}
                </span>
              ))}
            </span>
          )}
        </span>
      </motion.button>
    </motion.div>
  );
}
