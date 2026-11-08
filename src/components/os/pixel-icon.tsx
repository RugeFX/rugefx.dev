import { cn } from "@/lib/utils";

// The outline follows the theme so icons stay crisp on dark wallpaper too.
const palette: Record<string, string> = {
  k: "var(--color-pixel-ink)",
  d: "#241b30",
  w: "#ffffff",
  g: "#d6d0e2",
  G: "#8d84a0",
  p: "#7c3aed",
  P: "#4c1d95",
  l: "#c4a4ff",
  y: "#ffc83d",
  Y: "#d99a00",
  m: "#43d9a0",
  s: "#6cc7ff",
  S: "#2b8fd6",
  t: "#ff7a59",
  n: "#ff9fcf",
};

// Each icon is a 16×16 map; every character is one pixel from the palette.
const maps = {
  // The RugeFX mark; public/icon.svg is generated from this map.
  logo: [
    "...........kyk..",
    "..........kkykk.",
    ".........kyyyyyk",
    ".kkkkkkkkkkkykk.",
    "kpllllllllpkyk..",
    "kppppppppppkk...",
    "kppwwwwwpppkk...",
    "kppwwppwwppkk...",
    "kppwwppwwppkk...",
    "kppwwwwwpppkk...",
    "kppwwpwwpppkk...",
    "kppwwppwwppkk...",
    "kppwwppwwppkk...",
    "kppppppppppkk...",
    ".kkkkkkkkkkkk...",
    "..kkkkkkkkkk....",
  ],
  folder: [
    "................",
    "................",
    ".kkkkk..........",
    "kYYYYYk.........",
    "kYYYYYYkkkkkkkk.",
    "kYYYYYYYYYYYYYYk",
    "kYYkkkkkkkkkkkkk",
    "kYkyyyyyyyyyyyyk",
    "kYkyyyyyyyyyyyyk",
    "kkyyyyyyyyyyyyyk",
    "kkyyyyyyyyyyyyyk",
    "kyyyyyyyyyyyyyyk",
    "kyyyyyyyyyyyyyyk",
    "kkkkkkkkkkkkkkkk",
    "................",
    "................",
  ],
  readme: [
    "..kkkkkkkkk.....",
    "..kwwwwwwwkk....",
    "..kwwwwwwwkwk...",
    "..kwGGGGwwkwwk..",
    "..kwwwwwwwkkkkk.",
    "..kwGGGGGGGGGwk.",
    "..kwwwwwwwwwwwk.",
    "..kwGGGGGGGGGwk.",
    "..kwwwwwwwwwwwk.",
    "..kwGGGGGGGGwwk.",
    "..kwwwwwwwwwwwk.",
    "..kwGGGGGGGGGwk.",
    "..kwwwwwwwwwwwk.",
    "..kwGGGGGwwwwwk.",
    "..kkkkkkkkkkkkk.",
    "................",
  ],
  resume: [
    "..kkkkkkkkk.....",
    "..kwwwwwwwkk....",
    "..kwnnwwwwkwk...",
    "..kwnnwppwkwwk..",
    "..kwwwwwwwkkkkk.",
    "..kwppppppppwwk.",
    "..kwwwwwwwwwwwk.",
    "..kwGGGGGGGGGwk.",
    "..kwGGGGGGGwwwk.",
    "..kwwwwwwwwwwwk.",
    "..kwppppppwwwwk.",
    "..kwGGGGGGGGGwk.",
    "..kwGGGGGGwwwwk.",
    "..kwwwwwwwwwwwk.",
    "..kkkkkkkkkkkkk.",
    "................",
  ],
  briefcase: [
    "................",
    "................",
    ".....kkkkkk.....",
    "....kk....kk....",
    ".kkkkkkkkkkkkkk.",
    "kllllllllllllllk",
    "kppppppppppppppk",
    "kppppppppppppppk",
    "kPPPPPPyyPPPPPPk",
    "kkkkkkkyykkkkkkk",
    "kppppppppppppppk",
    "kppppppppppppppk",
    "kppppppppppppppk",
    "kPPPPPPPPPPPPPPk",
    ".kkkkkkkkkkkkkk.",
    "................",
  ],
  taskmgr: [
    "................",
    ".kkkkkkkkkkkkkk.",
    ".kggggggggggggk.",
    ".kgkkkkkkkkkkgk.",
    ".kgkPPPPPPPPkgk.",
    ".kgkPPPPPPmPkgk.",
    ".kgkPPPPPmPPkgk.",
    ".kgkPmPPmPPPkgk.",
    ".kgkmPmmPPPPkgk.",
    ".kgkPPPPPPPPkgk.",
    ".kgkkkkkkkkkkgk.",
    ".kggggggggggggk.",
    ".kkkkkkkkkkkkkk.",
    "......kGGk......",
    "....kkkkkkkk....",
    "................",
  ],
  terminal: [
    "................",
    "kkkkkkkkkkkkkkkk",
    "kppppppppppnymwk",
    "kkkkkkkkkkkkkkkk",
    "kddddddddddddddk",
    "kdmddddddddddddk",
    "kddmdddddddddddk",
    "kdddmddddddddddk",
    "kddmdddddddddddk",
    "kdmddmmmmddddddk",
    "kddddddddddddddk",
    "kddddddddddddddk",
    "kddddddddddddddk",
    "kkkkkkkkkkkkkkkk",
    "................",
    "................",
  ],
  mail: [
    "................",
    "................",
    "................",
    "kkkkkkkkkkkkkkkk",
    "kkwwwwwwwwwwwwkk",
    "kwkwwwwwwwwwwkwk",
    "kwwkwwwwwwwwkwwk",
    "kwwwkwwwwwwkwwwk",
    "kwwwwkwwwwkwwwwk",
    "kwwwwwkppkwwwwwk",
    "kwwwwwwppwwwwwwk",
    "kwwwwwwwwwwwwwwk",
    "kwwwwwwwwwwwwwwk",
    "kkkkkkkkkkkkkkkk",
    "................",
    "................",
  ],
  trash: [
    "................",
    "......kkkk......",
    "..kkkkkkkkkkkk..",
    "..kggggggggggk..",
    "..kkkkkkkkkkkk..",
    "...kgGgGgGgGk...",
    "...kgGgGgGgGk...",
    "...kgGgGgGgGk...",
    "...kgGgGgGgGk...",
    "...kgGgGgGgGk...",
    "...kgGgGgGgGk...",
    "...kgGgGgGgGk...",
    "....kGgGgGgk....",
    "....kGgGgGgk....",
    "....kkkkkkkk....",
    "................",
  ],
  trashFull: [
    "................",
    "....kkk..kkk....",
    "..kkwwkkkkllk...",
    "..kkkkkkkkkkkk..",
    "..kggggggggggk..",
    "..kkkkkkkkkkkk..",
    "...kgGgGgGgGk...",
    "...kgGgGgGgGk...",
    "...kgGgGgGgGk...",
    "...kgGgGgGgGk...",
    "...kgGgGgGgGk...",
    "...kgGgGgGgGk...",
    "....kGgGgGgk....",
    "....kGgGgGgk....",
    "....kkkkkkkk....",
    "................",
  ],
  phone: [
    "....kkkkkkkk....",
    "....kPPkkPPk....",
    "....kssssssk....",
    "....ksmmsssk....",
    "....kssssssk....",
    "....ksyysssk....",
    "....kssssssk....",
    "....kssnnssk....",
    "....kssssssk....",
    "....kssssssk....",
    "....kssssssk....",
    "....kPPPPPPk....",
    "....kPPwwPPk....",
    "....kPPPPPPk....",
    "....kkkkkkkk....",
    "................",
  ],
  web: [
    "................",
    "kkkkkkkkkkkkkkkk",
    "kpppppppppppnymk",
    "kkkkkkkkkkkkkkkk",
    "kwwwwwwwwwwwwwwk",
    "kwssssssswyyywwk",
    "kwssssssswyyywwk",
    "kwssssssswwwwwwk",
    "kwssssssswGGGGwk",
    "kwwwwwwwwwwwwwwk",
    "kwGGGGGGGGGGGGwk",
    "kwGGGGGGGGGwwwwk",
    "kwwwwwwwwwwwwwwk",
    "kkkkkkkkkkkkkkkk",
    "................",
    "................",
  ],
  info: badge("S", [
    "...ww...",
    "...ww...",
    "........",
    "..www...",
    "...ww...",
    "...ww...",
    "...ww...",
    "..wwww..",
  ]),
  error: badge("t", [
    "ww....ww",
    "www..www",
    ".wwwwww.",
    "..wwww..",
    "..wwww..",
    ".wwwwww.",
    "www..www",
    "ww....ww",
  ]),
  question: badge("p", [
    "..wwww..",
    ".ww..ww.",
    ".....ww.",
    "....ww..",
    "...ww...",
    "...ww...",
    "........",
    "...ww...",
  ]),
  warning: triangle(),
} satisfies Record<string, string[]>;

