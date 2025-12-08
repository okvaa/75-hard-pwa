import { useState, useEffect } from "react";
import { Card, CardContent } from "./components/ui/card";
import { Checkbox } from "./components/ui/checkbox";
import { ScrollArea } from "./components/ui/scroll-area";

type SetEntry = { weight: string; reps: string; machine: string };
type ExerciseState = { completed?: boolean; sets: SetEntry[] };

const week23Plan = [
  {
    day: "🔴 (153) Monday – Chest (Back-Safe Week Variation)",
    gym: [
      { name: "Seated Chest Press Machine", sets: 4, reps: "8–12" },
      { name: "Incline Hammer Strength Press", sets: 4, reps: "8–12" },
      { name: "Cable Fly (mid chest)", sets: 3, reps: "12–15" },
      { name: "Push-up Machine or Smith Push-ups", sets: 2, reps: "AMRAP" },
    ],
    outdoor: "1-hour walk",
  },

  {
    day: "🔵 (154) Tuesday – Back (NO spinal load)",
    gym: [
      { name: "Neutral Grip Pulldown", sets: 4, reps: "8–12" },
      { name: "Chest-Supported Row Machine", sets: 4, reps: "10–12" },
      { name: "Straight Arm Cable Pulldown", sets: 3, reps: "12–15" },
      { name: "Seated Row Narrow Grip", sets: 3, reps: "10–12" },
    ],
    outdoor: "1-hour walk",
  },

  {
    day: "🟣 (155) Wednesday – Legs (Back-Friendly, No Axial Load)",
    gym: [
      { name: "Leg Press (moderate)", sets: 4, reps: "10–15" },
      { name: "Seated Leg Curl", sets: 3, reps: "12–15" },
      { name: "Leg Extension", sets: 3, reps: "12–15" },
      { name: "Glute Drive Machine", sets: 3, reps: "10–12" },
      { name: "Standing Calf Raise Machine", sets: 4, reps: "15–20" },
    ],
    outdoor: "1-hour walk",
  },

  {
    day: "🟠 (156) Thursday – Shoulders + Arms (Machine Emphasis)",
    gym: [
      { name: "Seated Machine Shoulder Press", sets: 4, reps: "8–12" },
      { name: "Cable Y-Raise", sets: 3, reps: "12–15" },
      { name: "Machine Rear Delt Fly", sets: 3, reps: "12–15" },
      { name: "Preacher Curl Machine", sets: 3, reps: "10–12" },
      { name: "Cable Rope Pressdown", sets: 3, reps: "10–12" },
      { name: "Hammer Curl Machine or Dumbbells", sets: 3, reps: "10–12" },
    ],
    outdoor: "1-hour walk",
  },

  {
    day: "🟡 (157) Friday – Chest/Back Pump (Spine Neutral)",
    gym: [
      { name: "Pec Deck Machine", sets: 3, reps: "12–15" },
      { name: "Lat Pulldown (close grip)", sets: 3, reps: "10–12" },
      { name: "Cable Low Row", sets: 3, reps: "10–12" },
      { name: "Cable High-to-Low Fly", sets: 3, reps: "12–15" },
    ],
    outdoor: "1-hour walk",
  },

  {
    day: "🟢 (158) Saturday – Conditioning (Back-Safe Week 2)",
    gym: [
      { name: "Elliptical Sprints", sets: 6, reps: "30 sec on / 30 sec off" },
      { name: "Sled Push (very light)", sets: 6, reps: "20–40 ft" },
      { name: "Core: Cable Pallof Press", sets: 3, reps: "12–15" },
      { name: "Core: Dead Bug (machine-free)", sets: 3, reps: "10–12" },
    ],
    outdoor: "1-hour walk",
  },

  {
    day: "⚪ (159) Sunday – TRX Mobility + Stretching",
    gym: [
      { name: "TRX Row", sets: 4, reps: "10–15" },
      { name: "TRX Chest Press", sets: 4, reps: "10–12" },
      { name: "TRX Lunge (shallow)", sets: 3, reps: "8–10/leg" },
      { name: "TRX Biceps Curl", sets: 3, reps: "12–15" },
      { name: "TRX Triceps Extension", sets: 3, reps: "12–15" },
      { name: "Mobility Flow", sets: 1, reps: "10 min" },
    ],
    outdoor: "1-hour walk",
  },
];

export default function Week23Tracker() {
  const [state, setState] = useState<Record<string, ExerciseState>>({});

  useEffect(() => {
    const stored = localStorage.getItem("week23Progress");
    if (stored) return setState(JSON.parse(stored));

    const defaults: Record<string, ExerciseState> = {};
    week23Plan.forEach((blk) => {
      blk.gym.forEach((ex: any) => {
        defaults[`${blk.day}::${ex.name}`] = {
          completed: false,
          sets: Array.from({ length: ex.sets }).map(() => ({
            weight: "",
            reps: "",
            machine: "",
          })),
        };
      });
      defaults[`${blk.day}::outdoor`] = { completed: false, sets: [] };
    });
    setState(defaults);
  }, []);

  useEffect(() => {
    localStorage.setItem("week23Progress", JSON.stringify(state));
  }, [state]);

  const toggle = (key: string) =>
    setState((prev) => ({
      ...prev,
      [key]: { ...prev[key], completed: !prev[key].completed },
    }));

  const update = (key: string, index: number, field: keyof SetEntry, value: string) =>
    setState((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        sets: prev[key].sets.map((s, i) =>
          i === index ? { ...s, [field]: value } : s
        ),
      },
    }));

  return (
    <ScrollArea className="p-4 max-w-md mx-auto space-y-4">
      {week23Plan.map(({ day, gym, outdoor }) => (
        <Card key={day} className="rounded-2xl shadow-md">
          <CardContent className="p-4">
            <h2 className="text-xl font-bold mb-2">{day}</h2>

            <h3 className="font-semibold mb-1">Gym:</h3>
            <div className="space-y-4">
              {gym.map((ex: any) => {
                const key = `${day}::${ex.name}`;
                const item = state[key];
                if (!item) return null;

                return (
                  <div key={key} className="border rounded p-2">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-2">
                        <Checkbox checked={item.completed} onCheckedChange={() => toggle(key)} />
                        <div className="font-medium">{ex.name}</div>
                      </div>
                      <div className="text-xs text-gray-500">{ex.reps}</div>
                    </div>

                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-left">
                          <th>Set</th>
                          <th>Weight</th>
                          <th>Reps</th>
                          <th>Machine</th>
                        </tr>
                      </thead>
                      <tbody>
                        {item.sets.map((s, i) => (
                          <tr key={i}>
                            <td>{i + 1}</td>
                            <td>
                              <input
                                type="number"
                                className="border w-full px-1"
                                value={s.weight}
                                onChange={(e) => update(key, i, "weight", e.target.value)}
                              />
                            </td>
                            <td>
                              <input
                                type="number"
                                className="border w-full px-1"
                                value={s.reps}
                                onChange={(e) => update(key, i, "reps", e.target.value)}
                              />
                            </td>
                            <td>
                              <input
                                type="text"
                                className="border w-full px-1"
                                value={s.machine}
                                onChange={(e) => update(key, i, "machine", e.target.value)}
                              />
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
