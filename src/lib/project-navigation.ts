// These values survive route unmounts, but reset on a full page load.
export const projectNavigation = {
  origin: null as null | {
    slug: string;
    historyIndex: number;
    scrollY: number;
  },
};
