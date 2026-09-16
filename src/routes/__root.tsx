import type { ReactNode } from "react";
import {
  HeadContent,
  Link,
  Outlet,
  Scripts,
  createRootRoute,
} from "@tanstack/react-router";
import ProjectImageTransition from "@/components/projects/project-image-transition";
import { buttonVariants } from "@/components/ui/button-variants";
import { SITE_AUTHOR, SITE_NAME } from "@/config/site";
import { ThemeProvider } from "@/contexts/theme-provider";
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
      theme === "dark" ? "#120c1a" : "#f8f7fb",
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
      { name: "theme-color", content: "#f8f7fb" },
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
    ],
  }),
  component: RootComponent,
  notFoundComponent: NotFoundPage,
});

function RootComponent() {
  return (
    <RootDocument>
      <ThemeProvider>
        <Outlet />
        <ProjectImageTransition />
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
    <main className="bg-portfolio-canvas text-portfolio-ink grid min-h-screen place-items-center px-6">
      <div className="text-center">
        <h1 className="font-display text-5xl font-semibold tracking-tight">
          Page not found.
        </h1>
        <p className="text-portfolio-copy-muted mt-4">
          The page you’re looking for doesn’t exist.
        </p>
        <Link
          to="/"
          className={buttonVariants({
            variant: "default",
            className: "mt-8",
          })}
        >
          Return home
        </Link>
      </div>
    </main>
  );
}
