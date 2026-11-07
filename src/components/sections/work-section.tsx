import { Link } from "@tanstack/react-router";
import { motion, useReducedMotion, type Variants } from "motion/react";
import { ArrowRight } from "lucide-react";
import { chipClass } from "@/components/ui/pop-styles";
import SectionTitle from "@/components/ui/section-title";
import { projects, type Project } from "@/content/portfolio";
import { usePlayground } from "@/contexts/playground-context";
import { accentBackground, projectAccent } from "@/lib/accents";
import { cn } from "@/lib/utils";

const restingTilts = [-2.5, 2, 1.5, -2];

// Each polaroid drops onto the board, then gets taped down and stickered.
const dropVariants: Variants = {
  hidden: (tilt: number) => ({
    opacity: 0,
    y: -140,
    rotate: tilt * 3,
    scale: 1.08,
  }),
  visible: (tilt: number) => ({
    opacity: 1,
    y: 0,
    rotate: tilt,
    scale: 1,
    transition: { type: "spring", stiffness: 170, damping: 15 },
  }),
};
const tapeVariants: Variants = {
  hidden: { scaleX: 0, opacity: 0 },
  visible: {
    scaleX: 1,
    opacity: 1,
    transition: { delay: 0.45, duration: 0.25, ease: "easeOut" },
  },
};
const stickerVariants: Variants = {
  hidden: { scale: 0, rotate: -40 },
  visible: {
    scale: 1,
    rotate: 12,
    transition: { delay: 0.65, type: "spring", stiffness: 420, damping: 12 },
  },
};

export default function WorkSection() {
  return (
    <section
      id="work"
      aria-labelledby="work-title"
      className="mx-auto max-w-6xl scroll-mt-24 overflow-x-clip px-5 pt-24 pb-6 md:px-8 md:pt-36"
    >
      <SectionTitle
        id="work-title"
        note="stuff I've built"
        title="Work"
        accent="sun"
      />
      <ul className="grid gap-x-14 gap-y-20 md:grid-cols-2 md:[&>li:nth-child(even)]:mt-28">
        {projects.map((project, index) => (
          <li key={project.slug}>
            <Polaroid project={project} index={index} />
          </li>
        ))}
      </ul>
    </section>
  );
}

interface PolaroidProps {
  project: Project;
  index: number;
}

function Polaroid({ project, index }: PolaroidProps) {
  const reduced = useReducedMotion();
  const { play } = usePlayground();
  const tilt = restingTilts[index % restingTilts.length];

  return (
    <motion.div
      className="relative"
      custom={tilt}
      variants={dropVariants}
      initial={reduced ? false : "hidden"}
      whileInView="visible"
      whileHover={reduced ? undefined : { rotate: 0, y: -10, scale: 1.015 }}
      viewport={{ once: true, amount: 0.35 }}
      onPointerEnter={() => play("pop")}
    >
      <motion.span
        aria-hidden="true"
        variants={tapeVariants}
        className="absolute -top-4 left-1/2 z-10 h-8 w-32 -translate-x-1/2 -rotate-3 rounded-sm border border-white/70 bg-white/60 shadow-sm backdrop-blur-[1px] dark:bg-white/25"
      />
      <motion.span
        aria-hidden="true"
        variants={stickerVariants}
        className="bg-brand text-on-brand font-display shadow-sticker absolute -top-6 -right-4 z-10 grid size-20 place-items-center rounded-full border-[3px] border-white text-sm font-extrabold md:-right-6"
      >
        {project.category}
      </motion.span>

      <Link
        to="/projects/$projectSlug"
        params={{ projectSlug: project.slug }}
        className="group border-line bg-surface shadow-pop hover:shadow-pop-lg block rounded-md border-2 p-4 pb-5 transition-shadow duration-300"
      >
        <div
          className={cn(
            "border-line relative aspect-[4/3] overflow-hidden rounded-sm border-2",
            accentBackground[projectAccent[project.slug]],
          )}
        >
          {project.imageSrc && (
            <img
              data-project-image={project.slug}
              src={project.imageSrc}
              alt=""
              loading="lazy"
              className={cn(
                "h-full w-full transition-transform duration-500 ease-(--ease-spring) group-hover:scale-[1.04]",
                project.imageFit === "contain"
                  ? "object-contain p-6"
                  : "object-cover",
              )}
            />
          )}
        </div>
        <div className="mt-4 flex items-end justify-between gap-3 px-1">
          <div>
            <h3 className="font-hand text-[42px] leading-none font-bold">
              {project.title}
            </h3>
            <p className="text-ink-soft mt-1.5">{project.summary}</p>
          </div>
          <span className="font-hand text-brand-ink hover-device:-translate-x-2 hover-device:opacity-0 flex shrink-0 items-center gap-1 text-2xl transition duration-300 group-hover:translate-x-0 group-hover:opacity-100">
            open
            <ArrowRight aria-hidden="true" className="size-5" />
          </span>
        </div>
        <ul
          className="mt-4 flex flex-wrap gap-2 px-1"
          aria-label="Technologies"
        >
          {project.technologies.map((technology) => (
            <li key={technology.label} className={chipClass}>
              <technology.icon aria-hidden="true" />
              {technology.label}
            </li>
          ))}
        </ul>
      </Link>
    </motion.div>
  );
}
