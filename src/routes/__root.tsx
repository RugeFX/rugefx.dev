import type { ReactNode } from "react";
import {
  HeadContent,
  Link,
  Outlet,
  Scripts,
  createRootRoute,
} from "@tanstack/react-router";
import SiteHeader from "@/components/layout/site-header";
import ProjectImageTransition from "@/components/projects/project-image-transition";
import { popButtonClass } from "@/components/ui/pop-styles";
import { FONT_STYLESHEET_URL, SITE_AUTHOR, SITE_NAME } from "@/config/site";
import { PlaygroundProvider } from "@/contexts/playground-provider";
import { ThemeProvider } from "@/contexts/theme-provider";
import { cn } from "@/lib/utils";
import "@/index.css";

const themeBootstrap = `
(() => {
  try {
    const storedTheme = localStorage.getItem("rugefx-theme");
    const theme = storedTheme === "light" || storedTheme === "dark"
      ? storedTheme
      : matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";

    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
    document.querySelector('meta[name="theme-color"]')?.setAttribute(
      "content",
      theme === "dark" ? "#120c1a" : "#faf7ff",
    );
  } catch {
    document.documentElement.dataset.theme = "light";
  }
})();
`;

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1.0",
      },
      { name: "theme-color", content: "#faf7ff" },
      { name: "author", content: SITE_AUTHOR },
      { name: "robots", content: "index, follow" },
      { title: `${SITE_NAME} — ${SITE_AUTHOR}` },
    ],
    links: [
      { rel: "icon", type: "image/svg+xml", href: "/icon.svg" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous",
      },
      { rel: "stylesheet", href: FONT_STYLESHEET_URL },
    ],
  }),
  component: RootComponent,
  notFoundComponent: NotFoundPage,
});

function RootComponent() {
  return (
    <RootDocument>
      <ThemeProvider>
        <PlaygroundProvider>
          <SiteHeader />
          <Outlet />
          <ProjectImageTransition />
        </PlaygroundProvider>
      </ThemeProvider>
    </RootDocument>
  );
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" className="relative" suppressHydrationWarning>
      <head>
        <HeadContent />
        <script dangerouslySetInnerHTML={{ __html: themeBootstrap }} />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function NotFoundPage() {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center px-5 text-center">
      <p className="font-hand text-ink-muted text-3xl">uh oh…</p>
      <h1 className="font-display text-[clamp(96px,22vw,280px)] leading-none font-extrabold tracking-[-0.05em]">
        4<span className="text-brand inline-block -rotate-12">0</span>4
      </h1>
      <p className="text-ink-soft mt-2 text-xl">
        This page wandered off. It happens to the best of us.
      </p>
      <Link
        to="/"
        className={cn(popButtonClass, "bg-brand text-on-brand mt-8")}
      >
        Take me home
      </Link>
    </main>
  );
}
