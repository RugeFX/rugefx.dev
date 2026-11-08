import { createFileRoute, notFound } from "@tanstack/react-router";
import { getProjectBySlug } from "@/content/portfolio";
import { createProjectSeoHead } from "@/lib/seo";

// The OS opens the project's window for this URL; this route validates the
// slug and sets the metadata.
export const Route = createFileRoute("/projects/$projectSlug")({
  loader: ({ params }) => {
    const project = getProjectBySlug(params.projectSlug);
    if (!project) throw notFound();
    return project.slug;
  },
  head: ({ loaderData }) =>
    loaderData ? createProjectSeoHead(getProjectBySlug(loaderData)!) : {},
  component: () => null,
});
