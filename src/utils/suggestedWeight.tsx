// SAFARI-SAFE suggested weight engine

export function computeSuggestedWeightFromHistory(
  history: any[],
  exerciseName: string,
  repRange: string
) {
  if (!history || history.length === 0) return "—";

  let relevant: any[] = [];

  try {
    // History is an array of week objects: { "Day::Exercise": Entry }
    history.forEach((weekObj) => {
      Object.entries(weekObj).forEach(([key, val]) => {
        if (key.includes(`::${exerciseName}`)) {
          relevant.push(val);
        }
      });
    });
  } catch (err) {
    console.error("History parse error:", err);
    return "—";
  }

  if (relevant.length === 0) return "—";

  // Use newest history item first
  const lastEntry = relevant.reverse().find((e) => Array.isArray(e.sets));
  if (!lastEntry) return "—";

  // Extract weights safely
  const weights = lastEntry.sets
    .map((s: any) => parseFloat(s.weight))
    .filter((w) => !isNaN(w));

  if (weights.length === 0) return "—";

  const avgWeight =
    weights.reduce((a, b) => a + b, 0) / weights.length;

  // Extract reps safely
  const reps = lastEntry.sets
    .map((s: any) => parseInt(s.reps))
    .filter((r) => !isNaN(r));

  const avgReps =
    reps.length > 0 ? reps.reduce((a, b) => a + b, 0) / reps.length : null;

  // Extract pain (Safari-safe)
  const pains = lastEntry.sets.map((s: any) =>
    typeof s.pain === "number" ? s.pain : 0
  );

  const avgPain =
    pains.reduce((a, b) => a + b, 0) / pains.length;

  // Pain limits progression
  if (avgPain >= 5) return `${avgWeight.toFixed(0)} lbs (pain-limited)`;

  // Rep range detection
  let upperRep = null;

  if (repRange.includes("–")) {
    // Example "8–12"
    const parts = repRange.split("–");
    upperRep = parseInt(parts[1]);
  }

  if (upperRep && avgReps && avgReps >= upperRep) {
    return `${(avgWeight + 5).toFixed(0)} lbs`;
  }

  return `${avgWeight.toFixed(0)} lbs`;
}
