import { useState, useEffect } from "react";
import { Card, CardContent } from "./components/ui/card";
import { Checkbox } from "./components/ui/checkbox";
import { ScrollArea } from "./components/ui/scroll-area";

type SetEntry = {
  weight: string;
  reps: string;
  machine: string;
  pain: number;
  difficulty: number;
};

type ExerciseState = {
  completed?: boolean;
  sets: SetEntry[];
};

const week24Plan = [
  { day: "📅 Week of Dec 15th–21st (Week 24)", gym: [], outdoor: "" },

  // MONDAY – CHEST (Spine Safe)
  {
    day: "🔴 (Day 160) Monday – Chest (Spine-Safe)",
    gym: [
      { name: "Machine Chest Press", sets: 4, repRange: "8–12" },
      { name: "Incline Dumbbell Bench (neutral grip)", sets: 4, repRange: "8–12" },
      { name: "Pec Deck / Cable Fly", sets: 3, repRange: "12–15" },
      { name: "Chest Press Drop Set", sets: 1, repRange: "AMRAP" },
    ],
    outdoor: "1-hour walk"
  },

  // TUESDAY – BACK (NO Deadlifts)
  {
    day: "🔵 (Day 161) Tuesday – Back (NO Deadlift)",
    gym: [
      { name: "Lat Pulldown (wide grip)", sets: 4, repRange: "8–12" },
      { name: "Seated Row Machine", sets: 4, repRange: "8–12" },
      { name: "Single Arm Lat Pulldown", sets: 3, repRange: "10–12" },
      { name: "Back Extension (gentle)", sets: 2, repRange: "15" },
    ],
    outdoor: "1-hour walk"
  },

  // WEDNESDAY – LEGS (Back Safe)
  {
    day: "🟣 (Day 162) Wednesday – Legs (Back-Friendly)",
    gym: [
      { name: "Leg Press (feet high)", sets: 4, repRange: "10–15" },
      { name: "Quad Extension", sets: 3, repRange: "12–15" },
      { name: "Seated Hamstring Curl", sets: 3, repRange: "12–15" },
      { name: "Calf Press on Leg Press", sets: 4, repRange: "15–20" },
    ],
    outdoor: "1-hour walk"
  },

  // THURSDAY – SHOULDERS + ARMS
  {
    day: "🟠 (Day 163) Thursday – Shoulders + Arms",
    gym: [
      { name: "Machine Shoulder Press", sets: 4, repRange: "8–12" },
      { name: "Cable Lateral Raise", sets: 3, repRange: "12–15" },
      { name: "Rear Delt Machine", sets: 3, repRange: "12–15" },
      { name: "Cable Curl", sets: 3, repRange: "10–12" },
      { name: "Rope Triceps Pressdown", sets: 3, repRange: "10–12" },
    ],
    outdoor: "1-hour walk"
  },

  // FRIDAY – Chest / Back Pump
  {
    day: "🟡 (Day 164) Friday – Chest + Back Pump",
    gym: [
      { name: "Hammer Strength Chest Press", sets: 4, repRange: "8–12" },
      { name: "Cable Fly (high → low)", sets: 3, repRange: "12–15" },
      { name: "Machine Biceps Curl", sets: 3, repRange: "12–15" },
      { name: "Machine Triceps Dip", sets: 3, repRange: "10–12" },
    ],
    outdoor: "1-hour walk"
  },

  // SATURDAY – Arms + Core
  {
    day: "🟢 (Day 165) Saturday – Arms + Core",
    gym: [
      { name: "EZ-Bar Curl", sets: 3, repRange: "10–12" },
      { name: "Triceps Rope Extension", sets: 3, repRange: "10–12" },
      { name: "Hammer Curls", sets: 3, repRange: "10–12" },
      { name: "Cable Crunch", sets: 3, repRange: "12–15" },
    ],
    outdoor: "1-hour walk"
  },

  // SUNDAY – TRX + Recovery
  {
    day: "⚪ (Day 166) Sunday – TRX + Recovery",
    gym: [
      { name: "TRX Row", sets: 3, repRange: "10–12" },
      { name: "TRX Chest Press", sets: 3, repRange: "10–12" },
      { name: "TRX Split Squat", sets: 3, repRange: "10–12 each leg" },
      { name: "TRX Core Fallout", sets: 3, repRange: "8–10" },
    ],
    outdoor: "1-hour walk"
  },
];

// ------------------------------
// Suggested Weight Algorithm
// ------------------------------
const suggestWeight = (entry: ExerciseState, repRange: string) => {
  if (!entry) return "—";

  const weights = entry.sets.map(s => parseFloat(s.weight)).filter(w => !isNaN(w));
  if (weights.length === 0) return "—";

  const avgWeight = weights.reduce((a, b) => a + b, 0) / weights.length;

  const reps = entry.sets.map(s => parseInt(s.reps)).filter(r => !isNaN(r));
  const avgReps = reps.length ? reps.reduce((a, b) => a + b, 0) / reps.length : null;

  const pain = entry.sets.map(s => s.pain);
  const avgPain = pain.reduce((a, b) => a + b, 0) / pain.length;

  const difficulty = entry.sets.map(s => s.difficulty);
  const avgDiff = difficulty.reduce((a, b) => a + b, 0) / difficulty.length;

  // Pain-limited
  if (avgPain >= 5) return `${avgWeight.toFixed(0)} lbs (no increase – pain)`;

  // Difficulty-limited
  if (avgDiff >= 8) return `${avgWeight.toFixed(0)} lbs (no increase – hard)`;


  const high = parseInt(repRange.split("–")[1]);
  if (high && avgReps && avgReps >= high) {
    return `${(avgWeight + 5).toFixed(0)} lbs`;
  }

  return `${avgWeight.toFixed(0)} lbs`;
};

