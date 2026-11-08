import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { usePlayground } from "@/contexts/playground-context";

const palette: Record<string, string> = {
  o: "#2a1450",
  L: "#c9a8f5",
  D: "#8b5cf6",
  w: "#f7f2ff",
  P: "#ff9fcf",
  K: "#1d1626",
  n: "#1f2a24",
};

// A lilac cat in the spirit of Nekomata Okayu: sleepy eyes, pink cheeks, one
// long tail the colour of her hair, and an onigiri she can't stop eating.
const cat = [
  ".o....o...",
  "oDo..oDo..",
  "oDLooLDo..",
  "oLLLLLLo..",
  "oLKLLKLo..",
  "oPLwwLPo..",
  ".oLLLLo...",
  "oLLLLLLLo.",
  "oLLLLLLLLo",
  "oLwLLwLLLo",
  ".oooooooo.",
];

// Two frames for the tail, swapped back and forth so it swishes.
const tails = [
  [
    "....DD.",
    "....LL.",
    "...LL..",
    "...LL..",
    "....LL.",
    "....LL.",
    "...LL..",
    "LLLL...",
  ],
  [
    "..DD...",
    "..LL...",
    "...LL..",
    "...LL..",
    "..LL...",
    "..LL...",
    "...LL..",
    "LLLL...",
  ],
];

// The onigiri loses a bite each time the cat is fed, then a new one appears.
const onigiri = [
  ["..oo..", ".owwo.", "owwwwo", "onnnno", ".oooo."],
  ["..o...", ".owo..", "owwwo.", "onnnno", ".oooo."],
  ["......", "......", "owo...", "onnno.", ".ooo.."],
  [],
];

const messages = [
  "Mogu mogu~",
  "Mogu mogu mogu~",
  "Gochisousama!",
  "Another onigiri? Mogu mogu~",
];

// The speech bubble's tail, one cell per 3px pixel.
const bubbleTail = ["kwwwk", "kwwk.", "kwk..", "kk...", "k...."];

function Pixels({ rows }: { rows: string[] }) {
  return rows.flatMap((row, y) =>
    [...row].map((key, x) =>
      key === "." ? null : (
        <rect
          key={`${x}-${y}`}
          x={x}
          y={y}
          width="1"
          height="1"
          fill={palette[key]}
        />
      ),
    ),
  );
}

interface WallpaperCatProps {
  x: number;
  ground: number;
  /** The HTML layer above the wallpaper where her speech bubble goes. */
  layer: HTMLElement | null;
}

/**
 * An easter egg sitting on the front hill. The desktop covers the wallpaper,
 * so clicks on empty desktop are hit-tested against the cat instead.
 */
interface Speech {
  id: number;
  text: string;
  x: number;
  y: number;
}

export default function WallpaperCat({ x, ground, layer }: WallpaperCatProps) {
  const ref = useRef<SVGGElement>(null);
  const headRef = useRef<SVGRectElement>(null);
  const fed = useRef(0);
  const hideTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const [bites, setBites] = useState(0);
  const [speech, setSpeech] = useState<Speech | null>(null);
  const { play } = usePlayground();

  useEffect(() => {
    const listen = (event: MouseEvent) => {
      const target = event.target as Element;
      if (
        !target.closest?.("[data-desktop-background]") ||
        target.closest("button, a, [data-window]")
      )
        return;
      const hit = document
        .elementsFromPoint(event.clientX, event.clientY)
        .some((element) => ref.current?.contains(element));
      const head = headRef.current?.getBoundingClientRect();
      if (!hit || !head) return;
      fed.current += 1;
      setBites(fed.current);
      play(fed.current % 4 === 0 ? "meow" : "munch");
      // One bubble that updates in place, however fast the clicks come.
      setSpeech({
        id: fed.current,
        text: messages[(fed.current - 1) % messages.length],
        x: head.left + head.width / 2,
        y: head.top,
      });
      clearTimeout(hideTimer.current);
      hideTimer.current = setTimeout(() => setSpeech(null), 2400);
    };
    const hide = () => setSpeech(null);
    document.addEventListener("click", listen);
    window.addEventListener("resize", hide);
    return () => {
      document.removeEventListener("click", listen);
      window.removeEventListener("resize", hide);
      clearTimeout(hideTimer.current);
    };
  }, [play]);

  return (
    <g
      ref={ref}
      aria-hidden="true"
      className="pointer-events-auto"
      transform={`translate(${x} ${ground - 10})`}
    >
      <rect x="-8" y="-6" width="27" height="18" fill="transparent" />
      <rect ref={headRef} x="1" y="0" width="1" height="1" fill="transparent" />
      <g transform="translate(-7 6)">
        <Pixels rows={onigiri[bites % 4]} />
      </g>
      {tails.map((frame, index) => (
        <g
          key={index}
          transform="translate(8 2)"
          className={
            index ? "animate-swish motion-reduce:hidden" : "animate-swish"
          }
          style={{ animationDelay: index ? "-0.9s" : "0s" }}
        >
          <Pixels rows={frame} />
        </g>
      ))}
      <Pixels rows={cat} />
      {layer &&
        createPortal(
          <AnimatePresence>
            {speech && <SpeechBubble key="bubble" speech={speech} />}
          </AnimatePresence>,
          layer,
        )}
    </g>
  );
}

function SpeechBubble({ speech }: { speech: Speech }) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      className="absolute origin-bottom-left -translate-y-full"
      // Anchored by its tail, so longer lines only grow to the right.
      style={{ left: speech.x - 8, top: speech.y - 2 }}
      initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.4 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.4 }}
      transition={{ type: "spring", stiffness: 520, damping: 26 }}
    >
      <motion.div
        layout={!reduced}
        transition={{ type: "spring", stiffness: 520, damping: 34 }}
        className="pixel-box font-pixel bg-[#fbf8ff] px-2.5 py-1 text-[15px] leading-tight whitespace-nowrap text-[#1d1626]"
      >
        <motion.span
          key={speech.id}
          layout={reduced ? false : "position"}
          className="block"
          initial={reduced ? false : { y: -5, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.16, ease: "easeOut" }}
        >
          {speech.text}
        </motion.span>
      </motion.div>
      <svg
        viewBox="0 0 5 5"
        shapeRendering="crispEdges"
        className="ml-1.5 block size-[15px]"
      >
        {bubbleTail.flatMap((row, y) =>
          [...row].map((key, x) =>
            key === "." ? null : (
              <rect
                key={`${x}-${y}`}
                x={x}
                y={y}
                width="1"
                height="1"
                style={{
                  fill: key === "k" ? "var(--color-bubble-line)" : "#fbf8ff",
                }}
              />
            ),
          ),
        )}
      </svg>
    </motion.div>
  );
}
