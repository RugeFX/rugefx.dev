import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { Link, useRouter } from "@tanstack/react-router";
import { LinkButton } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button-variants";
import { getPresentedProject } from "@/lib/project-presentation";

import ProjectDetailPanel from "@/components/projects/project-detail-panel";
import { projectNavigation } from "@/lib/project-navigation";
import { portfolioRevealEase } from "@/lib/portfolio-motion";

interface ProjectDetailPageProps {
  projectSlug: string;
}

export default function ProjectDetailPage({
  projectSlug,
}: ProjectDetailPageProps) {
  const reduced = Boolean(useReducedMotion());
  const router = useRouter();
  const [imageLoaded, setImageLoaded] = useState(false);
  const presentedProject = getPresentedProject(projectSlug);

  if (!presentedProject) {
    return (
      <main className="grid min-h-screen place-content-center gap-5 text-center">
        <h1 className="font-display text-5xl">Project not found.</h1>
        <Link className={buttonVariants({ variant: "default" })} to="/">
          Return home
        </Link>
      </main>
    );
  }

  const { project, summary, title } = presentedProject;

  return (
    <motion.div
      initial={reduced ? { opacity: 0 } : false}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.18, ease: portfolioRevealEase }}
      className="bg-portfolio-canvas text-portfolio-ink [&_a:focus-visible]:outline-portfolio-focus [&_button:focus-visible]:outline-portfolio-focus min-h-screen pb-20 font-sans max-[520px]:pb-10 motion-reduce:[&_*]:animate-none motion-reduce:[&_*]:scroll-auto motion-reduce:[&_*]:transition-none [&_a]:no-underline [&_a:focus-visible]:outline-[3px] [&_a:focus-visible]:outline-offset-[5px] [&_button:focus-visible]:outline-[3px] [&_button:focus-visible]:outline-offset-[5px]"
    >
      <main className="mx-auto max-w-[1280px] px-8 max-[1120px]:px-6 max-[760px]:px-[18px] max-[480px]:px-[14px]">
        <motion.nav
          initial={reduced ? false : { opacity: 0, scale: 0.985 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.26, ease: portfolioRevealEase }}
          className="flex min-h-28 items-center justify-between gap-6 max-[520px]:min-h-[88px]"
          aria-label="Project navigation"
        >
          <Link
            className="group/project-back text-portfolio-copy-muted inline-flex items-center gap-[9px] text-sm"
            to="/"
            hash="projects"
            onClick={(event) => {
              const origin = projectNavigation.origin;
              if (
                event.button !== 0 ||
                event.metaKey ||
                event.ctrlKey ||
                event.shiftKey ||
                event.altKey
              )
                return;
              if (
                origin?.slug === projectSlug &&
                router.state.location.state.__TSR_index ===
                  origin.historyIndex + 1
              ) {
                event.preventDefault();
                router.history.back();
              }
            }}
          >
            <ArrowLeft
              aria-hidden="true"
              size={18}
              className="transition-transform duration-150 motion-safe:group-hover/project-back:-translate-x-[3px]"
            />{" "}
            Back to selected work
          </Link>
          <Link
            to="/"
            className="font-display text-[32px] font-bold tracking-[-2px] max-[760px]:text-[28px] max-[520px]:text-2xl"
          >
            RugeFX
          </Link>
        </motion.nav>

        <article className="grid grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] gap-5 max-[900px]:grid-cols-1">
          <ProjectDetailPanel className="bg-portfolio-brand overflow-hidden rounded-[25px] p-[clamp(34px,5vw,60px)] text-white max-[520px]:px-6 max-[520px]:py-[30px]">
            <p className="text-portfolio-on-brand-muted text-sm">
              {project.category}
            </p>
            <h1 className="font-display my-[34px] text-[clamp(54px,7vw,88px)] leading-[0.98] tracking-[-5px] max-[520px]:text-[54px] max-[520px]:tracking-[-3px]">
              {title}
            </h1>
            <h2 className="text-portfolio-on-brand max-w-[24ch] text-[21px] leading-normal font-normal">
              {summary}
            </h2>
            <div
              className="mt-[42px] flex flex-wrap gap-[9px]"
              aria-label="Technology stack"
            >
              {project.technologies.map((technology) => (
                <span
                  className="border-portfolio-brand-outline inline-flex items-center gap-2 rounded-[9px] border px-[11px] py-2 text-xs [&_svg]:h-[15px] [&_svg]:w-[15px] [&_svg]:fill-current"
                  key={technology.label}
                  title={technology.label}
                >
                  <technology.icon aria-hidden="true" />
                  {technology.label}
                </span>
              ))}
            </div>
          </ProjectDetailPanel>

          {project.imageSrc && (
            <ProjectDetailPanel
              reveal={false}
              className="bg-portfolio-tint grid min-h-[540px] place-items-center overflow-hidden rounded-[25px] p-11 max-[900px]:min-h-[460px] max-[520px]:min-h-80 max-[520px]:p-6"
            >
              <img
                data-project-image={projectSlug}
                className="h-full w-full object-contain transition-opacity duration-180"
                style={{ opacity: imageLoaded ? 1 : 0 }}
                onLoad={() => setImageLoaded(true)}
                src={project.imageSrc}
                alt={`${title} project preview`}
              />
            </ProjectDetailPanel>
          )}

          <ProjectDetailPanel
            delay={0.07}
            className="border-portfolio-border-soft bg-portfolio-surface col-span-full grid grid-cols-[0.65fr_1.35fr] gap-[50px] overflow-hidden rounded-[25px] border p-11 max-[900px]:grid-cols-1 max-[900px]:gap-5 max-[520px]:px-6 max-[520px]:py-[30px]"
          >
            <h2 className="font-display text-[28px] font-semibold tracking-[-1px]">
              About the project
            </h2>
            <p className="text-portfolio-copy-muted leading-[1.8]">
              {project.description}
            </p>
            <div className="col-start-2 flex flex-wrap gap-3 max-[900px]:col-start-1">
              {project.siteUrl && (
                <LinkButton
                  variant="secondary"
                  href={project.siteUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  {project.siteLinkLabel ?? "Visit project"}
                  <ArrowUpRight
                    data-icon="inline-end"
                    data-direction="diagonal"
                  />
                </LinkButton>
              )}
              {project.additionalLinks?.map((link) => (
                <LinkButton
                  variant="secondary"
                  key={link.url}
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                >
                  {link.label}
                  <ArrowUpRight
                    data-icon="inline-end"
                    data-direction="diagonal"
                  />
                </LinkButton>
              ))}
              {project.repositoryUrl && (
                <LinkButton
                  variant="secondary"
                  href={project.repositoryUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  Source code
                  <ArrowUpRight
                    data-icon="inline-end"
                    data-direction="diagonal"
                  />
                </LinkButton>
              )}
            </div>
          </ProjectDetailPanel>
        </article>
      </main>
    </motion.div>
  );
}
