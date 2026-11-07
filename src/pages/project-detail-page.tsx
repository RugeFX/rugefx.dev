import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { Link, useRouter } from "@tanstack/react-router";
import { motion, useReducedMotion } from "motion/react";
import BouncyText from "@/components/ui/bouncy-text";
import {
  chipClass,
  popButtonClass,
  popCardClass,
} from "@/components/ui/pop-styles";
import Reveal from "@/components/ui/reveal";
import WindowBar from "@/components/ui/window-bar";
import { projects, type Project } from "@/content/portfolio";
import { usePlayground } from "@/contexts/playground-context";
import { accentBackground, projectAccent } from "@/lib/accents";
import { projectHost } from "@/lib/project-host";
import { projectNavigation } from "@/lib/project-navigation";
import { cn } from "@/lib/utils";

interface ProjectDetailPageProps {
  project: Project;
}

export default function ProjectDetailPage({ project }: ProjectDetailPageProps) {
  const router = useRouter();
  const reduced = useReducedMotion();
  const { play } = usePlayground();
  const index = projects.findIndex(({ slug }) => slug === project.slug);
  const nextProject = projects[(index + 1) % projects.length];
  const accent = projectAccent[project.slug];
  const links = [
    project.siteUrl && {
      label: project.siteLinkLabel ?? "Visit the site",
      url: project.siteUrl,
    },
    ...(project.additionalLinks ?? []),
    project.repositoryUrl && {
      label: "Source code",
      url: project.repositoryUrl,
    },
  ].filter((link): link is { label: string; url: string } => Boolean(link));
  const pop = (delay: number) => ({
    initial: reduced ? false : { opacity: 0, y: 24, scale: 0.96 },
    animate: { opacity: 1, y: 0, scale: 1 },
    transition: { type: "spring" as const, stiffness: 240, damping: 20, delay },
  });

  return (
    <main className="mx-auto max-w-6xl px-5 pt-28 pb-24 md:px-8">
      <motion.div
        className="flex items-center justify-between gap-4"
        {...pop(0)}
      >
        <Link
          to="/"
          hash="work"
          className={cn(popButtonClass, "bg-surface h-11 px-4 text-sm")}
          onClick={(event) => {
            play("click");
            const origin = projectNavigation.origin;
            if (
              event.button !== 0 ||
              event.metaKey ||
              event.ctrlKey ||
              event.shiftKey ||
              event.altKey
            )
              return;
            // Returning to the exact history entry restores scroll and lets
            // the shared image fly back into its card.
            if (
              origin?.slug === project.slug &&
              router.state.location.state.__TSR_index ===
                origin.historyIndex + 1
            ) {
              event.preventDefault();
              router.history.back();
            }
          }}
        >
          <ArrowLeft aria-hidden="true" />
          Back to work
        </Link>
        <span className="bg-sun text-on-accent border-line font-display rotate-3 rounded-full border-2 px-3 py-1 text-sm font-extrabold">
          {index + 1} of {projects.length}
        </span>
      </motion.div>

      <header className="mt-12 text-center">
        <motion.span
          className={cn(
            "font-display inline-block -rotate-3 rounded-full border-[3px] border-white px-4 py-1 font-extrabold shadow-[var(--shadow-sticker)]",
            accentBackground[accent],
          )}
          {...pop(0.05)}
        >
          {project.category}
        </motion.span>
        <motion.h1
          className="font-display mt-4 text-[clamp(52px,10vw,148px)] leading-[0.9] font-extrabold tracking-[-0.045em]"
          {...pop(0.1)}
        >
          <BouncyText text={project.title} />
        </motion.h1>
        <motion.p
          className="text-ink-soft mx-auto mt-4 max-w-[36ch] text-xl md:text-2xl"
          {...pop(0.18)}
        >
          {project.summary}
        </motion.p>
      </header>

      {project.imageSrc && (
        <div
          className={cn(popCardClass, "shadow-pop-lg mt-12 overflow-hidden")}
        >
          <WindowBar label={projectHost(project)} />
          <div
            className={cn(
              "flex aspect-[16/10] items-center justify-center p-[clamp(16px,3vw,40px)] md:aspect-[2/1]",
              accentBackground[accent],
            )}
          >
            <img
              data-project-image={project.slug}
              className="block h-full w-full object-contain"
              src={project.imageSrc}
              alt={`${project.title} project preview`}
            />
          </div>
        </div>
      )}

      <section
        aria-label="Project details"
        className="mt-12 grid gap-6 md:grid-cols-[1.4fr_1fr]"
      >
        <Reveal className={cn(popCardClass, "p-7 md:p-9")}>
          <p className="font-hand text-brand-ink text-2xl">the story</p>
          <h2 className="font-display mt-1 text-3xl font-extrabold tracking-tight">
            About the project
          </h2>
          <p className="text-ink-soft mt-4 text-lg leading-relaxed">
            {project.description}
          </p>
        </Reveal>
        <Reveal className={cn(popCardClass, "p-7 md:p-9")} delay={0.08}>
          <h2 className="font-display text-xl font-extrabold">Made with</h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {project.technologies.map((technology) => (
              <li key={technology.label} className={chipClass}>
                <technology.icon aria-hidden="true" />
                {technology.label}
              </li>
            ))}
          </ul>
          {links.length > 0 && (
            <>
              <h2 className="font-display mt-7 text-xl font-extrabold">
                Go poke at it
              </h2>
              <ul className="mt-3 flex flex-wrap gap-3">
                {links.map((link) => (
                  <li key={link.url}>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noreferrer"
                      className={cn(
                        popButtonClass,
                        "bg-brand text-on-brand h-11 px-4 text-sm",
                      )}
                    >
                      {link.label}
                      <ArrowUpRight aria-hidden="true" />
                    </a>
                  </li>
                ))}
              </ul>
            </>
          )}
        </Reveal>
      </section>

      <Link
        to="/projects/$projectSlug"
        params={{ projectSlug: nextProject.slug }}
        onClick={() => play("pop")}
        className={cn(
          "group border-line pop-press mt-16 flex items-center justify-between gap-6 rounded-[32px] border-2 p-8 md:p-12",
          accentBackground[projectAccent[nextProject.slug]],
        )}
      >
        <span>
          <span className="font-hand block text-2xl md:text-3xl">next up</span>
          <span className="font-display block text-[clamp(40px,7vw,96px)] leading-[0.95] font-extrabold tracking-[-0.04em]">
            {nextProject.title}
          </span>
        </span>
        <ArrowRight
          aria-hidden="true"
          className="size-[clamp(36px,5vw,64px)] shrink-0 transition-transform duration-300 ease-(--ease-spring) group-hover:translate-x-3"
          strokeWidth={2.5}
        />
      </Link>
    </main>
  );
}
