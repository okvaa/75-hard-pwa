// src/dayCounter.ts
// Utilities to manage the global Hard-75 day counter and compute week mapping.

export const HARD75_LS_KEY = "hard75Day";

/**
 * Get the current Hard-75 day from localStorage.
 * If none exists, returns the provided fallback (default 131).
 */
export function getHard75Day(fallback = 131): number {
  try {
    const raw = localStorage.getItem(HARD75_LS_KEY);
    if (!raw) return fallback;
    const n = parseInt(raw, 10);
    return isNaN(n) ? fallback : n;
  } catch {
    return fallback;
  }
}

/**
 * Set the current Hard-75 day into localStorage
 */
export function setHard75Day(day: number) {
  if (typeof day !== "number" || Number.isNaN(day)) return;
  localStorage.setItem(HARD75_LS_KEY, String(day));
}

/**
 * Build a mapping of week number -> starting day.
 * We anchor Week 20 to START_DAY (defaults to 131).
 * Weeks before/after are +/ - 7-day offsets.
 *
 * Returns an object like { 2: 15, 3: 22, ..., 20:131, 21:138 }
 */
export function buildWeekStarts(anchorWeek = 20, anchorDay = 131, minWeek = 2, maxWeek = 30) {
  const map: Record<string, number> = {};
  for (let w = minWeek; w <= maxWeek; w++) {
    const day = anchorDay + (w - anchorWeek) * 7;
    map[`Week ${w}`] = day;
  }
  return map;
}

/**
 * Given a Hard-75 day and the weekStarts mapping, find which week
 * it belongs to. If day is earlier than the earliest week start,
 * returns the earliest week. If later than last, returns last.
 */
export function weekForDay(day: number, weekStarts: Record<string, number>) {
  const entries = Object.entries(weekStarts)
    .map(([week, start]) => ({ week, start }))
    .sort((a, b) => a.start - b.start);

  // If day is before first start, return first
  if (day <= entries[0].start) return entries[0].week;

  // Find the greatest week.start <= day
  for (let i = entries.length - 1; i >= 0; i--) {
    if (day >= entries[i].start) return entries[i].week;
  }
  return entries[0].week;
}
