import type { PixelIconName } from "@/components/os/pixel-icon";
import { getProjectBySlug } from "@/content/portfolio";
import { projectSlugs, type ProjectSlug } from "@/content/project-slugs";

export type ProjectAppId = `project:${ProjectSlug}`;
export type AppId =
  | "welcome"
  | "about"
  | "projects"
  | "experience"
  | "skills"
  | "terminal"
  | "mail"
  | "trash"
  | ProjectAppId;

/** CSS lengths relative to the desktop, so prerendered windows fit any screen. */
export interface WindowFrame {
  left: string;
  top: string;
  width: string;
  height: string;
}

export interface AppMeta {
  title: string;
  icon: PixelIconName | "logo";
  frame: WindowFrame;
}

const apps: Record<Exclude<AppId, ProjectAppId>, AppMeta> = {
  welcome: {
    title: "Welcome to RugeOS",
    icon: "logo",
    frame: {
      left: "max(124px, calc(50% - 330px))",
      top: "max(20px, 7%)",
      width: "min(660px, calc(100% - 156px))",
      height: "min(500px, calc(100% - 48px))",
    },
  },
  about: {
    title: "readme.txt - Notepad",
    icon: "readme",
    frame: {
      left: "116px",
      top: "36px",
      width: "min(520px, 42%)",
      height: "min(640px, calc(100% - 84px))",
    },
  },
  projects: {
    title: "C:\\Projects",
    icon: "folder",
    frame: {
      left: "calc(100% - min(600px, 46%) - 28px)",
      top: "min(18%, 140px)",
      width: "min(600px, 46%)",
      height: "min(500px, 70%)",
    },
  },
  experience: {
    title: "Work History Properties",
    icon: "briefcase",
    frame: {
      left: "max(124px, 20%)",
      top: "8%",
      width: "min(620px, 62%)",
      height: "min(600px, 84%)",
    },
  },
  skills: {
    title: "RugeOS Task Manager",
    icon: "taskmgr",
    frame: {
      left: "30%",
      top: "11%",
      width: "min(640px, 60%)",
      height: "min(540px, 80%)",
    },
  },
  terminal: {
    title: "rugesh",
    icon: "terminal",
    frame: {
      left: "24%",
      top: "22%",
      width: "min(700px, 64%)",
      height: "min(440px, 66%)",
    },
  },
  mail: {
    title: "New Message",
    icon: "mail",
    frame: {
      left: "36%",
      top: "9%",
      width: "min(560px, 54%)",
      height: "min(560px, 84%)",
    },
  },
  trash: {
    title: "Recycle Bin",
    icon: "trashFull",
    frame: {
      left: "calc(100% - min(480px, 50%) - 120px)",
      top: "calc(100% - min(360px, 60%) - 60px)",
      width: "min(480px, 50%)",
      height: "min(360px, 60%)",
    },
  },
};

export function projectAppId(slug: ProjectSlug): ProjectAppId {
  return `project:${slug}`;
}

export function projectSlugFromApp(id: AppId): ProjectSlug | null {
  if (!id.startsWith("project:")) return null;
  return id.slice("project:".length) as ProjectSlug;
}

export function projectSlugFromPath(pathname: string): ProjectSlug | null {
  const match = /^\/projects\/([^/]+)\/?$/.exec(pathname);
  const slug = match?.[1];
  return projectSlugs.find((known) => known === slug) ?? null;
}

export function getAppMeta(id: AppId): AppMeta {
  const slug = projectSlugFromApp(id);
  if (!slug) return apps[id as keyof typeof apps];

  const project = getProjectBySlug(slug)!;
  // Each project window cascades a little so several never stack exactly.
  const offset = projectSlugs.indexOf(slug) * 26;
  return {
    title: `${project.title} - Viewer`,
    icon: project.category === "Mobile" ? "phone" : "web",
    frame: {
      left: `calc(50% - min(390px, 38%) + ${offset}px)`,
      top: `${16 + offset}px`,
      width: "min(780px, 76%)",
      height: `calc(100% - ${48 + offset}px)`,
    },
  };
}
