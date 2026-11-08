import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import { buttonClass, fieldClass, tagClass } from "@/components/os/retro";
import { getProjectBySlug, projects } from "@/content/portfolio";
import type { ProjectSlug } from "@/content/project-slugs";
import { useAppFrame } from "@/contexts/app-frame-context";
import { useOS } from "@/contexts/os-context";
import { accentBackground, projectAccent } from "@/lib/accents";
import { projectHost } from "@/lib/project-host";
import { cn } from "@/lib/utils";

interface ProjectAppProps {
  slug: ProjectSlug;
}

export default function ProjectApp({ slug }: ProjectAppProps) {
  const { windowKey } = useAppFrame();
  const { openProject } = useOS();
  const project = getProjectBySlug(slug)!;
  const index = projects.indexOf(project);
  const previous = projects[(index - 1 + projects.length) % projects.length];
  const next = projects[(index + 1) % projects.length];
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

  // Prev and Next swap the project inside this same window.
  const go = (to: ProjectSlug) => openProject(to, { replaceKey: windowKey });

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex shrink-0 items-center gap-1 px-1 pb-1">
        <button
          type="button"
          className={cn(buttonClass, "min-w-0 px-2")}
          onClick={() => go(previous.slug)}
          aria-label={`Previous project: ${previous.title}`}
        >
          <ChevronLeft aria-hidden="true" />
          <span className="hidden sm:inline">Back</span>
        </button>
        <button
          type="button"
          className={cn(buttonClass, "min-w-0 px-2")}
          onClick={() => go(next.slug)}
          aria-label={`Next project: ${next.title}`}
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight aria-hidden="true" />
        </button>
        <span
          className={cn(
            fieldClass,
            "ml-1 flex h-7 min-w-0 flex-1 items-center truncate px-2 font-mono text-sm",
          )}
        >
          {project.siteUrl ?? `https://rugefx.dev/projects/${project.slug}`}
        </span>
      </div>

      <div
        className={cn(
          fieldClass,
          "retro-scroll @container min-h-0 flex-1 overflow-y-auto",
        )}
      >
        {project.imageSrc && (
          <div
            className={cn(
              "flex aspect-[16/9] items-center justify-center p-[clamp(12px,4cqi,40px)] @2xl:aspect-[2/1]",
              accentBackground[projectAccent[project.slug]],
            )}
          >
            <img
              src={project.imageSrc}
              alt={`${project.title} preview`}
              className="bevel-window block max-h-full max-w-full object-contain"
            />
          </div>
        )}

        <div className="p-5 @lg:p-7">
          <span className={tagClass}>
            {project.category === "Mobile" ? "Mobile app" : "Website"}
          </span>
          <h3 className="font-pixel mt-3 text-4xl leading-none font-bold @lg:text-5xl">
            {project.title}
          </h3>
          <p className="text-ink-soft mt-2 text-lg">{project.summary}</p>

          <div className="mt-6 grid gap-6 @xl:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
            <p className="leading-relaxed">{project.description}</p>
            <div>
              <h4 className="text-ink-muted text-xs font-semibold tracking-wide uppercase">
                Built with
              </h4>
              <ul className="mt-2 flex flex-wrap gap-1.5">
                {project.technologies.map((technology) => (
                  <li key={technology.label} className={tagClass}>
                    <technology.icon aria-hidden="true" />
                    {technology.label}
                  </li>
                ))}
              </ul>
              {links.length > 0 && (
                <>
                  <h4 className="text-ink-muted mt-5 text-xs font-semibold tracking-wide uppercase">
                    Go poke at it
                  </h4>
                  <ul className="mt-2 flex flex-wrap gap-2">
                    {links.map((link) => (
                      <li key={link.url}>
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noreferrer"
                          className={buttonClass}
                        >
                          {link.label}
                          <ArrowUpRight aria-hidden="true" />
                        </a>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-0.5 flex shrink-0 gap-0.5 text-xs">
        <span className="bevel-thin flex-1 px-2 py-1">
          Done · {projectHost(project)}
        </span>
        <span className="bevel-thin px-2 py-1">
          {index + 1} of {projects.length}
        </span>
      </div>
    </div>
  );
}
