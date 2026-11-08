export interface ContributionDay {
  date: string;
  count: number;
  /** GitHub's own 0–4 shading level. */
  level: number;
}

export interface Contributions {
  days: ContributionDay[];
  fetchedAt: string;
}

export const GITHUB_USERNAME = "RugeFX";

/**
 * Reads GitHub's public contributions calendar. Each day is a `<td>` with a
 * date and level, and its count lives in the `<tool-tip>` that points at it.
 */
export function parseContributions(html: string): ContributionDay[] {
  const counts = new Map<string, number>();
  for (const [, id, label] of html.matchAll(
    /<tool-tip[^>]*\bfor="([^"]+)"[^>]*>([^<]*)<\/tool-tip>/g,
  )) {
    counts.set(
      id,
      Number(
        /^([\d,]+) contributions?/.exec(label)?.[1].replace(/,/g, "") ?? 0,
      ),
    );
  }

  const days: ContributionDay[] = [];
  for (const [cell] of html.matchAll(
    /<td[^>]*ContributionCalendar-day[^>]*>/g,
  )) {
    const date = /data-date="([\d-]+)"/.exec(cell)?.[1];
    const level = /data-level="(\d)"/.exec(cell)?.[1];
    const id = /\bid="([^"]+)"/.exec(cell)?.[1];
    if (!date || level === undefined) continue;
    days.push({
      date,
      level: Number(level),
      count: (id && counts.get(id)) || 0,
    });
  }
  return days.sort((a, b) => a.date.localeCompare(b.date));
}

export interface ContributionStats {
  total: number;
  currentStreak: number;
  longestStreak: number;
  busiest: ContributionDay | null;
}

export function contributionStats(days: ContributionDay[]): ContributionStats {
  let longestStreak = 0;
  let run = 0;
  let busiest: ContributionDay | null = null;
  for (const day of days) {
    run = day.count > 0 ? run + 1 : 0;
    longestStreak = Math.max(longestStreak, run);
    if (day.count > (busiest?.count ?? 0)) busiest = day;
  }
  // Today doesn't break the streak just because it isn't over yet.
  let currentStreak = 0;
  for (let index = days.length - 1; index >= 0; index -= 1) {
    if (days[index].count > 0) currentStreak += 1;
    else if (index !== days.length - 1) break;
  }
  return {
    total: days.reduce((sum, day) => sum + day.count, 0),
    currentStreak,
    longestStreak,
    busiest,
  };
}

const dayFormatter = new Intl.DateTimeFormat("en-US", {
  weekday: "short",
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

export function formatDay(date: string) {
  return dayFormatter.format(new Date(`${date}T00:00:00Z`));
}

export function describeDay(day: ContributionDay) {
  const count =
    day.count === 0
      ? "No contributions"
      : `${day.count} contribution${day.count === 1 ? "" : "s"}`;
  return `${count} on ${formatDay(day.date)}`;
}
