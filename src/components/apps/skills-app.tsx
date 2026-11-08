import { useEffect, useId, useMemo, useState } from "react";
import GithubActivity from "@/components/apps/github-activity";
import {
  buttonClass,
  fieldClass,
  groupClass,
  groupLegendClass,
  screenClass,
} from "@/components/os/retro";
import { extraSkills, mainSkills, processName } from "@/content/about";
import { projects } from "@/content/portfolio";
import { useOS } from "@/contexts/os-context";
import { usePlayground } from "@/contexts/playground-context";
import { cn } from "@/lib/utils";

const languages = [
  "JavaScript",
  "PHP",
  "Go",
  "Python",
  "Java",
  "C#",
  "Rust",
  "C++",
];
const frameworks = [
  "Next.js",
  "NestJS",
  "Hono",
  "Fastify",
  "Hapi",
  "Gin",
  "Fiber",
  "Axum",
  "Tailwind CSS",
];

interface Process {
  name: string;
  image: string;
  description: string;
  load: number;
  memory: number;
  kind: "skill" | "kopi" | "bugs";
}

const baseProcesses: Process[] = [
  {
    name: "Kopi",
    image: "kopi.exe",
    description: "Fuel. Critical system process",
    load: 6,
    memory: 512,
    kind: "kopi",
  },
  ...mainSkills.map((skill, index) => ({
    name: skill.name,
    image: processName(skill.name),
    description: skill.description,
    load: skill.load,
    memory: 420 - index * 34,
    kind: "skill" as const,
  })),
  {
    name: "Bugs",
    image: "bugs.exe",
    description: "Being squashed",
    load: 1,
    memory: 13,
    kind: "bugs",
  },
  ...extraSkills.map((name, index) => ({
    name,
    image: processName(name),
    description: languages.includes(name)
      ? "Language"
      : frameworks.includes(name)
        ? "Framework"
        : "Tool",
    load: 0,
    memory: 64 - (index % 6) * 8,
    kind: "skill" as const,
  })),
];

const idleLoad = baseProcesses.reduce((sum, { load }) => sum + load, 0);

const tabs = [
  { id: "processes", label: "Processes" },
  { id: "performance", label: "Performance" },
  { id: "github", label: "GitHub" },
] as const;

type SortKey = "image" | "description" | "load" | "memory";

const columns: { key: SortKey; label: string; numeric?: boolean }[] = [
  { key: "image", label: "Image Name" },
  { key: "description", label: "Description" },
  { key: "load", label: "CPU", numeric: true },
  { key: "memory", label: "Mem Usage", numeric: true },
];

// Live CPU numbers jiggle around each process's usual load.
function useJitter(processes: Process[]) {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setTick((value) => value + 1), 1400);
    return () => clearInterval(interval);
  }, []);

  return useMemo(() => {
    if (tick === 0) return processes.map(({ load }) => load);
    return processes.map(({ load }) =>
      Math.max(
        0,
        Math.round(load + (Math.random() - 0.5) * Math.max(2, load * 0.6)),
      ),
    );
  }, [processes, tick]);
}

