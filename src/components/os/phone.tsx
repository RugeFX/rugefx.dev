import { useMemo, type CSSProperties } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ChevronLeft } from "lucide-react";
import AppIcon from "@/components/os/app-icon";
import AppView from "@/components/os/app-view";
import { getAppMeta, type AppId, type AppMeta } from "@/components/os/apps";
import { buttonClass } from "@/components/os/retro";
import Wallpaper from "@/components/os/wallpaper";
import { RESUME_URL, SITE_LOCATION } from "@/config/site";
import { intro } from "@/content/about";
import { AppFrameContext } from "@/contexts/app-frame-context";
import { useOS, type Point } from "@/contexts/os-context";
import { useCopyEmail } from "@/hooks/use-copy-email";
import { useLocalTime } from "@/hooks/use-local-time";
import { cn } from "@/lib/utils";

interface PhoneApp {
  label: string;
  icon: AppMeta["icon"];
  app?: AppId;
  href?: string;
}

const homeApps: PhoneApp[] = [
  { label: "Projects", icon: "folder", app: "projects" },
  { label: "readme", icon: "readme", app: "about" },
  { label: "Work", icon: "briefcase", app: "experience" },
  { label: "Skills", icon: "taskmgr", app: "skills" },
  { label: "Terminal", icon: "terminal", app: "terminal" },
  { label: "Welcome", icon: "logo", app: "welcome" },
  { label: "Recycle Bin", icon: "trashFull", app: "trash" },
];

const dockApps: PhoneApp[] = [
  { label: "Projects", icon: "folder", app: "projects" },
  { label: "Mail", icon: "mail", app: "mail" },
  { label: "Terminal", icon: "terminal", app: "terminal" },
  { label: "Résumé", icon: "resume", href: RESUME_URL },
];

