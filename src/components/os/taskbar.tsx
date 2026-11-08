import { useRef, useState, type ReactNode } from "react";
import { Moon, Power, Sun, Volume2, VolumeX } from "lucide-react";
import AppIcon from "@/components/os/app-icon";
import { getAppMeta, projectAppId, type AppId } from "@/components/os/apps";
import { MenuList, type MenuEntry } from "@/components/os/menu";
import PixelIcon from "@/components/os/pixel-icon";
import LogoMark from "@/components/ui/logo-mark";
import { ELSEWHERE_LINKS, RESUME_URL, SITE_LOCATION } from "@/config/site";
import { projects } from "@/content/portfolio";
import { useOS } from "@/contexts/os-context";
import { usePlayground } from "@/contexts/playground-context";
import { useTheme } from "@/contexts/theme-context";
import { useDismiss } from "@/hooks/use-dismiss";
import { localMood, useLocalTime } from "@/hooks/use-local-time";
import { cn } from "@/lib/utils";

export default function Taskbar() {
  const { windows, focusedKey, focus, minimize } = useOS();

  return (
    <div
      role="toolbar"
      aria-label="Taskbar"
      className="bg-face text-ink absolute inset-x-0 bottom-0 z-[45] flex h-10 items-center gap-1 px-1 shadow-[inset_0_1px_var(--color-face-lt),inset_0_2px_var(--color-face-hi)] select-none"
    >
      <StartMenu />
      <span
        aria-hidden="true"
        className="border-face-lo border-r-face-hi mx-0.5 h-7 border-x"
      />
      <ul className="flex min-w-0 flex-1 gap-1">
        {windows.map((win) => {
          const meta = getAppMeta(win.id);
          const active = win.key === focusedKey && !win.minimized;
          return (
            <li key={win.key} className="max-w-48 min-w-0 flex-1">
              <button
                type="button"
                data-taskbar-button={win.key}
                aria-pressed={active}
                onClick={() => (active ? minimize(win.key) : focus(win.key))}
                className={cn(
                  "bg-face flex h-8 w-full items-center gap-2 px-2 text-left text-sm",
                  active
                    ? "bevel-pressed bg-face-lt font-semibold"
                    : "bevel active:bevel-pressed",
                )}
              >
                <AppIcon icon={meta.icon} className="size-4" />
                <span className="truncate">{meta.title}</span>
              </button>
            </li>
          );
        })}
      </ul>
      <Tray />
    </div>
  );
}

