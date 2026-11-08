import { createFileRoute } from "@tanstack/react-router";
import { createHomeSeoHead } from "@/lib/seo";

// The desktop is rendered by the root route; this route only sets the metadata.
export const Route = createFileRoute("/")({
  head: createHomeSeoHead,
  component: () => null,
});
