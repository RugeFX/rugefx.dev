export const SITE_URL = "https://rugefx.dev";
export const SITE_NAME = "RugeFX";
export const SITE_AUTHOR = "Ahmad Zacky";
export const SITE_LOCALE = "en_US";

export const CONTACT_EMAIL = "zackfxg@gmail.com";
export const RESUME_URL =
  "https://docs.google.com/document/d/1Fh4tgO5LSXGCdzDGPtST5pniM-a08Ar-O8dW1SvMmDY/edit?usp=sharing";

export const SITE_LOCATION = {
  city: "Bekasi",
  timeZone: "Asia/Jakarta",
  timeZoneLabel: "WIB",
} as const;

export const SOCIAL_LINKS = [
  "https://github.com/RugeFX",
  "https://linkedin.com/in/rugefx",
  "https://twitter.com/RugeDev",
] as const;

export const ELSEWHERE_LINKS = [
  { label: "GitHub", href: SOCIAL_LINKS[0] },
  { label: "LinkedIn", href: SOCIAL_LINKS[1] },
  { label: "X / Twitter", href: SOCIAL_LINKS[2] },
  { label: "Résumé", href: RESUME_URL },
] as const;

export const FONT_STYLESHEET_URL =
  "https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=IBM+Plex+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Pixelify+Sans:wght@400..700&display=swap";