export default function Week24Tracker() {
  const [state, setState] = useState<Record<string, ExerciseState>>({});

  // Load state
  useEffect(() => {
    const stored = localStorage.getItem("week24Progress");
    if (stored) return setState(JSON.parse(stored));

    const defaults: Record<string, ExerciseState> = {};

    week24Plan.forEach((block) => {
      block.gym.forEach((ex: any) => {
        defaults[`${block.day}::${ex.name}`] = {
          completed: false,
          sets: Array.from({ length: ex.sets }).map(() => ({
            weight: "",
            reps: "",
            machine: "",
            pain: 0,
            difficulty: 0,
          })),
        };
      });

      defaults[`${block.day}::outdoor`] = { completed: false, sets: [] };
    });

    setState(defaults);
  }, []);

  useEffect(() => {
    localStorage.setItem("week24Progress", JSON.stringify(state));
  }, [state]);

  const toggle = (key: string) =>
    setState((prev) => ({
      ...prev,
      [key]: { ...prev[key], completed: !prev[key].completed },
    }));

  const update = (
    key: string,
    index: number,
    field: keyof SetEntry,
    value: any
  ) =>
    setState((prev) => {
      const next = { ...prev };
      const sets = [...next[key].sets];
      sets[index] = { ...sets[index], [field]: value };
      next[key].sets = sets;
      return next;
    });

  return (
    <ScrollArea className="p-4 max-w-md mx-auto space-y-4">
      {week24Plan.map(({ day, gym, outdoor }) => (
        <Card key={day}>
          <CardContent className="p-4">
            {gym.length === 0 ? (
              <h2 className="text-xl font-bold text-center">{day}</h2>
            ) : (
              <>
                <h2 className="text-xl font-bold mb-3">{day}</h2>

                {gym.map((ex: any) => {
                  const key = `${day}::${ex.name}`;
                  const entry = state[key];

                  return (
                    <div key={key} className="border rounded p-2 mb-3">
                      <div className="flex justify-between">
                        <div className="flex items-center gap-2">
                          <Checkbox
                            checked={entry?.completed}
                            onCheckedChange={() => toggle(key)}
                          />
                          <div>
                            <div className="font-semibold">{ex.name}</div>
                            <div className="text-xs text-gray-600">
                              Target: {ex.repRange}
                            </div>
                            <div className="text-xs text-blue-600">
                              Suggested: {suggestWeight(entry!, ex.repRange)}
                            </div>
                          </div>
                        </div>
                      </div>

                      <table className="w-full text-sm mt-2">
                        <thead>
                          <tr>
                            <th>Set</th>
                            <th>Weight</th>
                            <th>Reps</th>
                            <th>Machine</th>
                            <th>Pain</th>
                            <th>Diff</th>
                          </tr>
                        </thead>
                        <tbody>
                          {entry?.sets.map((s, i) => (
                            <tr key={i}>
                              <td>{i + 1}</td>

                              <td>
                                <input
                                  type="number"
                                  className="w-14 border rounded px-1"
                                  value={s.weight}
                                  onChange={(e) =>
                                    update(key, i, "weight", e.target.value)
                                  }
                                />
                              </td>

                              <td>
                                <input
                                  type="number"
                                  className="w-12 border rounded px-1"
                                  value={s.reps}
                                  onChange={(e) =>
                                    update(key, i, "reps", e.target.value)
                                  }
                                />
                              </td>

                              <td>
                                <input
                                  type="text"
                                  className="w-24 border rounded px-1"
                                  value={s.machine}
                                  onChange={(e) =>
                                    update(key, i, "machine", e.target.value)
                                  }
                                />
                              </td>

                              <td>
                                <input
                                  type="number"
                                  min={0}
                                  max={10}
                                  className="w-10 border rounded px-1"
                                  value={s.pain}
                                  onChange={(e) =>
                                    update(key, i, "pain", Number(e.target.value))
                                  }
                                />
                              </td>

                              <td>
                                <input
                                  type="number"
                                  min={0}
                                  max={10}
                                  className="w-10 border rounded px-1"
                                  value={s.difficulty}
                                  onChange={(e) =>
                                    update(
                                      key,
                                      i,
                                      "difficulty",
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

                <div className="flex items-center gap-2 mt-2">
                  <Checkbox
                    checked={state[`${day}::outdoor`]?.completed}
                    onCheckedChange={() => toggle(`${day}::outdoor`)}
                  />
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
