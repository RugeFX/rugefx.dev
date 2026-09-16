import { Link, Outlet, createRootRoute } from "@tanstack/react-router";
import ProjectImageTransition from "@/components/projects/project-image-transition";
import { buttonVariants } from "@/components/ui/button-variants";

export const Route = createRootRoute({
  component: RootLayout,
  notFoundComponent: NotFoundPage,
});

function RootLayout() {
  return (
    <>
      <Outlet />
      <ProjectImageTransition />
    </>
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
