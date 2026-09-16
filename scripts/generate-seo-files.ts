import { projectSlugs } from "../src/content/project-slugs";
import { SITE_URL } from "../src/config/site";

const publicDirectory = new URL("../public/", import.meta.url);
const routes = ["/", ...projectSlugs.map((slug) => `/projects/${slug}`)];
const urls = routes
  .map(
    (path) => `  <url>
    <loc>${new URL(path, SITE_URL).toString()}</loc>
  </url>`,
  )
  .join("\n");
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
const robots = `User-agent: *
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml
`;

await Promise.all([
  Bun.write(new URL("sitemap.xml", publicDirectory), sitemap),
  Bun.write(new URL("robots.txt", publicDirectory), robots),
]);
