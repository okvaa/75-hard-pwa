import { useState, useEffect } from "react";
import { Card, CardContent } from "./components/ui/card";
import { Checkbox } from "./components/ui/checkbox";
import { ScrollArea } from "./components/ui/scroll-area";
import { exportWeekToCSV } from "./utils/exportCSV";

type SetEntry = { weight: string; reps: string };
type ExerciseState = { completed?: boolean; machine?: string; sets: SetEntry[] };

const START_DAY = 152;

const rawPlan = [
  { label: "📅 Week of Dec 8th–14th", gym: [], outdoor: "" },

  {
    label: "Monday – Chest Strength",
    gym: [
      { name: "Incline Bench Press", sets: 3, repRange: "6–8" },
      { name: "Machine Chest Press", sets: 3, repRange: "10–12" },
      { name: "Cable Fly", sets: 3, repRange: "12–15" },
      { name: "Decline Push-ups", sets: 1, repRange: "AMRAP" },
    ],
    outdoor: "1-hour walk",
  },

  {
    label: "Tuesday – Back (Spine Safe)",
    gym: [
      { name: "Chest-Supported Row", sets: 3, repRange: "8–12" },
      { name: "Lat Pulldown", sets: 3, repRange: "10–12" },
      { name: "Seated Cable Row", sets: 3, repRange: "10–12" },
      { name: "Face Pull", sets: 3, repRange: "12–15" },
    ],
    outdoor: "Walk",
  },

  {
    label: "Wednesday – Legs Strength",
    gym: [
      { name: "Leg Press", sets: 4, repRange: "8–12" },
      { name: "Hack Squat (light)", sets: 3, repRange: "10–12" },
      { name: "Leg Extension", sets: 3, repRange: "12–15" },
      { name: "Hamstring Curl", sets: 3, repRange: "10–12" },
      { name: "Calf Raise", sets: 4, repRange: "12–20" },
    ],
    outdoor: "Stairs / Walk",
  },

  {
    label: "Thursday – Shoulders + Arms",
    gym: [
      { name: "Shoulder Press Machine", sets: 4, repRange: "8–12" },
      { name: "Lateral Raise", sets: 4, repRange: "12–15" },
      { name: "Rear Delt Fly", sets: 3, repRange: "12–15" },
      { name: "Cable Curl", sets: 3, repRange: "10–12" },
      { name: "Tricep Rope Pressdown", sets: 3, repRange: "10–12" },
    ],
    outdoor: "Band Pump",
  },

  {
    label: "Friday – Legs Volume",
    gym: [
      { name: "Leg Press Volume", sets: 4, repRange: "12–15" },
      { name: "Walking Lunge", sets: 4, repRange: "10–12/leg" },
      { name: "Glute Bridge", sets: 4, repRange: "12–15" },
      { name: "Leg Extension Drop Set", sets: 3, repRange: "12–15" },
      { name: "Seated Calf Raise", sets: 4, repRange: "12–20" },
    ],
    outdoor: "Walk",
  },

  {
    label: "Saturday – Conditioning",
    gym: [
      { name: "Rower Intervals", sets: 6, repRange: "1 min" },
      { name: "Battle Ropes", sets: 3, repRange: "30 sec" },
      { name: "Light KB Swings", sets: 3, repRange: "12–15" },
    ],
    outdoor: "Agility/Intervals",
  },

  {
    label: "Sunday – TRX + Recovery",
    gym: [
      { name: "TRX Row", sets: 3, repRange: "10–12" },
      { name: "TRX Chest Press", sets: 3, repRange: "10–12" },
      { name: "TRX Lunge", sets: 3, repRange: "12" },
      { name: "TRX Biceps Curl", sets: 3, repRange: "12–15" },
      { name: "TRX Triceps Extension", sets: 3, repRange: "12–15" },
    ],
    outdoor: "Easy walk / stretch",
  },
];

const week23Plan = rawPlan.map((entry, idx) => {
  if (idx === 0) return entry;
  const dayNum = START_DAY + (idx - 1);
  return { ...entry, day: `(${dayNum}) ${entry.label}` };
});

