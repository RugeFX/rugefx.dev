import {
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent,
  type RefObject,
} from "react";
import { AnimatePresence, motion } from "motion/react";
import AppIcon from "@/components/os/app-icon";
import AppView from "@/components/os/app-view";
import type { AppId, AppMeta } from "@/components/os/apps";
import { MenuList } from "@/components/os/menu";
import Taskbar from "@/components/os/taskbar";
import Wallpaper from "@/components/os/wallpaper";
import Window from "@/components/os/window";
import { RESUME_URL } from "@/config/site";
import { useOS } from "@/contexts/os-context";
import { usePlayground } from "@/contexts/playground-context";
import { useTheme } from "@/contexts/theme-context";
import { useDismiss } from "@/hooks/use-dismiss";
import { cn } from "@/lib/utils";

interface DesktopShortcut {
  name: string;
  label: string;
  icon: AppMeta["icon"];
  app?: AppId;
  href?: string;
}

const shortcuts: DesktopShortcut[] = [
  { name: "about", label: "readme.txt", icon: "readme", app: "about" },
  { name: "projects", label: "Projects", icon: "folder", app: "projects" },
  {
    name: "experience",
    label: "Work History",
    icon: "briefcase",
    app: "experience",
  },
  { name: "skills", label: "Skills.exe", icon: "taskmgr", app: "skills" },
  { name: "terminal", label: "Terminal", icon: "terminal", app: "terminal" },
  { name: "mail", label: "Say halo", icon: "mail", app: "mail" },
  { name: "resume", label: "Résumé.doc", icon: "resume", href: RESUME_URL },
];

// Pinned to the corners, like drives and the bin on an old desktop.
const welcome: DesktopShortcut = {
  name: "welcome",
  label: "Welcome",
  icon: "logo",
  app: "welcome",
};

const trash: DesktopShortcut = {
  name: "trash",
  label: "Recycle Bin",
  icon: "trashFull",
  app: "trash",
};

interface Lasso {
  pointerId: number;
  x0: number;
  y0: number;
  x1: number;
  y1: number;
}

export default function Desktop() {
  const os = useOS();
  const { theme, toggleTheme } = useTheme();
  const { soundEnabled, toggleSound } = usePlayground();
  const areaRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [selected, setSelected] = useState<string[]>([]);
  const [lasso, setLasso] = useState<Lasso | null>(null);
  const [menu, setMenu] = useState<{ x: number; y: number } | null>(null);
  const [arrangement, setArrangement] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  useDismiss(menuRef, menu !== null, () => setMenu(null));

  const activate = (shortcut: DesktopShortcut, from: Element) => {
    if (shortcut.href) {
      window.open(shortcut.href, "_blank", "noopener,noreferrer");
    } else if (shortcut.app) {
      os.open(shortcut.app, { from });
    }
  };

  const local = (event: PointerEvent | MouseEvent) => {
    const rect = areaRef.current!.getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
  };

  const isBackground = (target: EventTarget) =>
    target === areaRef.current ||
    (target as HTMLElement).dataset?.desktopBackground !== undefined;

  // Dragging across the empty desktop draws a selection box over icons.
  const startLasso = (event: PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0 || !isBackground(event.target)) return;
    const { x, y } = local(event);
    event.currentTarget.setPointerCapture(event.pointerId);
    setSelected([]);
    setLasso({ pointerId: event.pointerId, x0: x, y0: y, x1: x, y1: y });
  };

  const moveLasso = (event: PointerEvent<HTMLDivElement>) => {
    if (!lasso || lasso.pointerId !== event.pointerId) return;
    const { x, y } = local(event);
    const next = { ...lasso, x1: x, y1: y };
    setLasso(next);
    const area = areaRef.current!.getBoundingClientRect();
    const box = boxOf(next);
    const hits = [
      ...areaRef.current!.querySelectorAll<HTMLElement>("[data-shortcut]"),
    ].filter((icon) => {
      const rect = icon.getBoundingClientRect();
      return (
        rect.right - area.left > box.left &&
        rect.left - area.left < box.left + box.width &&
        rect.bottom - area.top > box.top &&
        rect.top - area.top < box.top + box.height
      );
    });
    setSelected(hits.map((icon) => icon.dataset.shortcut!));
  };

  const endLasso = () => setLasso(null);

  return (
    <div
      className="fixed inset-0 overflow-hidden select-none"
      // A reboot replays the start-up cascade behind the boot screen.
      style={
        os.bootCount > 0
          ? ({ "--boot-delay": "1.85s" } as CSSProperties)
          : undefined
      }
    >
      <Wallpaper layout="desktop" />
      <div
        ref={areaRef}
        data-desktop-background=""
        className="absolute inset-x-0 top-0 bottom-10 touch-none"
        onPointerDown={startLasso}
        onPointerMove={moveLasso}
        onPointerUp={endLasso}
        onPointerCancel={endLasso}
        onContextMenu={(event) => {
          if (!isBackground(event.target)) return;
          event.preventDefault();
          const { x, y } = local(event.nativeEvent);
          const area = areaRef.current!;
          setMenu({
            x: Math.min(x, area.clientWidth - 230),
            y: Math.min(y, area.clientHeight - 300),
          });
        }}
      >
        <ul
          key={arrangement}
          data-desktop-background=""
          aria-label="Desktop"
          className={cn(
            "grid h-full w-fit grid-flow-col grid-rows-[repeat(auto-fill,84px)] gap-x-1 p-2 transition-opacity duration-150",
            refreshing && "opacity-0",
          )}
        >
          {shortcuts.map((shortcut) => (
            <li key={shortcut.name} data-desktop-background="">
              <DesktopIcon
                shortcut={shortcut}
                bounds={areaRef}
                selected={selected.includes(shortcut.name)}
                onSelect={(additive) =>
                  setSelected((current) =>
                    additive
                      ? current.includes(shortcut.name)
                        ? current.filter((name) => name !== shortcut.name)
                        : [...current, shortcut.name]
                      : [shortcut.name],
                  )
                }
                onActivate={(from) => activate(shortcut, from)}
              />
            </li>
          ))}
        </ul>
        {[
          { shortcut: welcome, position: "top-2 right-3" },
          { shortcut: trash, position: "right-3 bottom-3" },
        ].map(({ shortcut, position }) => (
          <div
            key={`${shortcut.name}-${arrangement}`}
            className={cn(
              "absolute transition-opacity duration-150",
              position,
              refreshing && "opacity-0",
            )}
          >
            <DesktopIcon
              shortcut={shortcut}
              bounds={areaRef}
              selected={selected.includes(shortcut.name)}
              onSelect={() => setSelected([shortcut.name])}
              onActivate={(from) => activate(shortcut, from)}
            />
          </div>
        ))}

        <AnimatePresence>
          {os.windows.map((win) => (
            <Window
              key={win.key}
              win={win}
              zIndex={10 + os.stack.indexOf(win.key)}
              focused={win.key === os.focusedKey}
            >
              <AppView id={win.id} />
            </Window>
          ))}
        </AnimatePresence>

        {lasso && (
          <div
            aria-hidden="true"
            className="border-on-brand bg-brand/20 pointer-events-none absolute z-[5] border border-dotted"
            style={boxOf(lasso)}
          />
        )}

        {menu && (
          <div
            ref={menuRef}
            className="absolute z-[44]"
            style={{ left: menu.x, top: menu.y }}
          >
            <MenuList
              label="Desktop"
              onClose={() => setMenu(null)}
              entries={[
                {
                  label: "Arrange Icons",
                  onSelect: () => setArrangement((value) => value + 1),
                },
                {
                  label: "Refresh",
                  onSelect: () => {
                    setRefreshing(true);
                    window.setTimeout(() => setRefreshing(false), 180);
                  },
                },
                "separator",
                {
                  label: "Open Terminal",
                  onSelect: () => os.open("terminal"),
                },
                { label: "New Message", onSelect: () => os.open("mail") },
                "separator",
                {
                  label: "Dark mode",
                  checked: theme === "dark",
                  onSelect: toggleTheme,
                },
                {
                  label: "Sound effects",
                  checked: soundEnabled,
                  onSelect: toggleSound,
                },
                "separator",
                {
                  label: "About RugeOS…",
                  onSelect: () =>
                    os.showDialog({
                      title: "About RugeOS",
                      icon: "info",
                      message:
                        "RugeOS 26.11, Bekasi edition. Built by Ahmad Zacky with React, TanStack Start, Tailwind CSS and Motion. Runs on kopi.",
                    }),
                },
              ]}
            />
          </div>
        )}
      </div>
      <Taskbar />
    </div>
  );
}

