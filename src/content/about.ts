export const intro =
  "A software engineer in Bekasi, Indonesia. I build web apps, mobile apps, and the plumbing that connects them to everything else.";

export const bio = [
  "I'm a primarily self-taught developer who builds web and mobile apps, plus the services and integrations behind them.",
  "Lately that means mobile commerce, IoT-connected weighing workflows, and dashboards that keep operational data moving.",
  "I care about clear APIs, maintainable code, and software that holds up in everyday use. Also: good kopi.",
];

export const now =
  "Building operational dashboards at Nauchara that talk to on-site devices, SAP and a warehouse system.";

export const facts = [
  ["Role", "Software engineer"],
  ["Location", "Bekasi, West Java, Indonesia"],
  [
    "Education",
    "Computer Science at Cakrawala University, picked for the Talent Scouting program",
  ],
  ["Community", "Deputy Head of Research & Technology, Student Government"],
  ["Good at", "Shipping apps to the stores, hooking devices up to dashboards"],
] as const;

export interface Skill {
  name: string;
  description: string;
  /** How busy this skill keeps me, out of 100. Drives the Task Manager. */
  load: number;
}

export const mainSkills: Skill[] = [
  { name: "React", description: "UI library", load: 18 },
  { name: "TypeScript", description: "Typed JavaScript", load: 12 },
  { name: "React Native", description: "Mobile apps", load: 8 },
  { name: "Laravel", description: "PHP framework", load: 6 },
  { name: "Expo", description: "Mobile toolchain", load: 4 },
  { name: "Node.js", description: "JavaScript runtime", load: 3 },
  { name: "PostgreSQL", description: "Database", load: 2 },
  { name: "MQTT", description: "Device messaging", load: 2 },
  { name: "Docker", description: "Containers", load: 1 },
  { name: "GitHub Actions", description: "CI/CD", load: 1 },
];

export const extraSkills = [
  "JavaScript",
  "PHP",
  "Go",
  "Python",
  "Java",
  "C#",
  "Rust",
  "C++",
  "Next.js",
  "NestJS",
  "Hono",
  "Fastify",
  "Hapi",
  "Gin",
  "Fiber",
  "Axum",
  "Tailwind CSS",
  "MongoDB",
  "Git",
  "Figma",
  "Vercel",
  "AWS",
  "Fly.io",
];

/** "React Native" → "react-native.exe", for the Task Manager and terminal. */
export function processName(skill: string) {
  return `${skill
    .toLowerCase()
    .replace(/\+/g, "p")
    .replace(/#/g, "sharp")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")}.exe`;
}
