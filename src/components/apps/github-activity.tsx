import { useMemo, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import {
  buttonClass,
  groupClass,
  groupLegendClass,
  screenClass,
} from "@/components/os/retro";
import { useGithubContributions } from "@/hooks/use-github-contributions";
import {
  GITHUB_USERNAME,
  contributionStats,
  describeDay,
  formatDay,
  type ContributionDay,
} from "@/lib/github-contributions";
import { cn } from "@/lib/utils";

const levels = ["#1b2a24", "#1f5a44", "#2b8a62", "#36b47e", "#43d9a0"];
const cell = 10;
const step = 12;
const left = 26;
const top = 14;
const monthFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  timeZone: "UTC",
});

/** The last year of GitHub contributions, drawn like a monitor readout. */
export default function GithubActivity() {
  const state = useGithubContributions();
  const profile = `https://github.com/${GITHUB_USERNAME}`;

  return (
    <div className="retro-scroll @container min-h-0 flex-1 space-y-5 overflow-y-auto pt-2.5">
      <div className={groupClass}>
        <span className={groupLegendClass}>GitHub contributions</span>
        {state.status === "ready" ? (
          <>
            <Heatmap days={state.data.days} className="hidden @lg:block" />
            {/* Narrow windows and phones get the last six months, bigger. */}
            <Heatmap
              days={recentWeeks(state.data.days, 26)}
              className="@lg:hidden"
            />
          </>
        ) : (
          <div
            className={cn(screenClass, "grid h-32 place-items-center")}
            role="status"
          >
            {state.status === "loading" ? (
              <span>
                Fetching from GitHub
                <span className="animate-blink">_</span>
              </span>
            ) : (
              <span className="text-tomato">
                Couldn&apos;t reach GitHub right now.
              </span>
            )}
          </div>
        )}
      </div>

      {state.status === "ready" && <Totals days={state.data.days} />}

      <div className="flex justify-end">
        <a
          href={profile}
          target="_blank"
          rel="noreferrer"
          className={buttonClass}
        >
          Open on GitHub
          <ArrowUpRight aria-hidden="true" />
        </a>
      </div>
    </div>
  );
}

function recentWeeks(days: ContributionDay[], weeks: number) {
  const lastWeekday = new Date(`${days.at(-1)!.date}T00:00:00Z`).getUTCDay();
  return days.slice(-((weeks - 1) * 7 + lastWeekday + 1));
}

interface HeatmapProps {
  days: ContributionDay[];
  className?: string;
}

function Heatmap({ days, className }: HeatmapProps) {
  const [hovered, setHovered] = useState<ContributionDay | null>(null);
  const layout = useMemo(() => {
    // Columns are weeks starting on Sunday, like GitHub's own calendar.
    const firstWeekday = new Date(`${days[0].date}T00:00:00Z`).getUTCDay();
    const cells = days.map((day, index) => ({
      day,
      column: Math.floor((index + firstWeekday) / 7),
      row: (index + firstWeekday) % 7,
    }));
    const months = cells
      .filter(({ day, row }, index) => {
        const date = Number(day.date.slice(8));
        return index === 0 ? row === 0 && date <= 7 : date === 1;
      })
      // A label in the last couple of columns would run off the edge.
      .filter(
        ({ column }, _, all) =>
          column <= (cells.at(-1)?.column ?? 0) - 2 || all.length === 1,
      )
      .map(({ day, column }) => ({
        column,
        label: monthFormatter.format(new Date(`${day.date}T00:00:00Z`)),
      }));
    return { cells, months, columns: (cells.at(-1)?.column ?? 0) + 1 };
  }, [days]);
  const latest = days.at(-1)!;

  return (
    <div className={cn(screenClass, className)}>
      <svg
        viewBox={`0 0 ${left + layout.columns * step} ${top + 7 * step}`}
        className="block w-full"
        shapeRendering="crispEdges"
        role="img"
        aria-label={`GitHub contributions from ${formatDay(days[0].date)} to ${formatDay(latest.date)}`}
        onPointerLeave={() => setHovered(null)}
      >
        {layout.months.map(({ column, label }) => (
          <text
            key={`${label}-${column}`}
            x={left + column * step}
            y={9}
            className="fill-mint/70 font-mono text-[9px]"
          >
            {label}
          </text>
        ))}
        {["Mon", "Wed", "Fri"].map((label, index) => (
          <text
            key={label}
            x={0}
            y={top + (index * 2 + 1) * step + 8.5}
            className="fill-mint/70 font-mono text-[9px]"
          >
            {label}
          </text>
        ))}
        {layout.cells.map(({ day, column, row }) => (
          <rect
            key={day.date}
            x={left + column * step}
            y={top + row * step}
            width={cell}
            height={cell}
            fill={levels[day.level] ?? levels[0]}
            stroke={hovered === day ? "#ffffff" : undefined}
            strokeWidth={hovered === day ? 1.5 : undefined}
            onPointerEnter={() => setHovered(day)}
          >
            <title>{describeDay(day)}</title>
          </rect>
        ))}
      </svg>
      <div className="mt-1 flex flex-wrap items-center justify-between gap-2 px-1">
        <span aria-live="polite">{describeDay(hovered ?? latest)}</span>
        <span className="flex items-center gap-1" aria-hidden="true">
          Less
          {levels.map((color) => (
            <span
              key={color}
              className="size-2.5"
              style={{ backgroundColor: color }}
            />
          ))}
          More
        </span>
      </div>
    </div>
  );
}

function Totals({ days }: { days: ContributionDay[] }) {
  const stats = contributionStats(days);
  const rows = [
    ["Contributions", stats.total.toLocaleString("en-US")],
    [
      "Current streak",
      `${stats.currentStreak} day${stats.currentStreak === 1 ? "" : "s"}`,
    ],
    [
      "Longest streak",
      `${stats.longestStreak} day${stats.longestStreak === 1 ? "" : "s"}`,
    ],
    [
      "Busiest day",
      stats.busiest
        ? `${stats.busiest.count} on ${formatDay(stats.busiest.date)}`
        : "Not yet",
    ],
  ];

  return (
    <div className={groupClass}>
      <span className={groupLegendClass}>Totals</span>
      <dl className="grid grid-cols-[1fr_auto] gap-x-6 gap-y-1 text-sm">
        {rows.map(([term, value]) => (
          <div key={term} className="contents">
            <dt>{term}</dt>
            <dd className="text-right font-mono tabular-nums">{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
