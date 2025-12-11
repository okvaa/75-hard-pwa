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
  { day: "📅 Week 23 – December 8–14", gym: [], outdoor: "" },

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

export default function Week23Tracker() {
  const [state, setState] = useState<Record<string, ExerciseState>>({});
  const [week22History, setWeek22History] = useState<any>(null);

  useEffect(() => {
    const stored = localStorage.getItem("week23Progress");
    if (stored) setState(JSON.parse(stored));

    const prevWeek = localStorage.getItem("week22Progress");
    if (prevWeek) setWeek22History(JSON.parse(prevWeek));
  }, []);

  useEffect(() => {
    localStorage.setItem("week23Progress", JSON.stringify(state));
  }, [state]);

  useEffect(() => {
    // Initialize if needed
    if (Object.keys(state).length === 0) {
      const defaults: Record<string, ExerciseState> = {};

      week23Plan.forEach((block) => {
        block.gym.forEach((ex: any) => {
          defaults[`${block.day}::${ex.name}`] = {
            completed: false,
            sets: Array.from({ length: ex.sets }).map(() => ({
              weight: "",
              reps: "",
              machine: "",
              pain: 0,
            })),
          };
        });

        if (block.outdoor) {
          defaults[`${block.day}::outdoor`] = { completed: false, sets: [] };
        }
      });

      setState(defaults);
    }
  }, [state]);

  const toggle = (key: string) =>
    setState((prev) => ({
      ...prev,
      [key]: { ...prev[key], completed: !prev[key]?.completed },
    }));

  const update = (
    key: string,
    index: number,
    field: keyof SetEntry,
    value: string | number
  ) =>
    setState((prev) => {
      const entry = prev[key];
      if (!entry) return prev;

      const newSets = [...entry.sets];
      newSets[index] = { ...newSets[index], [field]: value };

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

              const suggested = computeSuggestedWeightFromHistory(
                [week22History],
                ex.name,
                ex.repRange
              );

              return (
                <div key={key} className="border rounded p-2 mb-4">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={entry?.completed}
                      onCheckedChange={() => toggle(key)}
                    />
                    <span className="font-semibold">{ex.name}</span>
                  </div>

                  {/* MACHINE FIELD – moved ABOVE target */}
                  <div className="mt-2">
                    <label className="text-xs text-gray-500">Machine Used</label>
                    <input
                      type="text"
                      className="border rounded w-full px-2 py-1 text-sm"
                      value={entry?.sets[0]?.machine || ""}
                      onChange={(e) =>
                        update(key, 0, "machine", e.target.value)
                      }
                    />
                  </div>

                  {/* Target + Suggested */}
                  <div className="text-xs mt-1 text-gray-600">
                    Target: {ex.repRange}
                  </div>
                  <div className="text-xs text-blue-600">
                    Suggested: {suggested}
                  </div>

                  {/* SETS TABLE */}
                  <table className="w-full text-sm mt-3">
                    <thead>
                      <tr>
                        <th>Set</th>
                        <th>Weight</th>
                        <th>Reps</th>
                        <th>Pain</th>
                      </tr>
                    </thead>
                    <tbody>
                      {entry?.sets.map((s, i) => (
                        <tr key={i}>
                          <td>{i + 1}</td>
                          <td>
                            <input
                              type="number"
                              className="border w-full px-1"
                              value={s.weight}
                              onChange={(e) =>
                                update(key, i, "weight", e.target.value)
                              }
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              className="border w-full px-1"
                              value={s.reps}
                              onChange={(e) =>
                                update(key, i, "reps", e.target.value)
                              }
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              min={0}
                              max={10}
                              className="border w-full px-1"
                              value={s.pain}
                              onChange={(e) =>
                                update(key, i, "pain", Number(e.target.value))
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

            {/* Outdoor */}
            <div className="flex items-center gap-2">
              <Checkbox
                checked={state[`${day}::outdoor`]?.completed}
                onCheckedChange={() => toggle(`${day}::outdoor`)}
              />
              {outdoor}
            </div>
          </CardContent>
        </Card>
      ))}
    </ScrollArea>
  );
}
