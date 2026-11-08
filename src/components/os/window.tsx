import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent,
  type ReactNode,
} from "react";
import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
} from "motion/react";
import AppIcon from "@/components/os/app-icon";
import { getAppMeta } from "@/components/os/apps";
import { AppFrameContext } from "@/contexts/app-frame-context";
import { useOS, type OSWindow } from "@/contexts/os-context";
import { cn } from "@/lib/utils";

interface WindowProps {
  win: OSWindow;
  zIndex: number;
  focused: boolean;
  children: ReactNode;
}

interface Gesture {
  pointerId: number;
  kind: "move" | "resize";
  /** Started on a maximised title bar: restores once the pointer moves. */
  restore?: boolean;
  startX: number;
  startY: number;
  left: number;
  top: number;
  width: number;
  height: number;
}

const minWidth = 300;
const minHeight = 200;
const spring = { type: "spring", stiffness: 420, damping: 34 } as const;

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), Math.max(min, max));

export default function Window({
  win,
  zIndex,
  focused,
  children,
}: WindowProps) {
  const { close, focus, minimize } = useOS();
  const reduced = useReducedMotion();
  const meta = getAppMeta(win.id);
  const ref = useRef<HTMLElement>(null);
  const gesture = useRef<Gesture | null>(null);
  const opened = useRef(false);
  const [placed, setPlaced] = useState(false);
  const [maximized, setMaximized] = useState(false);
  const [settling, setSettling] = useState(false);
  const left = useMotionValue(0);
  const top = useMotionValue(0);
  const width = useMotionValue(0);
  const height = useMotionValue(0);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const scale = useMotionValue(1);
  const opacity = useMotionValue(1);

  // Windows start at CSS positions that suit any screen. The first drag,
  // resize or maximise pins them to pixels.
  const place = useCallback(() => {
    const element = ref.current;
    if (!element || placed) return;
    left.set(element.offsetLeft);
    top.set(element.offsetTop);
    width.set(element.offsetWidth);
    height.set(element.offsetHeight);
    setPlaced(true);
  }, [height, left, placed, top, width]);

  // Grow out of whatever opened the window.
  useLayoutEffect(() => {
    const element = ref.current;
    if (opened.current || !element) return;
    opened.current = true;
    if (!win.origin || reduced) return;
    const rect = element.getBoundingClientRect();
    x.set(win.origin.x - (rect.left + rect.width / 2));
    y.set(win.origin.y - (rect.top + rect.height / 2));
    scale.set(0.12);
    opacity.set(0);
    animate(x, 0, spring);
    animate(y, 0, spring);
    animate(scale, 1, spring);
    animate(opacity, 1, { duration: 0.12 });
  }, [opacity, reduced, scale, win.origin, x, y]);

  // Minimising shrinks the window into its taskbar button and back.
  const wasMinimized = useRef(win.minimized);
  useEffect(() => {
    if (wasMinimized.current === win.minimized) return;
    wasMinimized.current = win.minimized;
    const element = ref.current;
    const button = document.querySelector(`[data-taskbar-button="${win.key}"]`);
    const options = reduced ? { duration: 0 } : spring;
    if (win.minimized && element && button) {
      const from = element.getBoundingClientRect();
      const to = button.getBoundingClientRect();
      animate(
        x,
        to.left + to.width / 2 - (from.left + from.width / 2),
        options,
      );
      animate(
        y,
        to.top + to.height / 2 - (from.top + from.height / 2),
        options,
      );
      animate(scale, 0.08, options);
      animate(opacity, 0, { duration: reduced ? 0 : 0.2 });
    } else {
      animate(x, 0, options);
      animate(y, 0, options);
      animate(scale, 1, options);
      animate(opacity, 1, { duration: reduced ? 0 : 0.12 });
    }
  }, [opacity, reduced, scale, win.key, win.minimized, x, y]);

  const toggleMaximize = () => {
    place();
    setSettling(true);
    setMaximized((value) => !value);
    window.setTimeout(() => setSettling(false), 240);
  };

  const startGesture = (
    event: PointerEvent<HTMLElement>,
    kind: Gesture["kind"],
  ) => {
    const element = ref.current;
    if (event.button !== 0 || !element) return;
    if (maximized && kind === "resize") return;
    if (kind === "move" && (event.target as Element).closest("button")) return;
    place();
    event.currentTarget.setPointerCapture(event.pointerId);
    gesture.current = {
      pointerId: event.pointerId,
      kind,
      restore: maximized,
      startX: event.clientX,
      startY: event.clientY,
      left: element.offsetLeft,
      top: element.offsetTop,
      width: element.offsetWidth,
      height: element.offsetHeight,
    };
  };

  const moveGesture = (event: PointerEvent<HTMLElement>) => {
    const current = gesture.current;
    const desktop = ref.current?.parentElement;
    if (!current || current.pointerId !== event.pointerId || !desktop) return;
    const dx = event.clientX - current.startX;
    const dy = event.clientY - current.startY;
    if (current.restore) {
      if (Math.hypot(dx, dy) < 6) return;
      // Like dragging a maximised window on Windows: it drops back to its
      // old size under the pointer, at the same spot along the title bar.
      const area = desktop.getBoundingClientRect();
      const restoredWidth = width.get();
      const along = (current.startX - area.left) / area.width;
      const grabY = current.startY - area.top;
      const nextLeft = clamp(
        event.clientX - area.left - along * restoredWidth,
        96 - restoredWidth,
        desktop.clientWidth - 96,
      );
      const nextTop = clamp(
        event.clientY - area.top - grabY,
        0,
        desktop.clientHeight - 32,
      );
      left.set(nextLeft);
      top.set(nextTop);
      setMaximized(false);
      gesture.current = {
        ...current,
        restore: false,
        startX: event.clientX,
        startY: event.clientY,
        left: nextLeft,
        top: nextTop,
        width: restoredWidth,
        height: height.get(),
      };
      return;
    }
    if (current.kind === "move") {
      // Keep enough of the title bar on screen to grab it again.
      left.set(
        clamp(current.left + dx, 96 - current.width, desktop.clientWidth - 96),
      );
      top.set(clamp(current.top + dy, 0, desktop.clientHeight - 32));
    } else {
      width.set(
        clamp(current.width + dx, minWidth, desktop.clientWidth - current.left),
      );
      height.set(
        clamp(
          current.height + dy,
          minHeight,
          desktop.clientHeight - current.top,
        ),
      );
    }
  };

  const endGesture = (event: PointerEvent<HTMLElement>) => {
    if (gesture.current?.pointerId === event.pointerId) gesture.current = null;
  };

  const frame = useMemo(
    () => ({ close: () => close(win.key), windowKey: win.key, isPhone: false }),
    [close, win.key],
  );

  const geometry = maximized
    ? { left: 0, top: 0, width: "100%", height: "100%" }
    : placed
      ? { left, top, width, height }
      : meta.frame;

  return (
    <motion.section
      ref={ref}
      aria-label={meta.title}
      aria-hidden={win.minimized || undefined}
      inert={win.minimized}
      data-window={win.id}
      className={cn(
        "absolute",
        settling && "transition-[left,top,width,height] duration-200 ease-out",
        win.minimized && "pointer-events-none",
      )}
      style={{ ...geometry, zIndex, x, y, scale, opacity }}
      exit={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.92, y: 8 }}
      transition={{ duration: 0.12 }}
      onPointerDownCapture={() => {
        if (!focused) focus(win.key);
      }}
    >
      <div
        className={cn(
          "bevel-window bg-face flex h-full flex-col p-[3px]",
          win.bootIndex !== null && "animate-window-in",
        )}
        style={
          win.bootIndex !== null
            ? {
                animationDelay: `calc(var(--boot-delay) + ${win.bootIndex * 150}ms)`,
              }
            : undefined
        }
      >
        <div
          className={cn(
            "flex h-7 shrink-0 touch-none items-center gap-1.5 pr-0.5 pl-1.5 select-none",
            focused
              ? "title-active text-white"
              : "title-inactive text-white/85",
          )}
          onPointerDown={(event) => startGesture(event, "move")}
          onPointerMove={moveGesture}
          onPointerUp={endGesture}
          onPointerCancel={endGesture}
          onDoubleClick={(event) => {
            if (!(event.target as Element).closest("button")) toggleMaximize();
          }}
        >
          <AppIcon icon={meta.icon} className="size-4" />
          <h2 className="font-pixel min-w-0 flex-1 truncate text-[15px] leading-none tracking-wide">
            {meta.title}
          </h2>
          <TitleButton label="Minimize" onClick={() => minimize(win.key)}>
            <path d="M2 7h5v2H2z" />
          </TitleButton>
          <TitleButton
            label={maximized ? "Restore" : "Maximize"}
            onClick={toggleMaximize}
          >
            {maximized ? (
              <path
                fillRule="evenodd"
                d="M3 0h6v6H7v3H0V3h3zm1 2v1h3v2h1V2zM1 5v3h5V5z"
              />
            ) : (
              <path fillRule="evenodd" d="M0 0h9v9H0zm1 2v6h7V2z" />
            )}
          </TitleButton>
          <TitleButton label="Close" onClick={() => close(win.key)} spaced>
            <path d="M0 0h2l2.5 3L7 0h2L5.5 4.5 9 9H7L4.5 6 2 9H0l3.5-4.5z" />
          </TitleButton>
        </div>

        <AppFrameContext.Provider value={frame}>
          <div className="relative mt-0.5 flex min-h-0 flex-1 flex-col">
            {children}
          </div>
        </AppFrameContext.Provider>
      </div>

      {!maximized && (
        <div
          aria-hidden="true"
          className="absolute right-1 bottom-1 z-10 size-4 cursor-nwse-resize touch-none"
          onPointerDown={(event) => startGesture(event, "resize")}
          onPointerMove={moveGesture}
          onPointerUp={endGesture}
          onPointerCancel={endGesture}
        >
          <svg
            viewBox="0 0 12 12"
            className="size-full"
            shapeRendering="crispEdges"
          >
            <path
              className="fill-face-hi"
              d="M10 1h1v1h-1zM7 4h1v1H7zm3 0h1v1h-1zM4 7h1v1H4zm3 0h1v1H7zm3 0h1v1h-1z"
            />
            <path
              className="fill-face-lo"
              d="M11 1h1v2h-1zM8 4h1v2H8zm3 0h1v2h-1zM5 7h1v2H5zm3 0h1v2H8zm3 0h1v2h-1z"
            />
          </svg>
        </div>
      )}
    </motion.section>
  );
}

interface TitleButtonProps {
  label: string;
  onClick: () => void;
  spaced?: boolean;
  children: ReactNode;
}

function TitleButton({ label, onClick, spaced, children }: TitleButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className={cn(
        "bevel active:bevel-pressed bg-face text-ink grid h-[18px] w-5 shrink-0 place-items-center",
        spaced && "ml-0.5",
      )}
    >
      <svg viewBox="0 0 9 9" className="size-[9px] fill-current">
        {children}
      </svg>
    </button>
  );
}
