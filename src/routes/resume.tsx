import { Link, createFileRoute } from "@tanstack/react-router";
import PlainContent from "@/components/os/plain-content";
import { plainLinkClass } from "@/components/os/retro";
import { createResumeSeoHead } from "@/lib/seo";

export const Route = createFileRoute("/resume")({
  head: createResumeSeoHead,
  component: ResumePage,
});

/** A normal page for sharing on applications; the root skips RugeOS here. */
function ResumePage() {
  return (
    <div className="bg-field text-ink fixed inset-0 overflow-y-auto">
      <main>
        <PlainContent />
      </main>
      <footer className="text-ink-muted mx-auto max-w-2xl px-5 pb-12 text-sm">
        Want the fun version?{" "}
        <Link to="/" className={plainLinkClass}>
          Open RugeOS
        </Link>
      </footer>
    </div>
  );
}
