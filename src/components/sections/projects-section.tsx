import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  AnimatePresence,
  LayoutGroup,
  motion,
  useInView,
  useReducedMotion,
} from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  magneticCardClass,
  magneticLinkArrowClass,
  magneticLinkCardClass,
  useMagneticCard,
} from "@/components/ui/magnetic-card";
import { projects, type Project } from "@/content/portfolio";
import { portfolioRevealEase } from "@/lib/portfolio-motion";
import { cn } from "@/lib/utils";
import { sectionTitleClass } from "@/components/sections/section-styles";

import { projectNavigation } from "@/lib/project-navigation";

const categories = ["All", "Mobile", "Websites"] as const;
const projectLayoutTransition = {
  bounce: 0.06,
  duration: 0.38,
  type: "spring" as const,
};
const projectEntranceTransition = {
  bounce: 0.1,
  duration: 0.48,
  type: "spring" as const,
};
const filterCapsuleTransition = {
  bounce: 0.08,
  duration: 0.28,
  type: "spring" as const,
};

export default function ProjectsSection() {
  const [category, setCategory] = useState<(typeof categories)[number]>(
    projectNavigation.category,
  );
  const sectionRef = useRef<HTMLElement>(null);
  const hasEnteredRef = useRef(projectNavigation.hasRevealedGrid);
  const shouldReduceMotion = Boolean(useReducedMotion());
  const enteredViewport = useInView(sectionRef, {
    margin: "0px 0px -12% 0px",
    once: true,
  });
  const isInView = projectNavigation.hasRevealedGrid || enteredViewport;
  const isInitialEntrance = !hasEnteredRef.current;
  const visibleProjects = projects.filter(
    (project) => category === "All" || project.category === category,
  );

  useEffect(() => {
    if (isInView) {
      hasEnteredRef.current = true;
      projectNavigation.hasRevealedGrid = true;
    }
  }, [isInView]);

  return (
    <LayoutGroup id="selected-work">
      <section
        className="scroll-mt-6 pt-[76px] max-[760px]:pt-[52px]"
        id="projects"
        ref={sectionRef}
      >
        <motion.div
          animate={{ opacity: isInView ? 1 : 0 }}
          className="mb-7 flex items-center justify-between gap-6 max-[760px]:flex-col max-[760px]:items-start"
          initial={projectNavigation.hasRevealedGrid ? false : { opacity: 0 }}
          transition={{
            duration: shouldReduceMotion ? 0.18 : 0.22,
            ease: portfolioRevealEase,
          }}
        >
          <h2 className={sectionTitleClass}>Selected work</h2>
          <ToggleGroup
            className="flex flex-wrap gap-[5px] max-[480px]:gap-1"
            aria-label="Filter projects"
            selectionMode="single"
            disallowEmptySelection
            selectedKeys={[category]}
            onSelectionChange={(keys) => {
              const selectedCategory = Array.from(keys)[0];

              if (
                typeof selectedCategory === "string" &&
                categories.includes(
                  selectedCategory as (typeof categories)[number],
                )
              ) {
                projectNavigation.category =
                  selectedCategory as (typeof categories)[number];
                setCategory(projectNavigation.category);
              }
            }}
          >
            {categories.map((item) => (
              <ToggleGroupItem
                className="text-portfolio-copy-muted data-selected:text-portfolio-brand-strong relative isolate overflow-hidden bg-transparent max-[480px]:px-[11px]"
                key={item}
                id={item}
                size="default"
              >
                {category === item &&
                  (shouldReduceMotion ? (
                    <span
                      aria-hidden="true"
                      className="bg-portfolio-tint-soft absolute inset-0 -z-10 rounded-full"
                    />
                  ) : (
                    <motion.span
                      aria-hidden="true"
                      className="bg-portfolio-tint-soft absolute inset-0 -z-10 rounded-full"
                      layoutId="selected-work-filter-capsule"
                      transition={filterCapsuleTransition}
                    />
                  ))}
                <span className="relative z-10 transition-colors duration-[140ms]">
                  {item}
                </span>
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </motion.div>

        <motion.div
          className={cn(
            "relative grid [grid-auto-flow:dense] grid-cols-12 gap-5",
            category === "All" &&
              "[grid-auto-rows:296px] max-[1120px]:auto-rows-auto",
          )}
          layout={!shouldReduceMotion}
          transition={{ layout: projectLayoutTransition }}
        >
          <AnimatePresence initial={false} mode="popLayout">
            {visibleProjects.map((project, index) => (
              <ProjectLayoutItem
                key={project.slug}
                index={index}
                isBento={category === "All"}
                isInView={isInView}
                isInitialEntrance={isInitialEntrance}
                project={project}
                shouldReduceMotion={shouldReduceMotion}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      </section>
    </LayoutGroup>
  );
}

function getProjectLayoutClass(slug: string, isBento: boolean): string {
  if (!isBento) {
    if (slug === "qurban-asyik") {
      return "col-span-12 h-[520px] max-[900px]:h-[480px] max-[760px]:h-[440px] max-[480px]:h-[400px]";
    }

    return "col-span-6 min-h-[420px] max-[1120px]:min-h-[400px] max-[900px]:col-span-12 max-[900px]:min-h-[410px] max-[760px]:min-h-[390px] max-[480px]:min-h-[360px]";
  }

  if (slug === "qurban-asyik") {
    return "col-span-7 row-span-2 max-[1120px]:col-span-12 max-[1120px]:row-auto max-[1120px]:min-h-[560px] max-[900px]:min-h-[520px] max-[760px]:min-h-[500px] max-[480px]:min-h-[460px]";
  }

  if (slug === "rugefx") {
    return "col-span-12 max-[1120px]:col-span-6 max-[1120px]:row-auto max-[1120px]:min-h-[400px] max-[900px]:col-span-12 max-[900px]:min-h-[410px] max-[760px]:min-h-[390px] max-[480px]:min-h-[360px]";
  }

  return "col-span-5 max-[1120px]:col-span-6 max-[1120px]:row-auto max-[1120px]:min-h-[400px] max-[900px]:col-span-12 max-[900px]:min-h-[410px] max-[760px]:min-h-[390px] max-[480px]:min-h-[360px]";
}

interface ProjectLayoutItemProps {
  project: Project;
  index: number;
  isBento: boolean;
  isInView: boolean;
  isInitialEntrance: boolean;
  shouldReduceMotion: boolean;
}

function ProjectLayoutItem({
  project,
  index,
  isBento,
  isInView,
  isInitialEntrance,
  shouldReduceMotion,
}: ProjectLayoutItemProps) {
  const cappedIndex = Math.min(index, 5);
  const entranceDelay = isInitialEntrance ? 0.07 + cappedIndex * 0.06 : 0;
  const restingScale = 1;
  const hiddenScale = shouldReduceMotion
    ? restingScale
    : isInitialEntrance
      ? project.slug === "qurban-asyik"
        ? 0.96
        : 0.975
      : 0.98;

  return (
    <motion.div
      animate={{
        opacity: isInView ? 1 : 0,
        scale: isInView ? restingScale : hiddenScale,
      }}
      className={cn("min-w-0", getProjectLayoutClass(project.slug, isBento))}
      exit={
        shouldReduceMotion
          ? {
              opacity: 0,
              transition: { duration: 0.14, ease: portfolioRevealEase },
            }
          : {
              opacity: 0,
              scale: 0.98,
              transition: { duration: 0.18, ease: portfolioRevealEase },
            }
      }
      initial={{ opacity: 0, scale: hiddenScale }}
      layout={!shouldReduceMotion}
      layoutId={
        shouldReduceMotion ? undefined : `selected-work-${project.slug}`
      }
      style={{ borderRadius: 24 }}
      transition={{
        layout: shouldReduceMotion ? { duration: 0 } : projectLayoutTransition,
        opacity: {
          delay: shouldReduceMotion ? 0 : entranceDelay,
          duration: shouldReduceMotion
            ? isInitialEntrance
              ? 0.18
              : 0.14
            : isInitialEntrance
              ? 0.28
              : 0.22,
          ease: portfolioRevealEase,
        },
        scale: shouldReduceMotion
          ? { duration: 0 }
          : {
              ...(isInitialEntrance
                ? projectEntranceTransition
                : projectLayoutTransition),
              delay: entranceDelay,
            },
      }}
    >
      <PreviewProject project={project} />
    </motion.div>
  );
}

interface PreviewProjectProps {
  project: Project;
}

function PreviewProject({ project }: PreviewProjectProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const cardMagnetism = useMagneticCard(2);

  return (
    <Link
      className={cn(
        magneticCardClass,
        magneticLinkCardClass,
        "border-portfolio-border-soft bg-portfolio-surface hover:border-portfolio-border-hover hover:shadow-portfolio-card flex h-full min-w-0 flex-col overflow-hidden rounded-3xl border text-inherit",
      )}
      data-magnetic-card=""
      data-project={project.slug}
      to="/projects/$projectSlug"
      params={{ projectSlug: project.slug }}
      aria-label={`View ${project.title} project details`}
      {...cardMagnetism}
    >
      <div
        className={cn(
          "bg-portfolio-tint flex min-h-0 flex-1 items-center justify-center overflow-hidden",
          project.imageFit === "contain" && "bg-portfolio-media p-7",
        )}
      >
        <img
          data-project-image={project.slug}
          className={cn(
            "h-full w-full object-cover opacity-0 transition-opacity duration-180",
            imageLoaded && "opacity-100",
            project.imageFit === "contain" && "object-contain",
          )}
          src={project.imageSrc}
          alt={`${project.title} preview`}
          loading="lazy"
          onLoad={() => setImageLoaded(true)}
        />
      </div>
      <div className="shrink-0 px-[22px] pt-5 pb-[22px] max-[760px]:p-6">
        <div className="flex items-start justify-between gap-5">
          <div>
            <h3 className="font-display text-[22px] leading-tight font-semibold tracking-[-0.8px]">
              {project.title}
            </h3>
            <p className="text-portfolio-copy-muted mt-1 text-sm leading-normal">
              {project.summary}
            </p>
          </div>
          <ArrowUpRight
            className={cn(
              magneticLinkArrowClass,
              "text-portfolio-brand mt-[3px] shrink-0",
            )}
            aria-hidden="true"
          />
        </div>
        <div
          className="mt-[15px] flex flex-wrap gap-[7px]"
          aria-label="Technology stack"
        >
          {project.technologies.map((technology) => (
            <span
              key={technology.label}
              className="bg-portfolio-tint-soft text-portfolio-brand-strong inline-flex h-[30px] w-[30px] items-center justify-center rounded-lg [&_svg]:h-[15px] [&_svg]:w-[15px] [&_svg]:fill-current"
              title={technology.label}
              aria-label={technology.label}
            >
              <technology.icon aria-hidden="true" />
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
