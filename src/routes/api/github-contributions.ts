import { createFileRoute } from "@tanstack/react-router";
import {
  GITHUB_USERNAME,
  parseContributions,
  type Contributions,
} from "@/lib/github-contributions";

// Serves the last year of GitHub activity as JSON. The edge cache keeps it
// fresh without asking GitHub on every visit.
export const Route = createFileRoute("/api/github-contributions")({
  server: {
    handlers: {
      GET: async () => {
        const response = await fetch(
          `https://github.com/users/${GITHUB_USERNAME}/contributions`,
          { headers: { "User-Agent": "rugefx.dev" } },
        );
        const days = response.ok
          ? parseContributions(await response.text())
          : [];
        if (!days.length) {
          return Response.json(
            { error: "GitHub didn't send any contributions." },
            { status: 502, headers: { "Cache-Control": "no-store" } },
          );
        }
        const body: Contributions = {
          days,
          fetchedAt: new Date().toISOString(),
        };
        return Response.json(body, {
          headers: {
            "Cache-Control":
              "public, max-age=600, s-maxage=21600, stale-while-revalidate=86400",
          },
        });
      },
    },
  },
});
