import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import type { AppId } from "@/components/os/apps";
import {
  CONTACT_EMAIL,
  ELSEWHERE_LINKS,
  RESUME_URL,
  SITE_LOCATION,
} from "@/config/site";
import { bio, extraSkills, intro, mainSkills } from "@/content/about";
import { projects, workExperiences } from "@/content/portfolio";
import { projectSlugs, type ProjectSlug } from "@/content/project-slugs";
import { useAppFrame } from "@/contexts/app-frame-context";
import { useOS } from "@/contexts/os-context";
import { usePlayground } from "@/contexts/playground-context";
import { useTheme } from "@/contexts/theme-context";
import { loadGithubContributions } from "@/hooks/use-github-contributions";
import { localMood } from "@/hooks/use-local-time";
import { GITHUB_USERNAME, contributionStats } from "@/lib/github-contributions";

const prompt = "zacky@rugeos:~$";

const commands: [string, string][] = [
  ["help", "list the commands"],
  ["whoami", "who's behind all this"],
  ["about", "the short bio"],
  ["projects", "things I've built"],
  ["open <name>", "open an app or project, like `open sattu-id`"],
  ["experience", "where I've worked"],
  ["skills", "what I work with"],
  ["contact", "copy my email address"],
  ["resume", "open my résumé"],
  ["socials", "find me elsewhere"],
  ["github", "my last 12 weeks of commits"],
  ["neofetch", "system info, the fun way"],
  ["theme", "flip light and dark mode"],
  ["sound", "turn sound effects on or off"],
  ["clear", "wipe the screen"],
  ["exit", "close the terminal"],
];

const apps: Record<string, AppId> = {
  welcome: "welcome",
  about: "about",
  readme: "about",
  "readme.txt": "about",
  projects: "projects",
  experience: "experience",
  work: "experience",
  skills: "skills",
  "skills.exe": "skills",
  taskmgr: "skills",
  mail: "mail",
  trash: "trash",
  terminal: "terminal",
};

const completions = [
  ...commands.map(([name]) => name.split(" ")[0]),
  "sudo hire-me",
  "date",
  "echo",
  "history",
  "ls",
  "cat readme.txt",
  "kopi",
];

const formatter = new Intl.DateTimeFormat("en-GB", {
  weekday: "long",
  day: "numeric",
  month: "long",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
  timeZone: SITE_LOCATION.timeZone,
});

interface Line {
  id: number;
  content: ReactNode;
}

let lineId = 0;
const line = (content: ReactNode): Line => ({ id: (lineId += 1), content });

function Accent({ children }: { children: ReactNode }) {
  return <span className="text-mint">{children}</span>;
}

function Muted({ children }: { children: ReactNode }) {
  return <span className="text-terminal-ink/60">{children}</span>;
}

function ExternalLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="text-sky underline underline-offset-2"
    >
      {children}
    </a>
  );
}

const greeting = [
  line(
    <>
      rugesh 1.0 on <Accent>RugeOS 26.11</Accent>
    </>,
  ),
  line(
    <Muted>
      Type <Accent>help</Accent> to see what you can do. Tab completes.
    </Muted>,
  ),
];