export default function Week23Tracker() {
  const [state, setState] = useState<Record<string, ExerciseState>>({});

  // Load
  useEffect(() => {
    const saved = localStorage.getItem("week23Progress");
    if (saved) return setState(JSON.parse(saved));

    const init: Record<string, ExerciseState> = {};
    week23Plan.forEach((block: any) => {
      block.gym?.forEach((ex: any) => {
        init[`${block.day}::${ex.name}`] = {
          completed: false,
          machine: "",
          sets: Array.from({ length: ex.sets }).map(() => ({ weight: "", reps: "" })),
        };
      });
      if (block.outdoor) {
        init[`${block.day}::outdoor`] = { completed: false, machine: "", sets: [] };
      }
    });

    setState(init);
  }, []);

  // Save
  useEffect(() => {
    localStorage.setItem("week23Progress", JSON.stringify(state));
  }, [state]);

  const toggle = (key: string) =>
    setState((p) => ({ ...p, [key]: { ...p[key], completed: !p[key].completed } }));

  const setMachine = (key: string, v: string) =>
    setState((p) => ({ ...p, [key]: { ...p[key], machine: v } }));

  const setSetValue = (key: string, i: number, f: "weight" | "reps", v: string) =>
    setState((p) => {
      const item = p[key];
      const copy = [...item.sets];
      copy[i] = { ...copy[i], [f]: v };
      return { ...p, [key]: { ...item, sets: copy } };
    });

  return (
    <>
      <div className="max-w-md mx-auto mb-4 px-4">
        <button
          onClick={() => exportWeekToCSV("Week23", state)}
          className="w-full bg-blue-600 text-white py-2 rounded-lg shadow"
        >
          Export Week 23 to CSV
        </button>
      </div>

      <ScrollArea className="p-4 max-w-md mx-auto space-y-4">
        {week23Plan.map(({ day, gym, outdoor }: any) => (
          <Card key={day} className="rounded-xl shadow-md">
            <CardContent className="p-4">
              <h2 className="text-xl font-bold mb-2">{day}</h2>

              {gym.length > 0 && (
                <>
                  <h3 className="font-semibold mb-2">Gym:</h3>
                  {gym.map((ex: any) => {
                    const key = `${day}::${ex.name}`;
                    const item = state[key];

                    if (!item) return null;

                    return (
                      <div key={key} className="border rounded p-2 mb-4">
                        <div className="flex items-start gap-2 mb-2">
                          <Checkbox checked={item.completed} onCheckedChange={() => toggle(key)} />
                          <div>
                            <div className="font-medium">{ex.name}</div>
                            <div className="text-xs text-gray-500">Target: {ex.repRange}</div>
                          </div>
                        </div>

                        <input
                          type="text"
                          value={item.machine}
                          placeholder="Machine used"
                          className="w-full border rounded px-2 py-1 text-sm mb-2"
                          onChange={(e) => setMachine(key, e.target.value)}
                        />

                        <table className="w-full text-sm">
                          <thead>
                            <tr><th>Set</th><th>Weight</th><th>Reps</th></tr>
                          </thead>
                          <tbody>
                            {item.sets.map((s, i) => (
                              <tr key={i}>
                                <td>{i + 1}</td>
                                <td>
                                  <input
                                    type="number"
                                    className="w-full border rounded px-2 py-1"
                                    value={s.weight}
                                    onChange={(e) => setSetValue(key, i, "weight", e.target.value)}
                                  />
                                </td>
                                <td>
                                  <input
                                    type="number"
                                    className="w-full border rounded px-2 py-1"
                                    value={s.reps}
                                    onChange={(e) => setSetValue(key, i, "reps", e.target.value)}
                                  />
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    );
                  })}
                </>
              )}

              {outdoor && (
                <>
                  <h3 className="font-semibold mb-1">Outdoor:</h3>
                  <div className="flex items-center gap-2">
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
    </>
  );
}