export type PixelIconName = keyof typeof maps;

/** A round message-box badge with an 8×8 glyph in the middle. */
function badge(fill: string, glyph: string[]) {
  return Array.from({ length: 16 }, (_, y) =>
    Array.from({ length: 16 }, (_, x) => {
      const mark = glyph[y - 4]?.[x - 4];
      if (mark && mark !== ".") return mark;
      const distance = Math.hypot(x - 7.5, y - 7.5);
      return distance <= 6.6 ? fill : distance <= 7.7 ? "k" : ".";
    }).join(""),
  );
}

function triangle() {
  return Array.from({ length: 16 }, (_, y) =>
    Array.from({ length: 16 }, (_, x) => {
      if (y < 1 || y > 14) return ".";
      if ((x === 7 || x === 8) && ((y >= 5 && y <= 10) || y === 12)) return "k";
      const half = ((y - 1) / 13) * 8;
      const offset = Math.abs(x + 0.5 - 8);
      if (offset > half) return ".";
      return offset > half - 1.3 || y === 14 ? "k" : "y";
    }).join(""),
  );
}

// Pixels of one colour are merged into horizontal runs inside a single path.
function compile(rows: string[]) {
  const paths = new Map<string, string>();
  rows.forEach((row, y) => {
    let x = 0;
    while (x < row.length) {
      const key = row[x];
      let end = x + 1;
      while (row[end] === key) end += 1;
      if (key !== ".") {
        paths.set(
          key,
          `${paths.get(key) ?? ""}M${x} ${y}h${end - x}v1h${x - end}z`,
        );
      }
      x = end;
    }
  });
  return [...paths].map(([key, d]) => ({ color: palette[key], d }));
}

const compiled = Object.fromEntries(
  Object.entries(maps).map(([name, rows]) => [name, compile(rows)]),
) as Record<PixelIconName, ReturnType<typeof compile>>;

interface PixelIconProps {
  name: PixelIconName;
  className?: string;
}

export default function PixelIcon({ name, className }: PixelIconProps) {
  return (
    <svg
      viewBox="0 0 16 16"
      shapeRendering="crispEdges"
      aria-hidden="true"
      className={cn("shrink-0", className)}
    >
      {compiled[name].map(({ color, d }) => (
        <path key={color} style={{ fill: color }} d={d} />
      ))}
    </svg>
  );
}
