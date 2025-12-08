export function computeSuggestedWeightFromHistory(history: any[], exerciseName: string, repRange: string) {
  try {
    if (!history || !Array.isArray(history) || history.length === 0) return "—";

    const relevant = history
      .flatMap((week: any) => {
        if (!week || typeof week !== "object") return [];
        return Object.entries(week);
      })
      .filter(([key]) => typeof key === "string" && key.includes(`::${exerciseName}`))
      .map(([_, val]: any) => val)
      .filter((val) => val && val.sets);

    if (relevant.length === 0) return "—";

    const lastEntry = [...relevant].reverse().find((e) => Array.isArray(e.sets) && e.sets.length > 0);
    if (!lastEntry) return "—";

    const weights = lastEntry.sets
      .map((s: any) => parseFloat(s?.weight))
      .filter((w: number) => !isNaN(w));

    const reps = lastEntry.sets
      .map((s: any) => parseInt(s?.reps))
      .filter((r: number) => !isNaN(r));

    const pains = lastEntry.sets.map((s: any) => parseInt(s?.pain) || 0);

    if (weights.length === 0) return "—";

    const avgWeight = weights.reduce((a, b) => a + b, 0) / weights.length;
    const avgReps = reps.length ? reps.reduce((a, b) => a + b, 0) / reps.length : null;
    const avgPain = pains.reduce((a, b) => a + b, 0) / pains.length;

    if (avgPain >= 5) return `${avgWeight.toFixed(0)} lbs (pain-limited)`;

    const repHighEnd = parseInt(repRange.split("–")[1]);
    if (repHighEnd && avgReps && avgReps >= repHighEnd)
      return `${(avgWeight + 5).toFixed(0)} lbs`;

    return `${avgWeight.toFixed(0)} lbs`;

  } catch (err) {
    console.error("Suggested weight error:", err);
    return "—";
  }
}

