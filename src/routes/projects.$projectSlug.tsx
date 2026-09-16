import { createFileRoute, notFound } from "@tanstack/react-router";
import ProjectDetailPage from "@/pages/project-detail-page";
import { getProjectBySlug } from "@/content/portfolio";
import { createProjectSeoHead } from "@/lib/seo";

export const Route = createFileRoute("/projects/$projectSlug")({
  loader: ({ params }) => {
    const project = getProjectBySlug(params.projectSlug);
    if (!project) throw notFound();
    return project.slug;
  },
  head: ({ loaderData }) =>
    loaderData ? createProjectSeoHead(getProjectBySlug(loaderData)!) : {},
  component: ProjectRoute,
});

function ProjectRoute() {
  const projectSlug = Route.useLoaderData();
  const project = getProjectBySlug(projectSlug)!;

  return <ProjectDetailPage key={project.slug} project={project} />;
}
