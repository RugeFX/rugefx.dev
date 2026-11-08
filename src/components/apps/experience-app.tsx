import { useId, useRef, useState, type KeyboardEvent } from "react";
import PixelIcon from "@/components/os/pixel-icon";
import {
  buttonClass,
  groupClass,
  groupLegendClass,
  tagClass,
} from "@/components/os/retro";
import { workExperiences } from "@/content/portfolio";
import { useAppFrame } from "@/contexts/app-frame-context";
import { usePlayground } from "@/contexts/playground-context";
import { cn } from "@/lib/utils";

/** "PT. Jagad Aman Prima (Nauchara)" → "Nauchara", for the tab labels. */
function shortName(company: string) {
  const bracketed = /\(([^)]+)\)/.exec(company)?.[1];
  if (bracketed) return bracketed;
  const named = company.split(" - ").at(-1)!;
  return named.length > 14 ? named.split(" ")[0] : named;
}

export default function ExperienceApp() {
  const id = useId();
  const { close, isPhone } = useAppFrame();
  const { play } = usePlayground();
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const job = workExperiences[active];

  const select = (index: number) => {
    setActive(index);
    play("click");
  };

  const onKeyDown = (event: KeyboardEvent) => {
    const step =
      event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0;
    if (!step) return;
    event.preventDefault();
    const next =
      (active + step + workExperiences.length) % workExperiences.length;
    select(next);
    tabs.current[next]?.focus();
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col p-2">
      <div
        role="tablist"
        aria-label="Jobs"
        className="relative z-10 -mb-px flex shrink-0 overflow-x-auto pt-0.5 pl-0.5"
        onKeyDown={onKeyDown}
      >
        {workExperiences.map((experience, index) => (
          <button
            key={experience.company}
            ref={(element) => {
              tabs.current[index] = element;
            }}
            type="button"
            role="tab"
            id={`${id}-tab-${index}`}
            aria-selected={index === active}
            aria-controls={`${id}-panel`}
            tabIndex={index === active ? 0 : -1}
            onClick={() => select(index)}
            className={cn(
              "bg-face shrink-0 px-3 text-sm whitespace-nowrap shadow-[inset_1px_1px_var(--color-face-hi),inset_-1px_0_var(--color-face-dk),inset_-2px_0_var(--color-face-lo)]",
              index === active
                ? "relative -mx-0.5 -mt-0.5 h-8 px-4 font-semibold"
                : "mt-0.5 h-7",
            )}
          >
            {shortName(experience.company)}
          </button>
        ))}
      </div>

      <div
        role="tabpanel"
        id={`${id}-panel`}
        aria-labelledby={`${id}-tab-${active}`}
        className="bevel retro-scroll @container min-h-0 flex-1 space-y-5 overflow-y-auto px-4 pt-5 pb-4"
      >
        <div className="flex items-start gap-3">
          <PixelIcon name="briefcase" className="size-10" />
          <div className="min-w-0">
            <h3 className="text-lg leading-tight font-semibold">
              {job.company}
            </h3>
            <p className="text-ink-soft text-sm">
              {job.position} · {job.duration}
            </p>
          </div>
        </div>

        <div className={groupClass}>
          <span className={groupLegendClass}>What I did</span>
          <ul className="space-y-2 text-sm leading-relaxed">
            {job.description.map((line) => (
              <li key={line} className="flex gap-2">
                <span aria-hidden="true" className="text-brand-ink">
                  ■
                </span>
                {line}
              </li>
            ))}
          </ul>
        </div>

        {job.technologies && (
          <div className={groupClass}>
            <span className={groupLegendClass}>Tools</span>
            <ul className="flex flex-wrap gap-1.5">
              {job.technologies.map((technology) => (
                <li key={technology} className={tagClass}>
                  {technology}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {!isPhone && (
        <div className="flex shrink-0 justify-end gap-1.5 pt-2">
          <button type="button" className={buttonClass} onClick={close}>
            OK
          </button>
          <button type="button" className={buttonClass} onClick={close}>
            Cancel
          </button>
          <button type="button" className={buttonClass} disabled>
            Apply
          </button>
        </div>
      )}
    </div>
  );
}
