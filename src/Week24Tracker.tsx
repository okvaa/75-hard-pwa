import { useState, useEffect } from "react";
import { Card, CardContent } from "./components/ui/card";
import { Checkbox } from "./components/ui/checkbox";
import { ScrollArea } from "./components/ui/scroll-area";
import { exportWeekToCSV } from "./utils/exportCSV";
import { computeSuggestedWeightFromHistory } from "./utils/suggestedWeight";

type SetEntry = { weight: string; reps: string; pain: number };
type ExerciseState = { completed?: boolean; machine?: string; sets: SetEntry[] };

const START_DAY = 159; // Week 24 starts day after Week 23 (ends 158)

const rawPlan = [
  { label: "📅 Week 24 – Dec 15th–21st", gym: [], outdoor: "" },

  {
    label: "Monday – Push Strength",
    repRange: "5–8",
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
    repRange: "8–12",
    gym: [
      { name: "Chest-Supported Row (heavy)", sets: 4 },
      { name: "Neutral Grip Pulldown", sets: 4 },
      { name: "Single-Arm Seated Row", sets: 3 },
      { name: "Face Pulls", sets: 3 },
    ],
    outdoor: "Walk + band mobility",
  },

  {
    label: "Wednesday – Legs (spine-safe)",
    repRange: "10–15",
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
    repRange: "10–12",
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
    repRange: "12–15",
    gym: [
      { name: "Leg Press (volume)", sets: 4 },
      { name: "Walking Lunges", sets: 4 },
      { name: "Glute Bridge (single-leg)", sets: 4 },
      { name: "Leg Extension (dropset)", sets: 3 },
      { name: "Seated Calf Raise", sets: 4 },
    ],
    outdoor: "Weighted step-ups",
  },

  {
    label: "Saturday – Conditioning + Arms",
    repRange: "10–12",
    gym: [
      { name: "Rower Intervals", sets: 6 },
      { name: "Battle Ropes", sets: 3 },
      { name: "Kettlebell Swings (light)", sets: 3 },
      { name: "Cable Curls (dropset)", sets: 3 },
    ],
    outdoor: "Intervals / Agility",
  },

  {
    label: "Sunday – TRX & Recovery",
    repRange: "12–15",
    gym: [
      { name: "TRX Row", sets: 4 },
      { name: "TRX Chest Press", sets: 4 },
      { name: "TRX Reverse Lunge", sets: 3 },
      { name: "TRX Biceps Curl", sets: 3 },
      { name: "TRX Triceps Extension", sets: 3 },
      { name: "TRX Hamstring Curl", sets: 3 },
      { name: "Stretch Flow (10 min)", sets: 1 },
    ],
    outdoor: "Easy walk or bike",
  },
];

// Add day numbers
const week24Plan = rawPlan.map((entry, idx) => {
  if (idx === 0) return entry;
  const dayNum = START_DAY + (idx - 1);
  return { ...entry, day: `(${dayNum}) ${entry.label}` };
});

