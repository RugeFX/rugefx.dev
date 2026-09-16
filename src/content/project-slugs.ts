export const projectSlugs = [
  "qurban-asyik",
  "sattu-id",
  "sga-cakrawala",
  "rugefx",
] as const;

export type ProjectSlug = (typeof projectSlugs)[number];
