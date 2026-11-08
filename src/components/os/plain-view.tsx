import { useEffect, useRef } from "react";
import { Link } from "@tanstack/react-router";
import { buttonClass } from "@/components/os/retro";
import { CONTACT_EMAIL, ELSEWHERE_LINKS } from "@/config/site";
import { bio, extraSkills, facts, intro, mainSkills } from "@/content/about";
import { projects, workExperiences } from "@/content/portfolio";
import { useOS } from "@/contexts/os-context";

const linkClass =
  "text-brand-ink underline decoration-1 underline-offset-2 hover:decoration-2";

/** Everything on one readable page, for visitors in a hurry. */
export default function PlainView() {
  const { setPlainView } = useOS();
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeRef.current?.focus();
  }, []);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Plain view"
      className="retro-scroll bg-field text-ink fixed inset-0 z-[80] overflow-y-auto"
      onKeyDown={(event) => {
        if (event.key === "Escape") setPlainView(false);
      }}
    >
      <div className="bg-face bevel sticky top-0 z-10 flex h-12 items-center justify-between gap-3 px-3">
        <span className="font-pixel text-lg">Plain view</span>
        <button
          ref={closeRef}
          type="button"
          className={buttonClass}
          onClick={() => setPlainView(false)}
        >
          Back to RugeOS
        </button>
      </div>

      <article className="mx-auto max-w-2xl space-y-12 px-5 py-12 leading-relaxed">
        <header>
          <p className="font-pixel text-brand-ink text-xl">Halo! I&apos;m</p>
          <h2 className="font-pixel text-5xl font-bold">Ahmad Zacky</h2>
          <p className="text-ink-soft mt-4 text-lg">{intro}</p>
          <p className="mt-4 flex flex-wrap gap-x-4 gap-y-1">
            <a className={linkClass} href={`mailto:${CONTACT_EMAIL}`}>
              {CONTACT_EMAIL}
            </a>
            {ELSEWHERE_LINKS.map((link) => (
              <a
                key={link.href}
                className={linkClass}
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
          <h3 id="plain-about" className="font-pixel text-2xl">
            About
          </h3>
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

        <section aria-labelledby="plain-projects">
          <h3 id="plain-projects" className="font-pixel text-2xl">
            Projects
          </h3>
          <ul className="mt-3 space-y-5">
            {projects.map((project) => (
              <li key={project.slug}>
                <Link
                  to="/projects/$projectSlug"
                  params={{ projectSlug: project.slug }}
                  className={`${linkClass} text-lg font-semibold`}
                  onClick={() => setPlainView(false)}
                >
                  {project.title}
                </Link>
                <p className="text-ink-soft">{project.summary}</p>
                <p className="text-ink-muted text-sm">
                  {project.technologies.map(({ label }) => label).join(" · ")}
                </p>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="plain-experience">
          <h3 id="plain-experience" className="font-pixel text-2xl">
            Experience
          </h3>
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

        <section aria-labelledby="plain-skills">
          <h3 id="plain-skills" className="font-pixel text-2xl">
            Skills
          </h3>
          <p className="mt-3">
            {mainSkills.map(({ name }) => name).join(", ")}.
          </p>
          <p className="text-ink-soft mt-2 text-sm">
            Also: {extraSkills.join(", ")}.
          </p>
        </section>
      </article>
    </div>
  );
}
