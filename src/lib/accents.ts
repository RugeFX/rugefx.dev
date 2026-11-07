import type { ProjectSlug } from "@/content/project-slugs";

export type Accent = "brand" | "sun" | "mint" | "sky" | "tomato" | "pink";

// Full class names so Tailwind can see every colour it needs to generate.
export const accentBackground: Record<Accent, string> = {
  brand: "bg-brand text-on-brand",
  sun: "bg-sun text-on-accent",
  mint: "bg-mint text-on-accent",
  sky: "bg-sky text-on-accent",
  tomato: "bg-tomato text-on-accent",
  pink: "bg-pink text-on-accent",
};

export const accentStroke: Record<Accent, string> = {
  brand: "stroke-brand",
  sun: "stroke-sun",
  mint: "stroke-mint",
  sky: "stroke-sky",
  tomato: "stroke-tomato",
  pink: "stroke-pink",
};

export const accentHex: Record<Accent, string> = {
  brand: "#7c3aed",
  sun: "#ffc83d",
  mint: "#43d9a0",
  sky: "#6cc7ff",
  tomato: "#ff7a59",
  pink: "#ff9fcf",
};

export const projectAccent: Record<ProjectSlug, Accent> = {
  "qurban-asyik": "mint",
  "sattu-id": "sun",
  "sga-cakrawala": "sky",
  rugefx: "brand",
};