export default function TerminalApp() {
  const os = useOS();
  const { close } = useAppFrame();
  const { theme, setTheme } = useTheme();
  const { play, rain, soundEnabled, toggleSound } = usePlayground();
  const [lines, setLines] = useState<Line[]>(greeting);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [recall, setRecall] = useState<number | null>(null);
  const [startedAt] = useState(() => Date.now());
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    inputRef.current?.focus({ preventScroll: true });
  }, []);

  useEffect(() => {
    const element = scrollRef.current;
    if (element) element.scrollTop = element.scrollHeight;
  }, [lines]);

  const print = (...content: ReactNode[]) =>
    setLines((current) => [...current, ...content.map(line)]);

  const openTarget = (target: string) => {
    const name = target.toLowerCase();
    if (name === "resume" || name === "resume.doc") {
      window.open(RESUME_URL, "_blank", "noopener");
      return print(<Muted>Opening résumé in a new tab…</Muted>);
    }
    if (projectSlugs.includes(name as ProjectSlug)) {
      os.openProject(name as ProjectSlug);
      return print(<Muted>Opening {name}…</Muted>);
    }
    if (apps[name]) {
      os.open(apps[name]);
      return print(<Muted>Opening {name}…</Muted>);
    }
    print(
      <span className="text-tomato">
        open: no app or project called &quot;{target}&quot;
      </span>,
      <Muted>
        Try: {Object.keys(apps).slice(0, 8).join(", ")}, or a project like{" "}
        {projectSlugs[0]}
      </Muted>,
    );
  };

  const run = (raw: string) => {
    const command = raw.trim();
    print(
      <>
        <Accent>{prompt}</Accent> {raw}
      </>,
    );
    if (!command) return;
    setHistory((current) => [...current, command]);
    const [name, ...args] = command.split(/\s+/);
    const rest = args.join(" ");

    switch (name.toLowerCase()) {
      case "help":
        return print(
          ...commands.map(([command, description]) => (
            <>
              <Accent>{command.padEnd(13, " ")}</Accent>
              {description}
            </>
          )),
          <Muted>There are a few hidden ones too.</Muted>,
        );
      case "whoami":
        return print("Ahmad Zacky, a.k.a. RugeFX.", intro);
      case "about":
        return print(...bio);
      case "cat":
        if (/^readme(\.txt)?$/i.test(rest)) return print(...bio);
        return print(
          <span className="text-tomato">
            cat: {rest || "(nothing)"}: no such file
          </span>,
        );
      case "ls":
        if (/^projects\/?$/.test(rest)) {
          return print(projectSlugs.map((slug) => `${slug}/`).join("  "));
        }
        return print(
          "readme.txt  projects/  work-history/  skills.exe  resume.doc",
        );
      case "projects":
        return print(
          ...projects.map((project) => (
            <>
              <Accent>{project.slug.padEnd(15, " ")}</Accent>
              {project.summary}
            </>
          )),
          <Muted>
            Type <Accent>open {projects[0].slug}</Accent> to take a look.
          </Muted>,
        );
      case "open":
        return rest ? openTarget(rest) : print("usage: open <app or project>");
      case "experience":
      case "work":
        return print(
          ...workExperiences.map((job) => (
            <>
              <Muted>{job.duration.padEnd(21, " ")}</Muted>
              {job.position} @ <Accent>{job.company}</Accent>
            </>
          )),
        );
      case "skills":
        return print(
          mainSkills.map(({ name }) => name).join(", "),
          <Muted>
            …and {extraSkills.length} more. Try <Accent>open skills</Accent>.
          </Muted>,
        );
      case "contact":
      case "email":
        void navigator.clipboard?.writeText(CONTACT_EMAIL).catch(() => {});
        return print(
          <>
            <ExternalLink href={`mailto:${CONTACT_EMAIL}`}>
              {CONTACT_EMAIL}
            </ExternalLink>{" "}
            <Muted>(copied to your clipboard)</Muted>
          </>,
        );
      case "resume":
        return openTarget("resume");
      case "socials":
      case "links":
        return print(
          ...ELSEWHERE_LINKS.map((link) => (
            <>
              {link.label.padEnd(12, " ")}
              <ExternalLink href={link.href}>{link.href}</ExternalLink>
            </>
          )),
        );
      case "github":
        print(<Muted>Fetching from GitHub…</Muted>);
        loadGithubContributions().then(
          ({ days }) => {
            const stats = contributionStats(days);
            const recent = days.slice(
              -12 * 7 -
                new Date(`${days.at(-1)!.date}T00:00:00Z`).getUTCDay() -
                1,
            );
            // Weeks run left to right, Sunday to Saturday top to bottom.
            const shades = [" ·", " ░", " ▒", " ▓", " █"];
            const rows = Array.from({ length: 7 }, (_, weekday) =>
              recent
                .filter(
                  (day) =>
                    new Date(`${day.date}T00:00:00Z`).getUTCDay() === weekday,
                )
                .map((day) => shades[day.level] ?? shades[0])
                .join(""),
            );
            print(
              <pre className="text-mint">{rows.join("\n")}</pre>,
              `${stats.total.toLocaleString("en-US")} contributions in the last year, longest streak ${stats.longestStreak} days.`,
              <ExternalLink href={`https://github.com/${GITHUB_USERNAME}`}>
                github.com/{GITHUB_USERNAME}
              </ExternalLink>,
            );
          },
          () =>
            print(
              <span className="text-tomato">
                github: couldn&apos;t reach GitHub right now
              </span>,
            ),
        );
        return;
      case "neofetch":
        return print(
          <Neofetch
            uptime={Math.max(1, Math.round((Date.now() - startedAt) / 60000))}
            theme={theme}
          />,
        );
      case "theme": {
        const next =
          args[0] === "light" || args[0] === "dark"
            ? args[0]
            : theme === "dark"
              ? "light"
              : "dark";
        setTheme(next);
        return print(<Muted>Theme set to {next}.</Muted>);
      }
      case "sound": {
        const wanted =
          args[0] === "on" ? true : args[0] === "off" ? false : !soundEnabled;
        if (wanted !== soundEnabled) toggleSound();
        return print(<Muted>Sound effects {wanted ? "on" : "off"}.</Muted>);
      }
      case "date": {
        const now = new Date();
        const time = formatter.format(now);
        return print(
          `${time} in ${SITE_LOCATION.city} (${SITE_LOCATION.timeZoneLabel})`,
          <Muted>
            Zacky is{" "}
            {localMood(
              new Intl.DateTimeFormat("en-GB", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
                timeZone: SITE_LOCATION.timeZone,
              }).format(now),
            )}
          </Muted>,
        );
      }
      case "echo":
        return print(rest);
      case "history":
        return print(
          ...[...history, command].map(
            (entry, index) => `${String(index + 1).padStart(3, " ")}  ${entry}`,
          ),
        );
      case "clear":
      case "cls":
        return setLines([]);
      case "exit":
        return close();
      case "shutdown":
        return os.shutDown();
      case "kopi":
      case "coffee":
        return print(
          <pre className="text-sun">
            {"   ( (\n    ) )\n  ........\n  |      |]\n  \\      /\n   `----'"}
          </pre>,
          "Kopi brewed. Productivity restored to 100%.",
        );
      case "okayu":
      case "mogu":
        return print(
          <span className="text-[#c9a8f5]">Mogu mogu~ 🍙</span>,
          <Muted>Someone purple is snacking on the front hill.</Muted>,
        );
      case "hire-me":
        return print(
          <span className="text-tomato">hire-me: permission denied</span>,
          <Muted>
            Maybe try <Accent>sudo hire-me</Accent>?
          </Muted>,
        );
      case "sudo":
        if (/^hire[- ]?me$/i.test(rest)) {
          rain();
          play("tada");
          window.setTimeout(() => os.open("mail"), 900);
          return print(
            "[sudo] password for recruiter: ********",
            <Accent>Permission granted. Opening Mail…</Accent>,
          );
        }
        return print(
          <span className="text-tomato">
            Nice try. This incident will be reported to the kopi machine.
          </span>,
        );
      case "rm":
        return print(
          <span className="text-tomato">
            rm: RugeOS is held together by kopi and hope. Let&apos;s not.
          </span>,
        );
      default:
        return print(
          <span className="text-tomato">
            rugesh: command not found: {name}
          </span>,
          <Muted>
            Type <Accent>help</Accent> to see what&apos;s here.
          </Muted>,
        );
    }
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (
      !event.repeat &&
      (event.key.length === 1 || /^(Enter|Backspace|Tab)$/.test(event.key))
    ) {
      play("key");
    }
    if (event.key === "Enter") {
      run(input);
      setInput("");
      setRecall(null);
    } else if (event.key === "ArrowUp" || event.key === "ArrowDown") {
      if (!history.length) return;
      event.preventDefault();
      const index =
        event.key === "ArrowUp"
          ? Math.max(0, (recall ?? history.length) - 1)
          : (recall ?? history.length) + 1;
      if (index >= history.length) {
        setRecall(null);
        setInput("");
      } else {
        setRecall(index);
        setInput(history[index]);
      }
    } else if (event.key === "Tab" && input.trim()) {
      event.preventDefault();
      const match = completions.find((option) =>
        option.startsWith(input.trimStart()),
      );
      const target = input.match(/^open\s+(\S*)$/)?.[1];
      const openMatch =
        target !== undefined &&
        [...projectSlugs, ...Object.keys(apps)].find((option) =>
          option.startsWith(target),
        );
      if (openMatch) setInput(`open ${openMatch}`);
      else if (match) setInput(match);
    } else if (event.key === "l" && event.ctrlKey) {
      event.preventDefault();
      setLines([]);
    }
  };

  return (
    <div
      ref={scrollRef}
      className="bevel-in bg-terminal text-terminal-ink retro-scroll min-h-0 flex-1 overflow-y-auto p-3 font-mono text-[13px] leading-relaxed select-text"
      onClick={() => {
        if (!window.getSelection()?.toString()) inputRef.current?.focus();
      }}
    >
      <div role="log" aria-live="polite" aria-label="Terminal output">
        {lines.map(({ id, content }) => (
          <div key={id} className="break-words whitespace-pre-wrap">
            {content}
          </div>
        ))}
      </div>
      <label className="flex gap-2">
        <span className="text-mint shrink-0">{prompt}</span>
        <span className="sr-only">Command</span>
        <input
          ref={inputRef}
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={onKeyDown}
          spellCheck={false}
          autoCapitalize="off"
          autoComplete="off"
          autoCorrect="off"
          enterKeyHint="send"
          className="caret-mint min-w-0 flex-1 bg-transparent outline-none"
        />
      </label>
    </div>
  );
}

