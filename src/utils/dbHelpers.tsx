// src/utils/dbHelpers.ts
import { db, WorkoutEntry, SetEntry } from "@/db";

export async function saveExerciseEntry(
  weekKey: string,
  dayLabel: string,
  exerciseName: string,
  sets: SetEntry[],
  completed = false
) {
  const exerciseKey = `${dayLabel}::${exerciseName}`;
  const now = Date.now();

  // Upsert: if entry exists replace sets + timestamp
  const existing = await db.workouts.where({ exerciseKey, weekKey }).first();
  if (existing) {
    await db.workouts.update(existing.id!, {
      sets,
      completed,
      updatedAt: now,
    });
    return existing.id;
  } else {
    const id = await db.workouts.add({
      weekKey,
      dayLabel,
      exerciseKey,
      exerciseName,
      sets,
      completed,
      updatedAt: now,
    });
    return id;
  }
}

export async function loadWeekEntries(weekKey: string) {
  const rows = await db.workouts.where("weekKey").equals(weekKey).toArray();
  // produce an object keyed by exerciseKey to match existing shape
  const out: Record<string, any> = {};
  rows.forEach((r) => {
    out[r.exerciseKey] = {
      completed: !!r.completed,
      sets: r.sets,
      updatedAt: r.updatedAt,
    };
  });
  // include outdoor key if present
  return out;
}

export async function searchHistoryForExercise(exerciseName: string) {
  // Returns array of workout entries for this exercise sorted newest -> oldest
  const rows = await db.workouts
    .where("exerciseName")
    .equals(exerciseName)
    .reverse()
    .toArray();
  return rows;
}

export async function clearAllData() {
  await db.workouts.clear();
  await db.photos.clear();
  await db.measurements.clear();
}
