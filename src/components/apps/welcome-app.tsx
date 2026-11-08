import { useState } from "react";
import type { AppId } from "@/components/os/apps";
import PixelIcon, { type PixelIconName } from "@/components/os/pixel-icon";
import { buttonClass } from "@/components/os/retro";
import LogoMark from "@/components/ui/logo-mark";
import { RESUME_URL } from "@/config/site";
import { intro } from "@/content/about";
import { useOS } from "@/contexts/os-context";
import { useCopyEmail } from "@/hooks/use-copy-email";
import { cn } from "@/lib/utils";

const destinations: { app: AppId; label: string; icon: PixelIconName }[] = [
  { app: "projects", label: "See my projects", icon: "folder" },
  { app: "about", label: "Read about me", icon: "readme" },
  { app: "experience", label: "Work history", icon: "briefcase" },
  { app: "skills", label: "What I use", icon: "taskmgr" },
  { app: "terminal", label: "Open a terminal", icon: "terminal" },
];

const tips = [
  "Double-click the icons on the desktop to open them.",
  "Drag windows around by their title bars, and resize them from the corner.",
  "Right-click the desktop for a few extra options.",
  "Type `sudo hire-me` in the terminal. Go on.",
  "Turn on sound effects from the speaker in the corner.",
  "There's a cheat code: ↑ ↑ ↓ ↓ ← → ← → B A",
  "In a hurry? Start → Plain view puts everything on one page.",
];

export default function WelcomeApp() {
  const os = useOS();
  const copyEmail = useCopyEmail();
  const [tip, setTip] = useState(0);

  return (
    <div className="@container flex min-h-0 flex-1 flex-col">
      <div className="retro-scroll flex min-h-0 flex-1 flex-col overflow-y-auto">
        <div className="title-active flex items-center gap-4 px-5 py-5 text-white @lg:px-7">
          <LogoMark className="size-16 shrink-0 @lg:size-20" />
          <div className="min-w-0">
            <p className="font-pixel text-lg text-white/80">Halo! I&apos;m</p>
            <p className="font-pixel text-4xl leading-none font-bold @lg:text-5xl">
              Ahmad Zacky
            </p>
          </div>
        </div>

        <div className="grid flex-1 gap-5 p-5 @lg:grid-cols-[minmax(0,1fr)_200px] @lg:px-7">
          <div>
            <p className="text-ink-soft text-[15px] leading-relaxed">{intro}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              <button
                type="button"
                className={cn(buttonClass, "font-semibold")}
                onClick={(event) => void copyEmail(event.currentTarget)}
              >
                Say halo
              </button>
              <a
                className={buttonClass}
                href={RESUME_URL}
                target="_blank"
                rel="noreferrer"
              >
                Résumé ↗
              </a>
            </div>

            <div className="bevel-in bg-balloon mt-6 flex gap-3 p-3">
              <PixelIcon name="info" className="mt-0.5 size-6" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold">Did you know…</p>
                <p className="mt-1 min-h-10 text-sm leading-snug">
                  {tips[tip]}
                </p>
              </div>
            </div>
            <div className="mt-2 flex justify-end">
              <button
                type="button"
                className={buttonClass}
                onClick={() => setTip((tip + 1) % tips.length)}
              >
                Next tip
              </button>
            </div>
          </div>

          <nav aria-label="Start here">
            <p className="text-ink-muted mb-2 text-xs font-semibold tracking-wide uppercase">
              Start here
            </p>
            <ul className="grid gap-1.5">
              {destinations.map((destination) => (
                <li key={destination.app}>
                  <button
                    type="button"
                    className={cn(
                      buttonClass,
                      "w-full justify-start px-2 text-left",
                    )}
                    onClick={(event) =>
                      os.open(destination.app, { from: event.currentTarget })
                    }
                  >
                    <PixelIcon name={destination.icon} className="size-6" />
                    {destination.label}
                  </button>
                </li>
              ))}
            </ul>
            <button
              type="button"
              className="text-brand-ink mt-3 text-sm underline underline-offset-2"
              onClick={() => os.setPlainView(true)}
            >
              In a hurry? Plain view
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
}
