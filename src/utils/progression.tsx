export function getNextWeightRecommendation(history, repTargetMin, repTargetMax) {
  if (!history || history.length === 0) {
    return "No history yet — start with a comfortable weight.";
  }

  const last = history[history.length - 1];
  const lastReps = last.sets.map(s => Number(s.reps));
  const lastWeight = Number(last.sets[0].weight);

  const avgReps = lastReps.reduce((a,b)=>a+b,0) / lastReps.length;

  if (avgReps >= repTargetMax) {
    return `Increase weight next time. Suggested: ${Math.round(lastWeight * 1.05)} lbs`;
  }

  if (avgReps <= repTargetMin - 2) {
    return `Weight was too heavy. Suggested: ${Math.round(lastWeight * 0.95)} lbs`;
  }

  return "Keep the same weight next time.";
}
