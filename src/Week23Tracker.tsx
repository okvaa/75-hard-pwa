// src/Week23Tracker.tsx
import { useState, useEffect } from "react";
import { Card, CardContent } from "./components/ui/card";
import { Checkbox } from "./components/ui/checkbox";
import { ScrollArea } from "./components/ui/scroll-area";
import { computeSuggestedWeightFromHistory } from "./utils/suggestedWeight";

type SetEntry = {
  weight: string;
  reps: string;
  machine: string;
  pain: number;
};

type ExerciseState = {
  completed?: boolean;
  sets: SetEntry[];
};

const week23Plan = [
  { day: "📅 Week 23 – December 8–14" },

  {
    day: "🔴 (153) Monday – Chest Strength",
    gym: [
      { name: "Incline Bench Press", sets: 4, repRange: "6–8" },
      { name: "Machine Chest Press", sets: 4, repRange: "10–12" },
      { name: "Cable Fly", sets: 3, repRange: "12–15" },
      { name: "Decline Push-ups", sets: 2, repRange: "AMRAP" },
    ],
    outdoor: "1-hour walk",
  },

  {
    day: "🔵 (154) Tuesday – Back (Spine Safe)",
    gym: [
      { name: "Chest-Supported Row", sets: 4, repRange: "8–12" },
      { name: "Lat Pulldown", sets: 4, repRange: "10–12" },
      { name: "Seated Cable Row", sets: 3, repRange: "10–12" },
      { name: "Face Pulls", sets: 3, repRange: "12–15" },
    ],
    outdoor: "1-hour walk",
  },

  {
    day: "🟣 (155) Wednesday – Legs (Disc Friendly)",
    gym: [
      { name: "Leg Press", sets: 4, repRange: "10–15" },
      { name: "Leg Extension", sets: 4, repRange: "12–15" },
      { name: "Seated Hamstring Curl", sets: 3, repRange: "12–15" },
      { name: "Standing Calf Raise", sets: 3, repRange: "15–20" },
    ],
    outdoor: "1-hour walk",
  },

  {
    day: "🟠 (156) Thursday – Shoulders + Arms",
    gym: [
      { name: "Seated DB Shoulder Press", sets: 4, repRange: "8–12" },
      { name: "Lateral Raises", sets: 4, repRange: "12–15" },
      { name: "Preacher Curl", sets: 3, repRange: "10–12" },
      { name: "Cable Triceps Pushdown", sets: 3, repRange: "12–15" },
    ],
    outdoor: "1-hour walk",
  },

  {
    day: "🟡 (157) Friday – Chest/Back Pump",
    gym: [
      { name: "Machine Chest Press", sets: 3, repRange: "12–15" },
      { name: "Cable Row", sets: 3, repRange: "12–15" },
      { name: "Machine Fly", sets: 3, repRange: "12–15" },
      { name: "Straight Arm Pulldown", sets: 3, repRange: "12–15" },
    ],
    outdoor: "1-hour walk",
  },

  {
    day: "🟢 (158) Saturday – Arms + Core",
    gym: [
      { name: "EZ-Bar Curl", sets: 3, repRange: "10–12" },
      { name: "Triceps Rope Extension", sets: 3, repRange: "10–12" },
      { name: "Hammer Curls", sets: 3, repRange: "10–12" },
      { name: "Cable Crunch", sets: 3, repRange: "12–15" },
    ],
    outdoor: "1-hour walk",
  },

  {
    day: "⚪ (159) Sunday – TRX + Recovery",
    gym: [
      { name: "TRX Row", sets: 3, repRange: "10–12" },
      { name: "TRX Chest Press", sets: 3, repRange: "10–12" },
      { name: "TRX Split Squat", sets: 3, repRange: "10–12 each leg" },
      { name: "TRX Core Fallout", sets: 3, repRange: "8–10" },
    ],
    outdoor: "1-hour walk",
  },
];

const safeParse = (key: string) => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    console.warn(`Failed to parse ${key} from localStorage — resetting.`, e);
    return null;
  }
};

const buildDefaultState = () => {
  const defaults: Record<string, ExerciseState> = {};
  week23Plan.forEach((block) => {
    block.gym.forEach((ex: any) => {
      const sets = Array.from({ length: ex.sets ?? 3 }).map(() => ({
        weight: "",
        reps: "",
        machine: "",
        pain: 0,
      }));
      defaults[`${block.day}::${ex.name}`] = {
        completed: false,
        sets,
      };
    });
    defaults[`${block.day}::outdoor`] = { completed: false, sets: [] };
  });
  return defaults;
};

const healStoredState = (
  stored: any,
  defaults: Record<string, ExerciseState>
): Record<string, ExerciseState> => {
  const healed: Record<string, ExerciseState> = { ...defaults };

  if (!stored || typeof stored !== "object") return healed;

  // Merge/repair per-key
  Object.entries(stored).forEach(([key, val]: any) => {
    if (!val || typeof val !== "object") return;
    const def = defaults[key] ?? { completed: false, sets: [] };

    // ensure sets exists and is an array
    const sets = Array.isArray(val.sets) ? val.sets : def.sets.map(() => ({ weight: "", reps: "", machine: "", pain: 0 }));

    // sanitize each set
    const newSets = sets.map((s: any) => ({
      weight: s && typeof s.weight === "string" ? s.weight : (s && s.weight != null ? String(s.weight) : ""),
      reps: s && typeof s.reps === "string" ? s.reps : (s && s.reps != null ? String(s.reps) : ""),
      machine: s && typeof s.machine === "string" ? s.machine : "",
      pain: s && typeof s.pain === "number" ? s.pain : (s && !isNaN(parseInt(s?.pain)) ? parseInt(s.pain) : 0),
    }));

    healed[key] = {
      completed: !!val.completed,
      sets: newSets.length > 0 ? newSets : def.sets,
    };
  });

  // ensure every default key exists
  Object.keys(defaults).forEach((k) => {
    if (!healed[k]) healed[k] = defaults[k];
  });

  return healed;
};

