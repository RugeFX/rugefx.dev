import type { Project } from "@/content/portfolio";

/** A short label for the window bar above a project preview. */
export function projectHost(project: Project) {
  if (project.siteLinkLabel) return project.siteLinkLabel;
  if (!project.siteUrl) return "rugefx.dev";
  return new URL(project.siteUrl).hostname.replace(/^www\./, "");
}
