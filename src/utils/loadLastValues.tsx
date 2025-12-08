export function loadLastValues(exerciseKey: string) {
  const keys = Object.keys(localStorage)
    .filter((k) => k.includes(exerciseKey) && k !== exerciseKey);

  if (keys.length === 0) return null;

  const lastKey = keys.sort().slice(-1)[0];
  const data = JSON.parse(localStorage.getItem(lastKey) || "{}");

  if (!data.sets) return null;

  const weights = data.sets
    .map((s: any) => parseFloat(s.weight))
    .filter((n: number) => !isNaN(n));

  if (weights.length === 0) return null;

  return Math.round(
    weights.reduce((a: number, b: number) => a + b, 0) / weights.length
  );
}