export default function SkillsApp() {
  const id = useId();
  const [tab, setTab] = useState<(typeof tabs)[number]["id"]>("processes");
  const [processes, setProcesses] = useState(baseProcesses);
  const [selected, setSelected] = useState<string | null>(null);
  const [sort, setSort] = useState<{ key: SortKey; descending: boolean }>({
    key: "load",
    descending: true,
  });
  const cpu = useJitter(processes);
  const [history, setHistory] = useState<number[]>(() =>
    Array(40).fill(idleLoad),
  );
  const { showDialog } = useOS();
  const { play, toast } = usePlayground();
  const total = Math.min(
    100,
    cpu.reduce((sum, value) => sum + value, 0),
  );

  useEffect(() => {
    setHistory((values) => [...values.slice(1), total]);
  }, [total, cpu]);

  const rows = processes
    .map((process, index) => ({ ...process, cpu: cpu[index] }))
    .sort((a, b) => {
      const key = sort.key === "load" ? "cpu" : sort.key;
      const order =
        typeof a[key] === "number"
          ? (a[key] as number) - (b[key] as number)
          : String(a[key]).localeCompare(String(b[key]));
      return sort.descending ? -order : order;
    });

  const endTask = () => {
    const process = processes.find(({ image }) => image === selected);
    if (!process) return;
    if (process.kind === "bugs") {
      setProcesses((current) => current.filter((other) => other !== process));
      setSelected(null);
      play("tada");
      toast("bugs.exe terminated. Good riddance.");
      return;
    }
    showDialog(
      process.kind === "kopi"
        ? {
            title: "Unable to Terminate Process",
            icon: "error",
            message:
              "kopi.exe is a critical system process. Ending it would stop RugeOS (and Zacky) from working.",
          }
        : {
            title: "Task Manager Warning",
            icon: "warning",
            message:
              process.load > 0
                ? `${process.image} is load-bearing. Zacky reaches for ${process.name} all the time, so it stays running.`
                : `${process.image} is resting, not idle. ${process.name} comes in handy more often than you'd think.`,
          },
    );
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col p-2">
      <div
        role="tablist"
        aria-label="Task Manager"
        className="relative z-10 -mb-px flex shrink-0 pt-0.5 pl-0.5"
      >
        {tabs.map(({ id: name, label }) => (
          <button
            key={name}
            type="button"
            role="tab"
            id={`${id}-${name}`}
            aria-selected={tab === name}
            aria-controls={`${id}-panel`}
            onClick={() => setTab(name)}
            className={cn(
              "bg-face px-3 text-sm shadow-[inset_1px_1px_var(--color-face-hi),inset_-1px_0_var(--color-face-dk),inset_-2px_0_var(--color-face-lo)]",
              tab === name
                ? "relative -mx-0.5 -mt-0.5 h-8 px-4 font-semibold"
                : "mt-0.5 h-7",
            )}
          >
            {label}
          </button>
        ))}
      </div>

      <div
        role="tabpanel"
        id={`${id}-panel`}
        aria-labelledby={`${id}-${tab}`}
        className="bevel flex min-h-0 flex-1 flex-col p-3"
      >
        {tab === "processes" ? (
          <>
            <div
              className={cn(
                fieldClass,
                "retro-scroll min-h-0 flex-1 overflow-auto p-0.5",
              )}
            >
              <table className="w-full border-collapse text-left text-[13px]">
                <thead>
                  <tr>
                    {columns.map((column) => (
                      <th
                        key={column.key}
                        scope="col"
                        aria-sort={
                          sort.key === column.key
                            ? sort.descending
                              ? "descending"
                              : "ascending"
                            : undefined
                        }
                        className="bg-face sticky top-0 p-0 font-normal"
                      >
                        <button
                          type="button"
                          className={cn(
                            "bevel active:bevel-pressed w-full px-2 py-1 whitespace-nowrap",
                            column.numeric ? "text-right" : "text-left",
                          )}
                          onClick={() =>
                            setSort((current) => ({
                              key: column.key,
                              descending:
                                current.key === column.key
                                  ? !current.descending
                                  : Boolean(column.numeric),
                            }))
                          }
                        >
                          {column.label}
                          {sort.key === column.key &&
                            (sort.descending ? " ▾" : " ▴")}
                        </button>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr
                      key={row.image}
                      aria-selected={selected === row.image}
                      onClick={() => setSelected(row.image)}
                      className={cn(
                        "cursor-default",
                        selected === row.image && "bg-brand text-on-brand",
                      )}
                    >
                      <td className="px-2 py-0.5 font-mono whitespace-nowrap">
                        {row.image}
                      </td>
                      <td className="px-2 py-0.5 whitespace-nowrap">
                        {row.description}
                      </td>
                      <td className="px-2 py-0.5 text-right font-mono tabular-nums">
                        {String(row.cpu).padStart(2, "0")}
                      </td>
                      <td className="px-2 py-0.5 text-right font-mono whitespace-nowrap tabular-nums">
                        {row.memory.toLocaleString("en-US")} K
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex shrink-0 justify-end pt-3">
              <button
                type="button"
                className={buttonClass}
                disabled={!selected}
                onClick={endTask}
              >
                End Task
              </button>
            </div>
          </>
        ) : tab === "performance" ? (
          <Performance history={history} total={total} />
        ) : (
          <GithubActivity />
        )}
      </div>

      <div className="mt-0.5 flex shrink-0 gap-0.5 text-xs">
        <span className="bevel-thin px-2 py-1">
          Processes: {processes.length}
        </span>
        <span className="bevel-thin px-2 py-1 tabular-nums">
          CPU Usage: {total}%
        </span>
        <span className="bevel-thin flex-1 px-2 py-1">Kopi: hot</span>
      </div>
    </div>
  );
}

interface PerformanceProps {
  history: number[];
  total: number;
}

function Performance({ history, total }: PerformanceProps) {
  const points = history
    .map(
      (value, index) =>
        `${(index / (history.length - 1)) * 100},${100 - value}`,
    )
    .join(" ");
  const stats = [
    ["Projects shipped", projects.length],
    ["Apps in the stores", 1],
    ["Languages", languages.length],
    [
      "Tools and frameworks",
      mainSkills.length + extraSkills.length - languages.length,
    ],
  ] as const;

  return (
    <div className="retro-scroll @container min-h-0 flex-1 space-y-5 overflow-y-auto pt-2.5">
      <div className="grid gap-3 @md:grid-cols-[120px_1fr]">
        <div className={groupClass}>
          <span className={groupLegendClass}>Kopi Level</span>
          <Meter value={82} label="82%" />
        </div>
        <div className={groupClass}>
          <span className={groupLegendClass}>CPU Usage History</span>
          <Graph points={points} label={`${total}%`} />
        </div>
      </div>
      <div className={groupClass}>
        <span className={groupLegendClass}>Totals</span>
        <dl className="grid grid-cols-[1fr_auto] gap-x-6 gap-y-1 text-sm">
          {stats.map(([term, value]) => (
            <div key={term} className="contents">
              <dt>{term}</dt>
              <dd className="text-right font-mono tabular-nums">{value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}

const meterClass = cn(screenClass, "h-28");

function Meter({ value, label }: { value: number; label: string }) {
  return (
    <div
      className={cn(
        meterClass,
        "flex flex-col items-center justify-end gap-1 pb-1.5",
      )}
    >
      <div
        aria-hidden="true"
        className="w-10 flex-1 bg-[repeating-linear-gradient(0deg,#43d9a0_0_3px,transparent_3px_5px)] [mask-image:linear-gradient(to_top,#000_var(--level),transparent_var(--level))]"
        style={{ ["--level" as string]: `${value}%` }}
      />
      <span>{label}</span>
    </div>
  );
}

function Graph({ points, label }: { points: string; label: string }) {
  return (
    <div className={meterClass}>
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden="true"
        className="size-full"
      >
        {Array.from({ length: 9 }, (_, index) => (
          <g
            key={index}
            stroke="#1f5a44"
            strokeWidth="0.6"
            vectorEffect="non-scaling-stroke"
          >
            <line
              x1={(index + 1) * 10}
              x2={(index + 1) * 10}
              y1="0"
              y2="100"
              vectorEffect="non-scaling-stroke"
            />
            <line
              y1={(index + 1) * 10}
              y2={(index + 1) * 10}
              x1="0"
              x2="100"
              vectorEffect="non-scaling-stroke"
            />
          </g>
        ))}
        <polyline
          points={points}
          fill="none"
          stroke="#43d9a0"
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      <span className="absolute top-1 right-2">{label}</span>
    </div>
  );
}