export default function Week23Tracker() {
  const [state, setState] = useState<Record<string, ExerciseState>>({});
  const [week22History, setWeek22History] = useState<any | null>(null);

  // load previous week history only (Week 22)
  useEffect(() => {
    const prev = safeParse("week22Progress");
    setWeek22History(prev);
  }, []);

  // load stored state, heal if necessary
  useEffect(() => {
    const raw = safeParse("week23Progress");
    const defaults = buildDefaultState();
    if (!raw) {
      setState(defaults);
      return;
    }
    const healed = healStoredState(raw, defaults);
    setState(healed);
  }, []);

  // persist
  useEffect(() => {
    try {
      localStorage.setItem("week23Progress", JSON.stringify(state));
    } catch (e) {
      console.warn("Failed to save week23Progress", e);
    }
  }, [state]);

  const toggle = (key: string) =>
    setState((prev) => ({ ...prev, [key]: { ...prev[key], completed: !prev[key]?.completed } }));

  const update = (key: string, index: number, field: keyof SetEntry, value: any) =>
    setState((prev) => {
      const entry = prev[key];
      if (!entry) return prev;
      const sets = entry.sets.map((s, i) => (i === index ? { ...s, [field]: value } : s));
      return { ...prev, [key]: { ...entry, sets } };
    });

  // machine input (move machine up under title)
  const updateMachineForExercise = (key: string, value: string) =>
    setState((prev) => {
      const entry = prev[key];
      if (!entry) return prev;
      const newSets = entry.sets.length ? [...entry.sets] : [{ weight: "", reps: "", machine: "", pain: 0 }];
      newSets[0] = { ...newSets[0], machine: value };
      return { ...prev, [key]: { ...entry, sets: newSets } };
    });

  return (
    <ScrollArea className="p-4 max-w-md mx-auto space-y-4">
      {week23Plan.map(({ day, gym, outdoor }) => (
        <Card key={day} className="rounded-xl shadow-md">
          <CardContent className="p-4">
            <h2 className="text-xl font-bold mb-3">{day}</h2>

            {gym.map((ex: any) => {
              const key = `${day}::${ex.name}`;
              const entry = state[key];

              // compute suggested weight using only week22 history (safe)
              const suggested = computeSuggestedWeightFromHistory(
                week22History ? [week22History] : [],
                ex.name,
                ex.repRange ?? ""
              );

              if (!entry) return null; // defensive

              return (
                <div key={key} className="border rounded p-2 mb-4">
                  <div className="flex items-center gap-2">
                    <Checkbox checked={!!entry.completed} onCheckedChange={() => toggle(key)} />
                    <div>
                      <div className="font-semibold">{ex.name}</div>
                    </div>
                  </div>

                  {/* MACHINE FIELD (moved under exercise title, above target) */}
                  <div className="mt-2">
                    <label className="text-xs text-gray-500 block mb-1">Machine / Station</label>
                    <input
                      type="text"
                      className="border rounded w-full px-2 py-1 text-sm"
                      value={entry.sets?.[0]?.machine ?? ""}
                      onChange={(e) => updateMachineForExercise(key, e.target.value)}
                    />
                  </div>

                  {/* Target + Suggested */}
                  <div className="text-xs mt-1 text-gray-600">Target: {ex.repRange ?? "—"}</div>
                  <div className="text-xs text-blue-600 mb-2">Suggested: {suggested}</div>

                  {/* SETS TABLE */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr>
                          <th className="text-left pr-2">Set</th>
                          <th className="text-left pr-2">Weight</th>
                          <th className="text-left pr-2">Reps</th>
                          <th className="text-left pr-2">Pain</th>
                        </tr>
                      </thead>
                      <tbody>
                        {entry.sets.map((s, i) => (
                          <tr key={i} className="align-top">
                            <td className="py-1 pr-2">{i + 1}</td>
                            <td className="py-1 pr-2">
                              <input
                                type="number"
                                className="border w-full px-1"
                                value={s.weight}
                                onChange={(e) => update(key, i, "weight", e.target.value)}
                              />
                            </td>
                            <td className="py-1 pr-2">
                              <input
                                type="number"
                                className="border w-full px-1"
                                value={s.reps}
                                onChange={(e) => update(key, i, "reps", e.target.value)}
                              />
                            </td>
                            <td className="py-1 pr-2">
                              <input
                                type="number"
                                min={0}
                                max={10}
                                className="border w-20 px-1"
                                value={s.pain}
                                onChange={(e) => update(key, i, "pain", Number(e.target.value))}
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })}

            {/* outdoor */}
            <div className="flex items-center gap-2">
              <Checkbox
                checked={!!state[`${day}::outdoor`]?.completed}
                onCheckedChange={() => toggle(`${day}::outdoor`)}
              />
              <div>{outdoor}</div>
            </div>
          </CardContent>
        </Card>
      ))}
    </ScrollArea>
  );
}
