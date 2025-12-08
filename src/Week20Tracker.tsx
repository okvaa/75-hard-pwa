import { useState, useEffect } from "react";
import { Card, CardContent } from "./components/ui/card";
import { Checkbox } from "./components/ui/checkbox";
import { ScrollArea } from "./components/ui/scroll-area";

type SetEntry = { weight: string; reps: string };
type ExerciseState = { completed?: boolean; machine?: string; sets: SetEntry[] };

const START_DAY = 131;

const originalPlan = [
  { 
    label: "📅 Week of Nov 17th–23rd"
   },

  {
    label: "Monday – Chest Power",
    gym: [
      { name: "Incline Bench Press", sets: 4 },
      { name: "Flat Bench Press", sets: 4 },
      { name: "Machine Chest Press", sets: 3 },
      { name: "Cable Fly", sets: 3 },
      { name: "Push-ups (AMRAP)", sets: 1 },
    ],
    outdoor: "Push-up walk",
  },

  {
    label: "Tuesday – Back Power",
    gym: [
      { name: "Deadlift (or Rack Pull)", sets: 4 },
      { name: "Chest-Supported Row", sets: 4 },
      { name: "Lat Pulldown (Wide)", sets: 3 },
      { name: "Barbell Curl", sets: 3 },
      { name: "Face Pulls", sets: 3 },
    ],
    outdoor: "Pull-ups + walk",
  },

  {
    label: "Wednesday – Legs Strength",
    gym: [
      { name: "Back Squat", sets: 5 },
      { name: "Romanian Deadlift", sets: 4 },
      { name: "Leg Press", sets: 4 },
      { name: "Reverse Lunges", sets: 3 },
      { name: "Standing Calf Raise", sets: 4 },
    ],
    outdoor: "Stair climb + hill walk",
  },

  {
    label: "Thursday – Arms + Shoulders",
    gym: [
      { name: "Standing Overhead Press", sets: 4 },
      { name: "Dumbbell Lateral Raise", sets: 4 },
      { name: "Rear Delt Fly", sets: 3 },
      { name: "EZ Bar Curl", sets: 4 },
      { name: "Rope Triceps Pushdown", sets: 4 },
      { name: "Incline Dumbbell Curl", sets: 3 },
      { name: "Overhead Rope Extension", sets: 3 },
    ],
    outdoor: "Band pump + walk",
  },

  {
    label: "Friday – Legs (Volume)",
    gym: [
      { name: "Front Squat", sets: 4 },
      { name: "Leg Extension", sets: 4 },
      { name: "Nordic / Ham Curl Variation", sets: 4 },
      { name: "Hip Thrust", sets: 3 },
      { name: "Seated Calf Raise", sets: 4 },
    ],
    outdoor: "Weighted steps + walk",
  },

  {
    label: "Saturday – Conditioning",
    gym: [
      { name: "Sled Push Rounds", sets: 8 },
      { name: "Kettlebell Swings", sets: 3 },
      { name: "Battle Ropes", sets: 3 },
      { name: "Plank", sets: 3 },
    ],
    outdoor: "Intervals outside",
  },

  {
    label: "Sunday – TRX & Recovery",
    gym: [
      { name: "TRX Row", sets: 4, repRange: "10–12" },
      { name: "TRX Chest Press", sets: 4, repRange: "10–12" },
      { name: "TRX Split Squat", sets: 3, repRange: "12/leg" },
      { name: "TRX Biceps Curl", sets: 3, repRange: "12–15" },
      { name: "TRX Triceps Extension", sets: 3, repRange: "12–15" },
      { name: "TRX Hamstring Curl", sets: 3, repRange: "10–12" },
      { name: "TRX Pike", sets: 3, repRange: "8–10" },
      { name: "Stretch Flow (10 min)", sets: 1 },
    ],
    outdoor: "Bike ride or walk",
  },
];

// helper: day index -> rep target (Option B wave)
function repTargetForIndex(index: number) {
  // originalPlan has header at index 0. index: 1..7 map to Mon..Sun
  // 1-3 => Strength (5-8), 4 => Moderate (8-12), 5-6 => Volume (12-15), 7 => TRX (10-12)
  if (index >= 1 && index <= 3) return "5–8 reps";
  if (index === 4) return "8–12 reps";
  if (index === 5 || index === 6) return "12–15 reps";
  if (index === 7) return "10–12 reps";
  return "8–12 reps";
}

const week20Plan = originalPlan.map((entry, idx) => {
  if (idx === 0) return entry;
  const dayNumber = START_DAY + (idx - 1);
  return {
    ...entry,
    day: `(${dayNumber}) ${entry.label}`,
    repTarget: repTargetForIndex(idx),
  };
});

