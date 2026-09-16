import { createFileRoute } from "@tanstack/react-router";
import HomePage from "@/pages/home-page";
import { createHomeSeoHead } from "@/lib/seo";

export const Route = createFileRoute("/")({
  head: createHomeSeoHead,
  component: HomePage,
});
