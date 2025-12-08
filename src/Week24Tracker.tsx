import { useState, useEffect } from "react";
import { Card, CardContent } from "./components/ui/card";
import { Checkbox } from "./components/ui/checkbox";
import { ScrollArea } from "./components/ui/scroll-area";
import { exportWeekToCSV } from "./utils/exportCSV";

type SetEntry = { weight: string; reps: string };
type ExerciseState = { completed?: boolean; machine?: string; sets: SetEntry[] };

const START_DAY = 152; // Week 23 starts at Hard day 152

const rawPlan = [
  { label: "📅 Week of Dec 8th–14th", gym: [], outdoor: "" },

  {
    label: "Monday – Push Strength",
    gym: [
      { name: "Incline Barbell Press", sets: 4 },
      { name: "Seated Dumbbell Press", sets: 4 },
      { name: "Weighted Dips (or machine)", sets: 3 },
      { name: "Cable Fly (Low to High)", sets: 3 },
    ],
    outdoor: "Push-up intervals",
  },

  {
    label: "Tuesday – Back (no hinges)",
    gym: [
      { name: "Chest-Supported Row (heavy)", sets: 4 },
      { name: "Neutral Grip Pulldown", sets: 4 },
      { name: "Single-Arm Seated Row", sets: 3 },
      { name: "Face Pulls", sets: 3 },
    ],
    outdoor: "Walk + band mobility",
  },

  {
    label: "Wednesday – Legs Strength (spine-safe)",
    gym: [
      { name: "Belt Squat / Hack Squat", sets: 5 },
      { name: "Bulgarian Split Squat", sets: 4 },
      { name: "Leg Press (feet high)", sets: 4 },
      { name: "Seated Leg Curl", sets: 3 },
      { name: "Standing Calf Raise", sets: 4 },
    ],
    outdoor: "Stair walk (moderate)",
  },

  {
    label: "Thursday – Shoulders + Arms",
    gym: [
      { name: "Arnold Press", sets: 4 },
      { name: "Cable Lateral Raise", sets: 4 },
      { name: "Rear Delt Row (machine)", sets: 3 },
      { name: "Hammer Curl", sets: 4 },
      { name: "Rope Overhead Extension", sets: 4 },
    ],
    outdoor: "Band pump + walk",
  },

  {
    label: "Friday – Legs Volume",
    gym: [
      { name: "Leg Press (volume)", sets: 4 },
      { name: "Walking Lunges", sets: 4 },
      { name: "Glute Bridge (single-leg option)", sets: 4 },
      { name: "Leg Extension (dropset)", sets: 3 },
      { name: "Seated Calf Raise", sets: 4 },
    ],
    outdoor: "Weighted step-ups",
  },

  {
    label: "Saturday – Conditioning + Arms",
    gym: [
      { name: "Rower Intervals", sets: 6 },
      { name: "Battle Ropes", sets: 3 },
      { name: "Kettlebell Swings (light)", sets: 3 },
      { name: "Cable Curls (dropset)", sets: 3 },
    ],
    outdoor: "Intervals/Agility",
  },

  {
    label: "Sunday – TRX & Recovery",
    gym: [
      { name: "TRX Row", sets: 4, repRange: "10–12" },
      { name: "TRX Chest Press", sets: 4, repRange: "10–12" },
      { name: "TRX Reverse Lunge", sets: 3, repRange: "12/leg" },
      { name: "TRX Biceps Curl", sets: 3, repRange: "12–15" },
      { name: "TRX Triceps Extension", sets: 3, repRange: "12–15" },
      { name: "TRX Hamstring Curl", sets: 3, repRange: "10–12" },
      { name: "Stretch Flow (10 min)", sets: 1 },
    ],
    outdoor: "Easy walk or bike",
  },
];

function repTargetForIndex(index: number) {
  if (index >= 1 && index <= 3) return "5–8 reps";
  if (index === 4) return "8–12 reps";
  if (index === 5 || index === 6) return "12–15 reps";
  if (index === 7) return "10–12 reps";
  return "8–12 reps";
}

const week23Plan = rawPlan.map((entry, idx) => {
  if (idx === 0) return entry;
  const dayNum = START_DAY + (idx - 1);
  return { ...entry, day: `(${dayNum}) ${entry.label}`, repTarget: repTargetForIndex(idx) };
});

export default function Week23Tracker() {
  const [completedState, setCompletedState] = useState<Record<string, ExerciseState>>({});

  useEffect(() => {
    const stored = localStorage.getItem("week23Progress");
    if (stored) {
      setCompletedState(JSON.parse(stored));
      return;
    }

    const defaults: Record<string, ExerciseState> = {};
    for (const block of week23Plan) {
      block.gym?.forEach((ex: any) => {
        const setCount = ex.sets ?? 3;
        const sets = Array.from({ length: setCount }).map(() => ({ weight: "", reps: "" }));
        defaults[`${block.day}::${ex.name}`] = { completed: false, machine: "", sets };
      });
      if (block.outdoor) defaults[`${block.day}::outdoor`] = { completed: false, machine: "", sets: [] };
    }
    setCompletedState(defaults);
  }, []);

  useEffect(() => {
    localStorage.setItem("week23Progress", JSON.stringify(completedState));
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
    <>
      <div className="max-w-md mx-auto mb-4 px-4">
        <button
          onClick={() => exportWeekToCSV("Week23", completedState)}
          className="w-full bg-blue-600 text-white py-2 rounded-lg shadow font-semibold"
        >
          Export Week 23 to CSV
        </button>
      </div>

      <ScrollArea className="p-4 max-w-md mx-auto space-y-4">
        {week23Plan.map(({ day, gym, outdoor, repTarget }: any) => (
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

                          <div className="mb-2 text-sm">
                            <label className="block text-xs text-gray-600">Machine Used:</label>
                            <input
                              type="text"
                              value={state.machine || ""}
                              placeholder="e.g. Leg Press #2 / Smith"
                              className="w-full border rounded px-2 py-1 text-sm"
                              onChange={(e) => updateMachine(key, e.target.value)}
                            />
                          </div>

                          <table className="w-full text-sm">
                            <thead>
                              <tr>
                                <th>Set</th>
                                <th>Weight</th>
                                <th>Reps</th>
                                <th></th>
                              </tr>
                            </thead>
                            <tbody>
                              {state.sets.map((s: SetEntry, i: number) => (
                                <tr key={i}>
                                  <td className="py-1">{i + 1}</td>
                                  <td className="py-1">
                                    <input type="number" className="w-full border rounded px-2 py-1 text-sm" value={s.weight} onChange={(e) => updateSet(key, i, "weight", e.target.value)} />
                                  </td>
                                  <td className="py-1">
                                    <input type="number" className="w-full border rounded px-2 py-1 text-sm" value={s.reps} onChange={(e) => updateSet(key, i, "reps", e.target.value)} />
                                  </td>
                                  <td className="py-1">
                                    <button className="text-xs border px-2 py-1 rounded" onClick={() => removeSet(key, i)}>Remove</button>
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
                  <div className="flex items-center gap-2">
                    <Checkbox checked={!!completedState[`${day}::outdoor`]?.completed} onCheckedChange={() => toggleExercise(`${day}::outdoor`)} />
                    {outdoor}
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        ))}
      </ScrollArea>
    </>
  );
}