export default function Week24Tracker() {
  const [state, setState] = useState<Record<string, ExerciseState>>({});

  // Load state
  useEffect(() => {
    const stored = localStorage.getItem("week24Progress");
    if (stored) return setState(JSON.parse(stored));

    const defaults: Record<string, ExerciseState> = {};

    week24Plan.forEach((block) => {
      block.gym?.forEach((ex: any) => {
        defaults[`${block.day}::${ex.name}`] = {
          completed: false,
          machine: "",
          sets: Array.from({ length: ex.sets }).map(() => ({
            weight: "",
            reps: "",
            pain: 0,
          })),
        };
      });

      defaults[`${block.day}::outdoor`] = {
        completed: false,
        machine: "",
        sets: [],
      };
    });

    setState(defaults);
  }, []);

  // Save state
  useEffect(() => {
    localStorage.setItem("week24Progress", JSON.stringify(state));
  }, [state]);

  // Toggle exercise complete
  const toggleExercise = (key: string) =>
    setState((p) => ({
      ...p,
      [key]: { ...p[key], completed: !p[key]?.completed },
    }));

  // Update machine
  const updateMachine = (key: string, val: string) =>
    setState((p) => ({
      ...p,
      [key]: { ...p[key], machine: val },
    }));

  // Update set fields
  const updateSet = (
    key: string,
    idx: number,
    field: keyof SetEntry,
    val: string | number
  ) =>
    setState((p) => {
      const ex = p[key];
      const updated = [...ex.sets];
      updated[idx] = { ...updated[idx], [field]: val };
      return { ...p, [key]: { ...ex, sets: updated } };
    });

  return (
    <>
      <div className="max-w-md mx-auto mb-4 px-4">
        <button
          onClick={() => exportWeekToCSV("Week24", state)}
          className="w-full bg-blue-600 text-white py-2 rounded-lg shadow font-semibold"
        >
          Export Week 24 to CSV
        </button>
      </div>

      <ScrollArea className="p-4 max-w-md mx-auto space-y-4">
        {week24Plan.map(({ day, gym, outdoor, repRange }: any) => (
          <Card key={day} className="rounded-2xl shadow-md">
            <CardContent className="p-4">

              {gym.length === 0 ? (
                <h2 className="text-xl font-bold text-center">{day}</h2>
              ) : (
                <>
                  <h2 className="text-xl font-bold mb-2">{day}</h2>
                  <div className="text-sm text-gray-500 mb-3">
                    Target: {repRange}
                  </div>

                  {gym.map((ex: any) => {
                    const key = `${day}::${ex.name}`;
                    const entry = state[key];

                    if (!entry) return null;

                    const suggested = computeSuggestedWeightFromHistory(
                      [state],
                      ex.name,
                      repRange
                    );

                    return (
                      <div key={key} className="border rounded p-2 mb-4">
                        <div className="flex items-start gap-2 mb-2">
                          <Checkbox
                            checked={!!entry.completed}
                            onCheckedChange={() => toggleExercise(key)}
                          />
                          <div>
                            <div className="font-semibold">{ex.name}</div>
                            <div className="text-xs text-blue-600">
                              Suggested: {suggested}
                            </div>
                          </div>
                        </div>

                        {/* Machine input (moved above target, just like you asked) */}
                        <div className="mb-3 text-sm">
                          <label className="text-xs text-gray-500">
                            Machine Used:
                          </label>
                          <input
                            type="text"
                            className="w-full border rounded px-2 py-1"
                            value={entry.machine}
                            onChange={(e) =>
                              updateMachine(key, e.target.value)
                            }
                          />
                        </div>

                        <table className="w-full text-sm">
                          <thead>
                            <tr>
                              <th>Set</th>
                              <th>Weight</th>
                              <th>Reps</th>
                              <th>Pain</th>
                            </tr>
                          </thead>
                          <tbody>
                            {entry.sets.map((s, i) => (
                              <tr key={i}>
                                <td>{i + 1}</td>
                                <td>
                                  <input
                                    type="number"
                                    className="w-16 border rounded px-1"
                                    value={s.weight}
                                    onChange={(e) =>
                                      updateSet(
                                        key,
                                        i,
                                        "weight",
                                        e.target.value
                                      )
                                    }
                                  />
                                </td>
                                <td>
                                  <input
                                    type="number"
                                    className="w-16 border rounded px-1"
                                    value={s.reps}
                                    onChange={(e) =>
                                      updateSet(
                                        key,
                                        i,
                                        "reps",
                                        e.target.value
                                      )
                                    }
                                  />
                                </td>
                                <td>
                                  <input
                                    type="number"
                                    min={0}
                                    max={10}
                                    className="w-12 border rounded px-1"
                                    value={s.pain}
                                    onChange={(e) =>
                                      updateSet(
                                        key,
                                        i,
                                        "pain",
                                        Number(e.target.value)
                                      )
                                    }
                                  />
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    );
                  })}

                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={!!state[`${day}::outdoor`]?.completed}
                      onCheckedChange={() =>
                        toggleExercise(`${day}::outdoor`)
                      }
                    />
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
