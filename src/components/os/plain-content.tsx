import { Link } from "@tanstack/react-router";
import { plainLinkClass } from "@/components/os/retro";
import { CONTACT_EMAIL, ELSEWHERE_LINKS } from "@/config/site";
import { bio, extraSkills, facts, intro, mainSkills } from "@/content/about";
import { projects, workExperiences, type Project } from "@/content/portfolio";

interface PlainContentProps {
  /** Given inside RugeOS, where a project's title opens its window. */
  onOpenProject?: () => void;
}

function projectLinks(project: Project) {
  return [
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
}

/** Everything on one readable page: the `/resume` page and the plain view. */
export default function PlainContent({ onOpenProject }: PlainContentProps) {
  return (
    <article className="mx-auto max-w-2xl space-y-12 px-5 py-12 leading-relaxed">
      <header>
        <p className="text-brand-ink text-xl font-medium">Halo! I&apos;m</p>
        <h1 className="text-5xl font-bold tracking-tight">Ahmad Zacky</h1>
        <p className="text-ink-soft mt-4 text-lg">{intro}</p>
        <p className="mt-4 flex flex-wrap gap-x-4 gap-y-1">
          <a className={plainLinkClass} href={`mailto:${CONTACT_EMAIL}`}>
            {CONTACT_EMAIL}
          </a>
          {ELSEWHERE_LINKS.map((link) => (
            <a
              key={link.href}
              className={plainLinkClass}
              href={link.href}
              target="_blank"
              rel="noreferrer"
            >
              {link.label}
            </a>
          ))}
        </p>
      </header>

      <section aria-labelledby="plain-about">
        <h2 id="plain-about" className="text-2xl font-semibold">
          About
        </h2>
        <div className="mt-3 space-y-3">
          {bio.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
        <dl className="mt-5 grid gap-x-6 gap-y-2 sm:grid-cols-[9rem_1fr]">
          {facts.map(([term, detail]) => (
            <div key={term} className="contents">
              <dt className="text-ink-muted font-semibold">{term}</dt>
              <dd>{detail}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section aria-labelledby="plain-experience">
        <h2 id="plain-experience" className="text-2xl font-semibold">
          Experience
        </h2>
        <ol className="mt-3 space-y-7">
          {workExperiences.map((job) => (
            <li key={job.company}>
              <p className="font-semibold">
                {job.position}, {job.company}
              </p>
              <p className="text-ink-muted text-sm">{job.duration}</p>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                {job.description.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="plain-projects">
        <h2 id="plain-projects" className="text-2xl font-semibold">
          Projects
        </h2>
        <ul className="mt-3 space-y-5">
          {projects.map((project) => {
            const links = projectLinks(project);
            return (
              <li key={project.slug}>
                {onOpenProject ? (
                  <Link
                    to="/projects/$projectSlug"
                    params={{ projectSlug: project.slug }}
                    className={`${plainLinkClass} text-lg font-semibold`}
                    onClick={onOpenProject}
                  >
                    {project.title}
                  </Link>
                ) : (
                  <p className="text-lg font-semibold">{project.title}</p>
                )}
                <p className="text-ink-soft">{project.summary}</p>
                <p className="text-ink-muted text-sm">
                  {project.technologies.map(({ label }) => label).join(" · ")}
                </p>
                {links.length > 0 && (
                  <p className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm">
                    {links.map(({ label, url }) => (
                      <a
                        key={url}
                        className={plainLinkClass}
                        href={url}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {label}
                      </a>
                    ))}
                  </p>
                )}
              </li>
            );
          })}
        </ul>
      </section>

      <section aria-labelledby="plain-skills">
        <h2 id="plain-skills" className="text-2xl font-semibold">
          Skills
        </h2>
        <p className="mt-3">{mainSkills.map(({ name }) => name).join(", ")}.</p>
        <p className="text-ink-soft mt-2 text-sm">
          Also: {extraSkills.join(", ")}.
        </p>
      </section>
    </article>
  );
}