export default function Phone() {
  const os = useOS();
  const copyEmail = useCopyEmail();

  return (
    <div
      className="fixed inset-0 flex flex-col overflow-hidden text-white select-none"
      style={
        os.bootCount > 0
          ? ({ "--boot-delay": "1.85s" } as CSSProperties)
          : undefined
      }
    >
      <Wallpaper layout="phone" />
      <StatusBar />

      <div
        data-desktop-background=""
        className="retro-scroll relative flex-1 overflow-y-auto px-4 pt-3 pb-6"
      >
        <section
          aria-label="Welcome"
          className="bevel-window bg-face text-ink animate-window-in p-[3px]"
          style={{ animationDelay: "var(--boot-delay)" }}
        >
          <div className="title-active font-pixel flex h-7 items-center gap-2 px-2 text-[15px] text-white">
            <AppIcon icon="logo" className="size-4" />
            Welcome to RugeOS
          </div>
          <div className="px-4 pt-4 pb-5">
            <p className="font-pixel text-brand-ink text-lg">Halo! I&apos;m</p>
            <h2 className="font-pixel text-[40px] leading-none font-bold">
              Ahmad Zacky
            </h2>
            <p className="text-ink-soft mt-3 text-[15px] leading-relaxed">
              {intro}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
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
              <button
                type="button"
                className={buttonClass}
                onClick={() => os.setPlainView(true)}
              >
                Plain view
              </button>
            </div>
          </div>
        </section>

        <ul
          data-desktop-background=""
          className="mt-7 grid grid-cols-4 gap-x-2 gap-y-5"
        >
          {homeApps.map((app) => (
            <li key={app.label}>
              <PhoneIcon app={app} />
            </li>
          ))}
        </ul>
      </div>

      <nav
        aria-label="Dock"
        className="bevel bg-face/90 relative mx-3 mb-3 grid grid-cols-4 gap-2 px-2 py-2"
      >
        {dockApps.map((app) => (
          <PhoneIcon key={app.label} app={app} docked />
        ))}
      </nav>

      {/* A sheet that is open on load (a project URL) is prerendered as is. */}
      <AnimatePresence initial={false}>
        {os.phoneApp && (
          <PhoneSheet
            key={os.phoneApp}
            id={os.phoneApp}
            origin={os.phoneOrigin}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function StatusBar() {
  const time = useLocalTime();

  return (
    <div className="font-pixel relative flex h-8 shrink-0 items-center justify-between px-4 text-sm [text-shadow:1px_1px_0_#14082a]">
      <span>
        <span className="sr-only">Local time in {SITE_LOCATION.city}: </span>
        {time ? time.slice(0, 5) : "--:--"} {SITE_LOCATION.timeZoneLabel}
      </span>
      <span aria-hidden="true">RugeOS</span>
      <svg
        viewBox="0 0 26 9"
        aria-hidden="true"
        shapeRendering="crispEdges"
        className="h-[11px] fill-current"
      >
        <path d="M0 7h2v2H0zM3 5h2v4H3zM6 3h2v6H6zM9 0h2v9H9zM14 1h10v1H14zm0 6h10v1H14zM13 2h1v5h-1zm11 0h1v5h-1zm1 2h1v2h-1zM15 3h6v3h-6z" />
      </svg>
    </div>
  );
}

interface PhoneIconProps {
  app: PhoneApp;
  docked?: boolean;
}

function PhoneIcon({ app, docked }: PhoneIconProps) {
  const { open } = useOS();
  const tile = (
    <>
      <span className="bevel bg-face grid size-16 place-items-center">
        <AppIcon icon={app.icon} className="size-12" />
      </span>
      {!docked && (
        <span className="text-xs [text-shadow:1px_1px_0_#14082a]">
          {app.label}
        </span>
      )}
    </>
  );
  const className = "flex w-full flex-col items-center gap-1.5 active:scale-95";

  return app.href ? (
    <a
      href={app.href}
      target="_blank"
      rel="noreferrer"
      aria-label={docked ? app.label : undefined}
      className={className}
    >
      {tile}
    </a>
  ) : (
    <button
      type="button"
      aria-label={docked ? app.label : undefined}
      className={className}
      onClick={(event) => open(app.app!, { from: event.currentTarget })}
    >
      {tile}
    </button>
  );
}

interface PhoneSheetProps {
  id: AppId;
  origin: Point | null;
}

function PhoneSheet({ id, origin }: PhoneSheetProps) {
  const { closePhoneApp } = useOS();
  const reduced = useReducedMotion();
  const meta = getAppMeta(id);
  const frame = useMemo(
    () => ({ close: closePhoneApp, isPhone: true }),
    [closePhoneApp],
  );
  const transformOrigin = origin ? `${origin.x}px ${origin.y}px` : "50% 100%";

  return (
    <motion.section
      aria-label={meta.title}
      className="bg-face text-ink fixed inset-0 z-30 flex flex-col"
      style={{ transformOrigin }}
      initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.2 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.2 }}
      transition={{ type: "spring", stiffness: 420, damping: 38 }}
      onKeyDown={(event) => {
        if (event.key === "Escape") closePhoneApp();
      }}
    >
      <div className="title-active flex h-12 shrink-0 items-center gap-2 px-2 text-white">
        <button
          type="button"
          onClick={closePhoneApp}
          className="bevel active:bevel-pressed bg-face text-ink flex h-8 items-center gap-0.5 pr-2.5 pl-1 text-sm"
        >
          <ChevronLeft aria-hidden="true" className="size-4" />
          Home
        </button>
        <AppIcon icon={meta.icon} className="ml-1 size-5" />
        <h2 className="font-pixel min-w-0 flex-1 truncate text-base tracking-wide">
          {meta.title}
        </h2>
      </div>
      <AppFrameContext.Provider value={frame}>
        <div className="relative flex min-h-0 flex-1 flex-col p-[3px]">
          <AppView id={id} />
        </div>
      </AppFrameContext.Provider>
      <button
        type="button"
        aria-label="Back to the home screen"
        onClick={closePhoneApp}
        className="grid h-7 shrink-0 place-items-center"
      >
        <span className="bg-ink/50 h-1.5 w-32" />
      </button>
    </motion.section>
  );
}
