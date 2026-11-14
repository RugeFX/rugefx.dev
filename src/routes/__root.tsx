import type { ReactNode } from "react";
import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRoute,
  useMatch,
  useNavigate,
  useRouterState,
} from "@tanstack/react-router";
import { DialogBox } from "@/components/os/message-box";
import RugeOS from "@/components/os/ruge-os";
import { FONT_STYLESHEET_URL, SITE_AUTHOR, SITE_NAME } from "@/config/site";
import { OSProvider } from "@/contexts/os-provider";
import { PlaygroundProvider } from "@/contexts/playground-provider";
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
      theme === "dark" ? "#07030f" : "#2a0f5c",
    );
  } catch {
    document.documentElement.dataset.theme = "light";
  }
  // The boot screen plays once per visit.
  try {
    if (sessionStorage.getItem("rugefx-booted")) {
      document.documentElement.dataset.booted = "";
    }
    sessionStorage.setItem("rugefx-booted", "1");
  } catch {
    // Without storage the boot screen simply plays every time.
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
      { name: "theme-color", content: "#2a0f5c" },
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
  // The résumé is a normal page, with no boot screen or desktop behind it.
  const isResume = useMatch({ from: "/resume", shouldThrow: false });

  return (
    <RootDocument>
      <ThemeProvider>
        <PlaygroundProvider>
          <OSProvider>
            {!isResume && <RugeOS />}
            <Outlet />
          </OSProvider>
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

// Routes only pick which windows are open, so a missing page is an error
// dialog over the desktop.
function NotFoundPage() {
  const navigate = useNavigate();
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });
  const goHome = () => void navigate({ to: "/" });

  return (
    <DialogBox
      title="rugefx.dev"
      icon="error"
      buttons={[{ label: "OK", onClick: goHome }]}
      onDismiss={goHome}
    >
      <p>
        Cannot find <span className="font-mono">{pathname}</span>.
      </p>
      <p className="mt-2">
        Check the address and try again, or head back to the desktop.
      </p>
    </DialogBox>
  );
}