const logo = [
  "  ▄▄▄▄▄▄▄▄▄▄▄  ",
  "  █ ██████  █  ",
  "  █ ██   ██ █  ",
  "  █ ██   ██ █  ",
  "  █ ██████  █  ",
  "  █ ██  ██  █  ",
  "  █ ██   ██ █  ",
  "  ▀▀▀▀▀▀▀▀▀▀▀  ",
];

function Neofetch({ uptime, theme }: { uptime: number; theme: string }) {
  const info: [string, string][] = [
    ["OS", "RugeOS 26.11 (Bekasi edition)"],
    ["Host", "rugefx.dev"],
    ["Kernel", "React 19 + TanStack Start"],
    ["Uptime", `${uptime} min${uptime === 1 ? "" : "s"}`],
    ["Shell", "rugesh 1.0"],
    ["Theme", `Lilac (${theme})`],
    ["Packages", `${mainSkills.length + extraSkills.length} skills`],
    ["CPU", "Kopi-powered, 1 core"],
    ["Memory", `${projects.length} projects / ∞ ideas`],
  ];

  return (
    <div className="my-1 flex flex-wrap gap-x-4 gap-y-2">
      <pre className="text-[#b38cff]">{logo.join("\n")}</pre>
      <div>
        <p>
          <Accent>zacky</Accent>@<Accent>rugeos</Accent>
        </p>
        <p>------------</p>
        {info.map(([key, value]) => (
          <p key={key}>
            <Accent>{key}</Accent>: {value}
          </p>
        ))}
        <p className="mt-1 flex">
          {[
            "bg-brand",
            "bg-sun",
            "bg-mint",
            "bg-sky",
            "bg-tomato",
            "bg-pink",
          ].map((color) => (
            <span key={color} className={`${color} h-3 w-6`} />
          ))}
        </p>
      </div>
    </div>
  );
}