export default function Week20Tracker() {
  const [completedState, setCompletedState] = useState<Record<string, ExerciseState>>({});

  useEffect(() => {
    const stored = localStorage.getItem("week20Progress");
    if (stored) {
      setCompletedState(JSON.parse(stored));
      return;
    }

    // initialize defaults
    const defaults: Record<string, ExerciseState> = {};
    for (let i = 0; i < week20Plan.length; i++) {
      const block: any = week20Plan[i];
      if (!block.gym) continue;

      block.gym.forEach((ex: any) => {
        const setCount = ex.sets ?? 3;
        const sets: SetEntry[] = Array.from({ length: setCount }).map(() => ({ weight: "", reps: "" }));
        defaults[`${block.day}::${ex.name}`] = { completed: false, machine: "", sets };
      });

      if (block.outdoor) defaults[`${block.day}::outdoor`] = { completed: false, machine: "", sets: [] };
    }
    setCompletedState(defaults);
  }, []);

  useEffect(() => {
    localStorage.setItem("week20Progress", JSON.stringify(completedState));
  }, [completedState]);

  const toggleExercise = (key: string) => {
    setCompletedState(prev => ({ ...prev, [key]: { ...prev[key], completed: !prev[key]?.completed } }));
  };

  const updateMachine = (key: string, value: string) => {
    setCompletedState(prev => ({ ...prev, [key]: { ...prev[key], machine: value } }));
  };

  const updateSet = (key: string, idx: number, field: "weight" | "reps", value: string) => {
    setCompletedState(prev => {
      const item = prev[key];
      if (!item) return prev;
      const newSets = item.sets.map((s, i) => (i === idx ? { ...s, [field]: value } : s));
      return { ...prev, [key]: { ...item, sets: newSets } };
    });
  };

  const addSet = (key: string) => {
    setCompletedState(prev => {
      const item = prev[key];
      if (!item) return prev;
      return { ...prev, [key]: { ...item, sets: [...item.sets, { weight: "", reps: "" }] } };
    });
  };

  const removeSet = (key: string, idx: number) => {
    setCompletedState(prev => {
      const item = prev[key];
      if (!item) return prev;
      return { ...prev, [key]: { ...item, sets: item.sets.filter((_, i) => i !== idx) } };
    });
  };

  return (
    <ScrollArea className="p-4 max-w-md mx-auto space-y-4">
      {week20Plan.map(({ day, gym, outdoor, repTarget }: any) => (
        <Card key={day} className="rounded-2xl shadow-md">
          <CardContent className="p-4">
            {!gym.length ? (
              <h2 className="text-xl font-bold text-center">{day}</h2>
            ) : (
              <>
                <h2 className="text-xl font-bold mb-2">{day}</h2>
                <div className="text-sm text-gray-500 mb-3">Day target: {repTarget}</div>

                <h3 className="font-semibold mb-1">Gym:</h3>
                <div className="space-y-4">
                  {gym.map((ex: any) => {
                    const key = `${day}::${ex.name}`;
                    const state = completedState[key] ?? { sets: Array.from({ length: ex.sets ?? 3 }).map(() => ({ weight: "", reps: "" })), completed: false, machine: "" };

                    return (
                      <div key={key} className="border rounded p-2">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Checkbox checked={!!state.completed} onCheckedChange={() => toggleExercise(key)} />
                            <div>
                              <div className="font-medium">{ex.name}</div>
                              {ex.repRange ? (
                                <div className="text-xs text-gray-500">Target: {ex.repRange}</div>
                              ) : (
                                <div className="text-xs text-gray-500">Target: {repTarget}</div>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <button className="text-xs px-2 py-1 border rounded" onClick={() => addSet(key)}>Add set</button>
                          </div>
                        </div>

                        {/* Machine used (per exercise) */}
                        <div className="mb-2 text-sm">
                          <label className="block text-xs text-gray-600">Machine Used:</label>
                          <input
                            type="text"
                            value={state.machine || ""}
                            placeholder="e.g. Hammer Strength / Cable #3"
                            className="w-full border rounded px-2 py-1 text-sm"
                            onChange={(e) => updateMachine(key, e.target.value)}
                          />
                        </div>

                        {/* Sets table */}
                        <table className="w-full text-sm">
                          <thead>
                            <tr>
                              <th className="pb-1 text-left">Set</th>
                              <th className="pb-1 text-left">Weight</th>
                              <th className="pb-1 text-left">Reps</th>
                              <th className="pb-1"></th>
                            </tr>
                          </thead>
                          <tbody>
                            {state.sets.map((s: SetEntry, i: number) => (
                              <tr key={i} className="align-top">
                                <td className="py-1">{i + 1}</td>
                                <td className="py-1">
                                  <input type="number" className="w-full border rounded px-2 py-1 text-sm" value={s.weight} onChange={(e) => updateSet(key, i, "weight", e.target.value)} />
                                </td>
                                <td className="py-1">
                                  <input type="number" className="w-full border rounded px-2 py-1 text-sm" value={s.reps} onChange={(e) => updateSet(key, i, "reps", e.target.value)} />
                                </td>
                                <td className="py-1">
                                  <button className="text-xs px-2 py-1 border rounded" onClick={() => removeSet(key, i)}>Remove</button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    );
                  })}
                </div>

                <h3 className="font-semibold mt-4 mb-1">Outdoor:</h3>
                <div className="flex items-center gap-2 text-sm">
                  <Checkbox checked={!!completedState[`${day}::outdoor`]?.completed} onCheckedChange={() => toggleExercise(`${day}::outdoor`)} />
                  {outdoor}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      ))}
    </ScrollArea>
  );
}