function boxOf({ x0, y0, x1, y1 }: Lasso) {
  return {
    left: Math.min(x0, x1),
    top: Math.min(y0, y1),
    width: Math.abs(x1 - x0),
    height: Math.abs(y1 - y0),
  };
}

interface DesktopIconProps {
  shortcut: DesktopShortcut;
  bounds: RefObject<HTMLDivElement | null>;
  selected: boolean;
  onSelect: (additive: boolean) => void;
  onActivate: (from: Element) => void;
}

function DesktopIcon({
  shortcut,
  bounds,
  selected,
  onSelect,
  onActivate,
}: DesktopIconProps) {
  const dragged = useRef(false);
  const pointerType = useRef("mouse");

  return (
    <motion.button
      type="button"
      data-shortcut={shortcut.name}
      drag
      dragMomentum={false}
      dragElastic={0}
      dragConstraints={bounds}
      onPointerDown={(event) => {
        dragged.current = false;
        pointerType.current = event.pointerType;
      }}
      onDragStart={() => {
        dragged.current = true;
      }}
      onClick={(event) => {
        if (dragged.current) return;
        onSelect(event.metaKey || event.ctrlKey);
        // Touch screens open on a single tap.
        if (pointerType.current !== "mouse") onActivate(event.currentTarget);
      }}
      onDoubleClick={(event) => onActivate(event.currentTarget)}
      onKeyDown={(event) => {
        if (event.key === "Enter") {
          event.preventDefault();
          onActivate(event.currentTarget);
        }
      }}
      className="group flex w-[92px] touch-none flex-col items-center gap-1 p-1 outline-none"
    >
      <span className={cn("p-1", selected && "bg-brand/35")}>
        <AppIcon
          icon={shortcut.icon}
          className="size-12 drop-shadow-[2px_2px_0_rgb(20_8_40/45%)]"
        />
      </span>
      <span
        className={cn(
          "px-1 text-center text-[13px] leading-tight text-white [text-shadow:1px_1px_0_#14082a] group-focus-visible:outline group-focus-visible:outline-1 group-focus-visible:outline-dotted",
          selected && "bg-brand [text-shadow:none]",
        )}
      >
        {shortcut.label}
      </span>
    </motion.button>
  );
}
