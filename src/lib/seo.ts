import {
  SITE_AUTHOR,
  SITE_LOCALE,
  SITE_NAME,
  SITE_URL,
  SOCIAL_LINKS,
} from "@/config/site";
import type { Project } from "@/content/portfolio";

interface SeoOptions {
  title: string;
  description: string;
  path: string;
  imagePath: string;
  structuredData: Record<string, unknown>;
}

function absoluteUrl(path: string): string {
  return new URL(path, SITE_URL).toString();
}

export function createSeoHead({
  title,
  description,
  path,
  imagePath,
  structuredData,
}: SeoOptions) {
  const canonicalUrl = absoluteUrl(path);
  const imageUrl = absoluteUrl(imagePath);

  return {
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:locale", content: SITE_LOCALE },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: canonicalUrl },
      { property: "og:image", content: imageUrl },
      { property: "og:image:type", content: "image/jpeg" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: `${title} preview` },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:creator", content: "@RugeDev" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
      { name: "twitter:image", content: imageUrl },
      { name: "twitter:image:alt", content: `${title} preview` },
    ],
    links: [{ rel: "canonical", href: canonicalUrl }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(structuredData),
      },
    ],
  };
}

export function createHomeSeoHead() {
  const title = "Ahmad Zacky — Software Engineer | RugeFX";
  const description =
    "Ahmad Zacky is a software engineer in Bekasi, Indonesia, building web, mobile, and connected operational systems.";

  return createSeoHead({
    title,
    description,
    path: "/",
    imagePath: "/og/rugefx.jpg",
    structuredData: {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "WebSite",
          "@id": `${SITE_URL}/#website`,
          url: `${SITE_URL}/`,
          name: SITE_NAME,
          alternateName: SITE_AUTHOR,
          inLanguage: "en",
        },
        {
          "@type": "Person",
          "@id": `${SITE_URL}/#person`,
          name: SITE_AUTHOR,
          alternateName: SITE_NAME,
          url: `${SITE_URL}/`,
          image: absoluteUrl("/og/rugefx.jpg"),
          jobTitle: "Software Engineer",
          address: {
            "@type": "PostalAddress",
            addressLocality: "Bekasi",
            addressCountry: "ID",
          },
          sameAs: SOCIAL_LINKS,
        },
      ],
    },
  });
}

export function createProjectSeoHead(project: Project) {
  const title = `${project.title} — Project by ${SITE_AUTHOR}`;
  const path = `/projects/${project.slug}`;
  const relatedUrls = [
    project.siteUrl,
    project.repositoryUrl,
    ...(project.additionalLinks?.map(({ url }) => url) ?? []),
  ].filter((url): url is string => Boolean(url));

  return createSeoHead({
    title,
    description: project.seoDescription,
    path,
    imagePath: project.socialImage,
    structuredData: {
      "@context": "https://schema.org",
      "@type": "CreativeWork",
      name: project.title,
      description: project.seoDescription,
      url: absoluteUrl(path),
      image: absoluteUrl(project.socialImage),
      author: {
        "@type": "Person",
        "@id": `${SITE_URL}/#person`,
        name: SITE_AUTHOR,
        url: `${SITE_URL}/`,
      },
      keywords: project.technologies.map(({ label }) => label).join(", "),
      ...(relatedUrls.length ? { sameAs: relatedUrls } : {}),
    },
  });
}
