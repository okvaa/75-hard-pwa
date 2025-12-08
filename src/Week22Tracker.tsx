import { useState, useEffect } from "react";
import { Card, CardContent } from "./components/ui/card";
import { Checkbox } from "./components/ui/checkbox";
import { ScrollArea } from "./components/ui/scroll-area";

type SetEntry = { weight: string; reps: string; machine: string };
type ExerciseState = { completed?: boolean; sets: SetEntry[] };

const week22Plan = [
  { day: "📅 Week of Dec 1st–7th (Week 22)", },

  { day: "🔴 (146) Monday – Chest (Spine-Safe)", gym: [
      { name: "Machine Chest Press", sets: 4, reps: "8–12" },
      { name: "Incline Dumbbell Bench (neutral grip)", sets: 4, reps: "8–12" },
      { name: "Pec Deck / Cable Fly", sets: 3, reps: "12–15" },
      { name: "Chest Press Drop Set", sets: 1, reps: "AMRAP" },
    ], outdoor: "1-hour walk" },

  { day: "🔵 (147) Tuesday – Back (NO Deadlift)", gym: [
      { name: "Lat Pulldown (wide)", sets: 4, reps: "8–12" },
      { name: "Seated Row Machine", sets: 4, reps: "8–12" },
      { name: "Single Arm Lat Pulldown", sets: 3, reps: "10–12" },
      { name: "Back Extension (gentle)", sets: 2, reps: "15" },
    ], outdoor: "1-hour walk" },

  { day: "🟣 (148) Wednesday – Legs (Back-Friendly)", gym: [
      { name: "Leg Press (feet high)", sets: 4, reps: "10–15" },
      { name: "Quad Extension", sets: 3, reps: "12–15" },
      { name: "Seated Hamstring Curl", sets: 3, reps: "12–15" },
      { name: "Calf Press on Leg Press", sets: 4, reps: "15–20" },
    ], outdoor: "1-hour walk" },

  { day: "🟠 (149) Thursday – Shoulders + Light Arms", gym: [
      { name: "Machine Shoulder Press", sets: 4, reps: "8–12" },
      { name: "Cable Lateral Raise", sets: 3, reps: "12–15" },
      { name: "Rear Delt Machine", sets: 3, reps: "12–15" },
      { name: "Cable Curl", sets: 3, reps: "10–12" },
      { name: "Rope Triceps Pressdown", sets: 3, reps: "10–12" },
    ], outdoor: "1-hour walk" },

  { day: "🟡 (150) Friday – Chest + Arms Pump", gym: [
      { name: "Hammer Strength Chest Press", sets: 4, reps: "8–12" },
      { name: "Cable Fly (high → low)", sets: 3, reps: "12–15" },
      { name: "Machine Biceps Curl", sets: 3, reps: "12–15" },
      { name: "Machine Triceps Dip", sets: 3, reps: "10–12" },
    ], outdoor: "1-hour walk" },

  { day: "🟢 (151) Saturday – Conditioning (Back-Safe)", gym: [
      { name: "Sled Push (light)", sets: 8, reps: "20–40 ft" },
      { name: "Bike Sprint Intervals", sets: 5, reps: "30 sec" },
      { name: "Core: Cable Pallof Press", sets: 3, reps: "12–15" },
    ], outdoor: "1-hour walk" },

  { day: "⚪ (152) Sunday – TRX & Recovery", gym: [
      { name: "TRX Row", sets: 4, reps: "10–12" },
      { name: "TRX Chest Press", sets: 4, reps: "10–12" },
      { name: "TRX Split Squat", sets: 3, reps: "12/leg" },
      { name: "TRX Biceps Curl", sets: 3, reps: "12–15" },
      { name: "TRX Triceps Extension", sets: 3, reps: "12–15" },
      { name: "Stretch Flow", sets: 1, reps: "10 min" },
    ], outdoor: "1-hour walk" },
];

export default function Week22Tracker() {
  const [state, setState] = useState<Record<string, ExerciseState>>({});

  useEffect(() => {
    const stored = localStorage.getItem("week22Progress");
    if (stored) return setState(JSON.parse(stored));

    const defaults: Record<string, ExerciseState> = {};
    week22Plan.forEach((b) => {
      b.gym.forEach((ex: any) => {
        defaults[`${b.day}::${ex.name}`] = {
          completed: false,
          sets: Array.from({ length: ex.sets }).map(() => ({
            weight: "",
            reps: "",
            machine: "",
          })),
        };
      });
      defaults[`${b.day}::outdoor`] = { completed: false, sets: [] };
    });
    setState(defaults);
  }, []);

  useEffect(() => {
    localStorage.setItem("week22Progress", JSON.stringify(state));
  }, [state]);

  const toggle = (k: string) =>
    setState((p) => ({ ...p, [k]: { ...p[k], completed: !p[k].completed } }));

  const update = (k: string, i: number, f: keyof SetEntry, val: string) =>
    setState((p) => ({
      ...p,
      [k]: {
        ...p[k],
        sets: p[k].sets.map((s, idx) =>
          idx === i ? { ...s, [f]: val } : s
        ),
      },
    }));

  return (
    <ScrollArea className="p-4 max-w-md mx-auto space-y-4">
      {week22Plan.map(({ day, gym, outdoor }) => (
        <Card key={day}>
          <CardContent className="p-4">
            <h2 className="text-xl font-bold mb-2">{day}</h2>

            {gym.map((ex: any) => {
              const key = `${day}::${ex.name}`;
              const item = state[key];
              if (!item) return null;

              return (
                <div key={key} className="border rounded p-2 mb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Checkbox checked={item.completed} onCheckedChange={() => toggle(key)} />
                      <span className="font-semibold">{ex.name}</span>
                    </div>
                    <span className="text-xs text-gray-500">{ex.reps}</span>
                  </div>

                  <table className="w-full text-sm mt-2">
                    <thead>
                      <tr>
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
