const START_DATE = new Date("2025-07-08T00:00:00");

export function getHard75Day(): number {
  const today = new Date();

  // normalize to midnight
  today.setHours(0, 0, 0, 0);

  const diffMs = today.getTime() - START_DATE.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  return diffDays + 1; // July 8 = Day 1
}
