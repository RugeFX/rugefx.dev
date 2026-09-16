import { createFileRoute } from "@tanstack/react-router";
import ProjectDetailPage from "@/components/project-detail-page";

export const Route = createFileRoute("/projects/$projectSlug")({
  component: ProjectRoute,
});

function ProjectRoute() {
  const { projectSlug } = Route.useParams();

  return <ProjectDetailPage key={projectSlug} projectSlug={projectSlug} />;
}