function StartMenu() {
  const os = useOS();
  const { play } = usePlayground();
  const ref = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  useDismiss(ref, open, () => setOpen(false));

  const app = (id: AppId, label: string, icon: ReactNode): MenuEntry => ({
    label,
    icon,
    onSelect: () => os.open(id, { from: buttonRef.current }),
  });

  const entries: MenuEntry[] = [
    app("welcome", "Welcome", <LogoMark className="size-5" />),
    {
      label: "Projects",
      icon: <PixelIcon name="folder" className="size-5" />,
      submenu: [
        app(
          "projects",
          "Open folder",
          <PixelIcon name="folder" className="size-5" />,
        ),
        "separator",
        ...projects.map((project) =>
          app(
            projectAppId(project.slug),
            project.title,
            <PixelIcon
              name={project.category === "Mobile" ? "phone" : "web"}
              className="size-5"
            />,
          ),
        ),
      ],
    },
    app("about", "readme.txt", <PixelIcon name="readme" className="size-5" />),
    app(
      "experience",
      "Work History",
      <PixelIcon name="briefcase" className="size-5" />,
    ),
    app(
      "skills",
      "Task Manager",
      <PixelIcon name="taskmgr" className="size-5" />,
    ),
    app(
      "terminal",
      "Terminal",
      <PixelIcon name="terminal" className="size-5" />,
    ),
    app("mail", "Say halo", <PixelIcon name="mail" className="size-5" />),
    "separator",
    {
      label: "Résumé",
      icon: <PixelIcon name="resume" className="size-5" />,
      href: RESUME_URL,
    },
    {
      label: "Elsewhere",
      icon: <PixelIcon name="web" className="size-5" />,
      submenu: ELSEWHERE_LINKS.filter(({ href }) => href !== RESUME_URL).map(
        ({ label, href }) => ({ label, href }),
      ),
    },
    "separator",
    {
      label: "Plain view",
      icon: <PixelIcon name="readme" className="size-5" />,
      onSelect: () => os.setPlainView(true),
    },
    {
      label: "Shut Down…",
      icon: <Power aria-hidden="true" className="size-4" />,
      onSelect: () =>
        os.showDialog({
          title: "Shut Down RugeOS",
          icon: "question",
          message:
            "Are you sure you want to shut down? Zacky's kopi will go cold.",
          buttons: [
            { label: "Shut down", onClick: os.shutDown },
            { label: "Cancel" },
          ],
        }),
    },
  ];

  return (
    <div ref={ref} className="relative">
      <button
        ref={buttonRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => {
          play("click");
          setOpen((value) => !value);
        }}
        className={cn(
          "bg-face font-pixel flex h-8 items-center gap-1.5 px-2 text-base font-bold",
          open ? "bevel-pressed" : "bevel",
        )}
      >
        <LogoMark className="size-6" />
        Start
      </button>
      {open && (
        <div className="bevel bg-face absolute bottom-full left-0 mb-0.5 flex p-[3px]">
          <div className="title-active flex w-8 items-end justify-center pb-2">
            <span className="font-pixel rotate-180 text-xl font-bold tracking-wider text-white [writing-mode:vertical-rl]">
              Ruge<span className="text-sun">OS</span> 26
            </span>
          </div>
          <MenuList
            entries={entries}
            label="Start"
            className="min-w-56 p-0 shadow-none [&_[role^=menuitem]]:py-2"
            onClose={() => {
              setOpen(false);
              buttonRef.current?.focus();
            }}
          />
        </div>
      )}
    </div>
  );
}

function Tray() {
  const { theme, toggleTheme } = useTheme();
  const { play, soundEnabled, toggleSound } = usePlayground();
  const { showDialog } = useOS();
  const time = useLocalTime();

  return (
    <div className="bevel-thin flex h-8 items-center gap-0.5 px-1.5">
      <TrayButton
        label={soundEnabled ? "Turn sound off" : "Turn sound on"}
        onClick={toggleSound}
      >
        {soundEnabled ? <Volume2 /> : <VolumeX />}
      </TrayButton>
      <TrayButton
        label={
          theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
        }
        onClick={() => {
          play("toggle");
          toggleTheme();
        }}
      >
        {theme === "dark" ? <Sun /> : <Moon />}
      </TrayButton>
      <button
        type="button"
        title={`${SITE_LOCATION.city}, Indonesia (${SITE_LOCATION.timeZoneLabel})`}
        className="ml-1 px-1 text-sm tabular-nums"
        onClick={() =>
          showDialog({
            title: "Date/Time",
            icon: "info",
            message: time
              ? `It's ${time.slice(0, 5)} in ${SITE_LOCATION.city} (${SITE_LOCATION.timeZoneLabel}). Zacky is ${localMood(time)}`
              : "Checking the clock…",
          })
        }
      >
        <span className="sr-only">Local time in {SITE_LOCATION.city}: </span>
        {time ? time.slice(0, 5) : "--:--"}
      </button>
    </div>
  );
}

interface TrayButtonProps {
  label: string;
  onClick: () => void;
  children: ReactNode;
}

function TrayButton({ label, onClick, children }: TrayButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className="hover:bevel active:bevel-pressed grid size-6 place-items-center [&_svg]:size-4"
    >
      {children}
    </button>
  );
}
