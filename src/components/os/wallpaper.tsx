import { useId, useState } from "react";
import WallpaperCat from "@/components/os/wallpaper-cat";
import { cn } from "@/lib/utils";

// A 240×135 pixel scene, scaled up so every unit is one chunky pixel.
const width = 240;
const height = 135;

const duskSky = [
  "#2a0f5c",
  "#3b1580",
  "#4c1d95",
  "#6d28d9",
  "#8b5cf6",
  "#ab7af7",
  "#cf98ef",
  "#eda4d6",
  "#ffb3a6",
];
const nightSky = [
  "#07030f",
  "#0b0618",
  "#110a23",
  "#180e2f",
  "#20133c",
  "#2a184b",
  "#361e5c",
  "#43246d",
  "#512a7d",
];

const hills = [
  {
    base: 101,
    amplitude: 9,
    seed: 1,
    className: "fill-[#8452d6] dark:fill-[#2a1450]",
  },
  {
    base: 112,
    amplitude: 8,
    seed: 2,
    className: "fill-[#5b2bb0] dark:fill-[#1b0c36]",
  },
  {
    base: 124,
    amplitude: 5,
    seed: 3,
    className: "fill-[#33136e] dark:fill-[#0e0620]",
  },
];

// A tiny seeded random generator keeps the prerendered scene stable.
function random(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hillHeight(x: number, base: number, amplitude: number, seed: number) {
  const wave =
    Math.sin(x / (19 + seed * 3) + seed) * 0.6 +
    Math.sin(x / (7 + seed) + seed * 2) * 0.25 +
    Math.sin(x / 43 + seed * 5) * 0.5;
  return Math.round(base - amplitude * wave);
}

function hillPath(base: number, amplitude: number, seed: number) {
  let d = `M0 ${height}`;
  for (let x = 0; x < width; x += 2) {
    d += `V${hillHeight(x, base, amplitude, seed)}H${x + 2}`;
  }
  return `${d}V${height}Z`;
}

/** A filled pixel circle as one path, one run per row. */
function discRows(cx: number, cy: number, radius: number) {
  const rows: { y: number; x: number; w: number }[] = [];
  for (let y = -radius; y < radius; y += 1) {
    const half = Math.round(Math.sqrt(radius * radius - (y + 0.5) ** 2));
    rows.push({ y: cy + y, x: cx - half, w: half * 2 });
  }
  return rows;
}

const sunColors = ["#ffe58a", "#ffd25a", "#ffbe48", "#ffa04c", "#ff8a55"];
const sun = discRows(120, 90, 24)
  // Synthwave slits cut through the lower half of the sun.
  .filter(({ y }) => ![92, 96, 97, 101, 102, 106, 107, 108].includes(y))
  .map((row) => ({
    ...row,
    color: sunColors[Math.min(4, Math.floor(((row.y - 66) / 48) * 5))],
  }));
const moon = discRows(176, 30, 9);

const stars = (() => {
  const next = random(7);
  return Array.from({ length: 46 }, (_, index) => ({
    x: Math.floor(next() * width),
    y: Math.floor(next() * 64),
    twinkle: index % 3 === 0,
    delay: Math.round(next() * 30) / 10,
    dusk: index < 14,
  }));
})();

const clouds = [
  { x: 20, y: 26, scale: 1, duration: 120, delay: -10 },
  { x: 90, y: 44, scale: 0.7, duration: 150, delay: -80 },
  { x: 160, y: 18, scale: 1.2, duration: 110, delay: -50 },
];

const cloudPath = "M6 0h10v2h4v2h6v4H0V4h2V2h4z";

const tower = { x: 196, ground: hillHeight(196, 124, 5, 3) };
const house = { x: 44, ground: hillHeight(44, 112, 8, 2) };
// The cat sits on the lowest point under her, so she never floats. Phones
// crop to the middle of the scene and cover the front hill with the dock, so
// there she sits further back.
function catSpot(x: number, hill: (typeof hills)[number]) {
  const ground = Math.max(
    ...[0, 2, 4, 6, 8].map((dx) =>
      hillHeight(x + dx, hill.base, hill.amplitude, hill.seed),
    ),
  );
  return { x, ground };
}

const catSpots = {
  desktop: catSpot(140, hills[2]),
  phone: catSpot(115, hills[1]),
};

interface WallpaperProps {
  className?: string;
  layout: keyof typeof catSpots;
}

export default function Wallpaper({ className, layout }: WallpaperProps) {
  const id = useId();
  const [layer, setLayer] = useState<HTMLDivElement | null>(null);

  return (
    <>
      <svg
        aria-hidden="true"
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="xMidYMax slice"
        shapeRendering="crispEdges"
        className={cn(
          "pointer-events-none absolute inset-0 size-full",
          className,
        )}
      >
        <defs>
          {[...duskSky, ...nightSky].map((color, index) => (
            <pattern
              key={`${color}-${index}`}
              id={`${id}-dither-${index}`}
              width="2"
              height="2"
              patternUnits="userSpaceOnUse"
            >
              <rect width="1" height="1" fill={color} />
              <rect x="1" y="1" width="1" height="1" fill={color} />
            </pattern>
          ))}
        </defs>

        {[duskSky, nightSky].map((sky, skyIndex) => (
          <g
            key={skyIndex}
            className={skyIndex ? "hidden dark:inline" : "dark:hidden"}
          >
            {sky.map((color, index) => (
              <rect
                key={color}
                y={index * 11 - 1}
                width={width}
                height={index === sky.length - 1 ? height : 12}
                fill={color}
              />
            ))}
            {/* Checkered rows soften each band into the next, like old dithering. */}
            {sky.slice(1).map((color, index) => (
              <rect
                key={color}
                y={(index + 1) * 11 - 3}
                width={width}
                height="2"
                fill={`url(#${id}-dither-${skyIndex * duskSky.length + index + 1})`}
              />
            ))}
          </g>
        ))}

        {stars.map((star, index) => (
          <rect
            key={index}
            x={star.x}
            y={star.y}
            width="1"
            height="1"
            fill="#fff"
            opacity={star.twinkle ? 0.9 : 0.6}
            className={cn(
              !star.dusk && "hidden dark:inline",
              star.twinkle && "animate-twinkle",
            )}
            style={
              star.twinkle ? { animationDelay: `${star.delay}s` } : undefined
            }
          />
        ))}

        <g className="dark:hidden">
          {sun.map((row) => (
            <rect
              key={row.y}
              x={row.x}
              y={row.y}
              width={row.w}
              height="1"
              fill={row.color}
            />
          ))}
        </g>
        <g className="hidden dark:inline">
          {moon.map((row) => (
            <rect
              key={row.y}
              x={row.x}
              y={row.y}
              width={row.w}
              height="1"
              fill="#f3ecff"
            />
          ))}
          <path
            fill="#d6c6f7"
            d="M172 25h3v2h-3zM178 31h3v3h-3zM173 34h2v2h-2zM180 25h1v1h-1z"
          />
        </g>

        {clouds.map((cloud, index) => (
          <g
            key={index}
            className="animate-drift"
            style={{
              animationDuration: `${cloud.duration}s`,
              animationDelay: `${cloud.delay}s`,
            }}
          >
            <path
              d={cloudPath}
              transform={`translate(${cloud.x - 60} ${cloud.y}) scale(${cloud.scale})`}
              className="fill-[#f6c8ec] opacity-80 dark:fill-[#2b1a48] dark:opacity-90"
            />
          </g>
        ))}

        {hills.map((hill) => (
          <path
            key={hill.seed}
            d={hillPath(hill.base, hill.amplitude, hill.seed)}
            className={hill.className}
          />
        ))}

        {/* A little house on the middle hill; its window lights up at night. */}
        <g transform={`translate(${house.x} ${house.ground - 7})`}>
          <path
            d="M1 3h7v5H1zM0 3h9v-1H8v-1H7V0H2v1H1v1H0z"
            className="fill-[#2a0f5c] dark:fill-[#0b0518]"
          />
          <rect
            x="3"
            y="4"
            width="2"
            height="2"
            className="fill-[#ffb3a6] dark:fill-[#ffc83d]"
          />
        </g>

        {/* A radio mast on the near hill, blinking away. */}
        <g transform={`translate(${tower.x} ${tower.ground - 18})`}>
          <path
            d="M2 2h1v16H2zM0 18h5v-1H4v-3H1v3H0zM1 8h3v1H1zM1 13h3v1H1z"
            className="fill-[#1d0a40] dark:fill-[#05020b]"
          />
          <rect
            x="1.5"
            y="0"
            width="2"
            height="2"
            fill="#ff5a5a"
            className="animate-blink"
          />
        </g>

        <WallpaperCat {...catSpots[layout]} layer={layer} />
      </svg>
      <div
        ref={setLayer}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      />
    </>
  );
}
