// These values survive route unmounts, but reset on a full page load.
export const projectNavigation = {
  category: "All" as "All" | "Mobile" | "Websites",
  hasRevealedGrid: false,
  origin: null as null | {
    slug: string;
    historyIndex: number;
    scrollY: number;
  },
};
