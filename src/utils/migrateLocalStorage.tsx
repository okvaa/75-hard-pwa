// src/utils/migrateLocalStorage.ts
import { db, WorkoutEntry, SetEntry } from "@/db";

/**
 * Run once on app startup. Idempotent: sets localStorage flag when done.
 */
export async function migrateLocalStorageToDexie() {
  try {
    const MIGRATION_FLAG = "migrated_to_dexie_v1";
    if (localStorage.getItem(MIGRATION_FLAG)) return; // already migrated

    const keys = Object.keys(localStorage).filter((k) =>
      /^week\d+Progress/i.test(k) || /^week.*Progress/i.test(k)
    );

    for (const key of keys) {
      try {
        const raw = localStorage.getItem(key);
        if (!raw) continue;
        const parsed = JSON.parse(raw);
        if (!parsed || typeof parsed !== "object") continue;

        Object.entries(parsed).forEach(async ([exerciseKey, value]: any) => {
          if (!value) return;
          // exerciseKey is like `${day}::${exerciseName}` or `${day}::outdoor`
          const [dayLabel, exerciseName] = exerciseKey.split("::");
          if (!exerciseName) {
            // skip malformed
            return;
          }
          const sets: SetEntry[] = Array.isArray(value.sets)
            ? value.sets.map((s: any) => ({
                weight: s.weight ?? "",
                reps: s.reps ?? "",
                machine: s.machine ?? "",
                pain: typeof s.pain === "number" ? s.pain : 0,
              }))
            : [];

          await db.workouts.add({
            weekKey: key,
            dayLabel,
            exerciseKey,
            exerciseName,
            sets,
            completed: !!value.completed,
            updatedAt: Date.now(),
          });
        });
      } catch (err) {
        // ignore corrupt localStorage entries
        console.warn("Migration skip key (bad JSON)", key, err);
        continue;
      }
    }

    localStorage.setItem(MIGRATION_FLAG, "1");
    console.log("LocalStorage migration to Dexie finished.");
  } catch (err) {
    console.error("Migration failed:", err);
  }
}
