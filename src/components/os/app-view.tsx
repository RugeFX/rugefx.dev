import { memo } from "react";
import AboutApp from "@/components/apps/about-app";
import ExperienceApp from "@/components/apps/experience-app";
import MailApp from "@/components/apps/mail-app";
import ProjectApp from "@/components/apps/project-app";
import ProjectsApp from "@/components/apps/projects-app";
import SkillsApp from "@/components/apps/skills-app";
import TerminalApp from "@/components/apps/terminal-app";
import TrashApp from "@/components/apps/trash-app";
import WelcomeApp from "@/components/apps/welcome-app";
import { projectSlugFromApp, type AppId } from "@/components/os/apps";

interface AppViewProps {
  id: AppId;
}

/** The contents of a window or phone sheet. Memoised so window moves stay cheap. */
const AppView = memo(function AppView({ id }: AppViewProps) {
  const slug = projectSlugFromApp(id);
  if (slug) return <ProjectApp slug={slug} />;

  switch (id) {
    case "welcome":
      return <WelcomeApp />;
    case "about":
      return <AboutApp />;
    case "projects":
      return <ProjectsApp />;
    case "experience":
      return <ExperienceApp />;
    case "skills":
      return <SkillsApp />;
    case "terminal":
      return <TerminalApp />;
    case "mail":
      return <MailApp />;
    case "trash":
      return <TrashApp />;
    default:
      return null;
  }
});

export default AppView;
