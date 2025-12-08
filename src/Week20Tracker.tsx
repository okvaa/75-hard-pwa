import { useState, useEffect } from "react";
import { Card, CardContent } from "./components/ui/card";
import { Checkbox } from "./components/ui/checkbox";
import { ScrollArea } from "./components/ui/scroll-area";

type SetEntry = { weight: string; reps: string };
type ExerciseState = { completed?: boolean; sets: SetEntry[] };

const START_DAY = 138;

const rawPlan = [
  { label: "📅 Week of Nov 24th to 30th", gym: [], outdoor: "" },

  {
    label: "Monday – Chest",
    gym: [
      { name: "Incline Bench Press", sets: 4 },
      { name: "Flat Dumbbell Press", sets: 4 },
      { name: "Cable Crossovers", sets: 3 },
      { name: "Machine Chest Press", sets: 3 },
      { name: "Push-ups (AMRAP)", sets: 1 },
    ],
    outdoor: "Push-ups + brisk walk",
  },

  {
    label: "Tuesday – Back",
    gym: [
      { name: "Rack Pull / Deadlift", sets: 4 },
      { name: "Wide Grip Pull-ups", sets: 4 },
      { name: "T-Bar Row", sets: 4 },
      { name: "Single Arm Lat Pulldown", sets: 3 },
      { name: "Face Pulls", sets: 3 },
    ],
    outdoor: "Ruck walk or pull-ups",
  },

  {
    label: "Wednesday – Legs (Heavy)",
    gym: [
      { name: "Pause Back Squat", sets: 5 },
      { name: "Hack Squat / Leg Press", sets: 4 },
      { name: "Romanian Deadlift", sets: 4 },
      { name: "Reverse Lunges", sets: 3 },
      { name: "Standing Calf Raise", sets: 4 },
    ],
    outdoor: "Hill sprints / stairs",
  },

  {
    label: "Thursday – Shoulders + Arms",
    gym: [
      { name: "Standing Overhead Press", sets: 4 },
      { name: "Dumbbell Lateral Raise", sets: 4 },
      { name: "Rear Delt Fly", sets: 3 },
      { name: "EZ Bar Curl", sets: 4 },
      { name: "Cable Triceps Pushdown", sets: 4 },
      { name: "Incline Dumbbell Curl", sets: 3 },
      { name: "Overhead Rope Extension", sets: 3 },
    ],
    outdoor: "Bands + short walk",
  },

  {
    label: "Friday – Legs (Volume)",
    gym: [
      { name: "Front Squat", sets: 4 },
      { name: "Leg Extension", sets: 4 },
      { name: "Nordic Curl / Ham Variation", sets: 4 },
      { name: "Hip Thrust / Glute Bridge", sets: 3 },
      { name: "Seated Calf Raise", sets: 4 },
    ],
    outdoor: "Weighted step-ups",
  },

  {
    label: "Saturday – Conditioning + Arms",
    gym: [
      { name: "Sled Push Rounds", sets: 8 },
      { name: "Battle Ropes", sets: 3 },
      { name: "Kettlebell Clean & Press", sets: 3 },
      { name: "Preacher Curls", sets: 3 },
      { name: "Triceps Dips", sets: 3 },
    ],
    outdoor: "Intervals outside",
  },

  {
    label: "Sunday – TRX & Recovery",
    gym: [
      { name: "TRX Row", sets: 4, repRange: "10-12" },
      { name: "TRX Chest Press", sets: 4, repRange: "10-12" },
      { name: "TRX Split Squat", sets: 3, repRange: "12/leg" },
      { name: "TRX Biceps Curl", sets: 3, repRange: "12-15" },
      { name: "TRX Triceps Extension", sets: 3, repRange: "12-15" },
      { name: "TRX Hamstring Curl", sets: 3, repRange: "10-12" },
      { name: "TRX Pike", sets: 3, repRange: "8-10" },
      { name: "Stretch Flow (10 min)", sets: 1 },
    ],
    outdoor: "Walk or bike",
  },
];

const week21Plan = rawPlan.map((entry, index) => {
  if (index === 0) return entry;
  const dayNum = START_DAY + (index - 1);
  return { ...entry, day: `(${dayNum}) ${entry.label}` };
});

export default function Week21Tracker() {
  const [completedState, setCompletedState] = useState<
    Record<string, ExerciseState>
  >({});

  useEffect(() => {
    const stored = localStorage.getItem("week21Progress");
    if (stored) {
      setCompletedState(JSON.parse(stored));
      return;
    }

    const defaults: Record<string, ExerciseState> = {};
    for (const block of week21Plan) {
      block.gym?.forEach((ex: any) => {
        const setCount = ex.sets ?? 3;
        const sets = Array.from({ length: setCount }).map(() => ({
          weight: "",
          reps: "",
        }));
        defaults[`${block.day}::${ex.name}`] = { completed: false, sets };
      });

      if (block.outdoor)
        defaults[`${block.day}::outdoor`] = { completed: false, sets: [] };
    }

    setCompletedState(defaults);
  }, []);

  useEffect(() => {
    localStorage.setItem("week21Progress", JSON.stringify(completedState));
  }, [completedState]);

  const toggleExercise = (key: string) => {
    setCompletedState((prev) => ({
      ...prev,
      [key]: { ...prev[key], completed: !prev[key]?.completed },
    }));
  };

  const updateSet = (
    key: string,
    idx: number,
    field: "weight" | "reps",
    value: string
  ) => {
    setCompletedState((prev) => {
      const item = prev[key];
      if (!item) return prev;

      const newSets = item.sets.map((s, i) =>
        i === idx ? { ...s, [field]: value } : s
      );

      return { ...prev, [key]: { ...item, sets: newSets } };
    });
  };

  const addSet = (key: string) => {
    setCompletedState((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        sets: [...prev[key].sets, { weight: "", reps: "" }],
      },
    }));
  };

  const removeSet = (key: string, idx: number) =>
    setCompletedState((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        sets: prev[key].sets.filter((_, i) => i !== idx),
      },
    }));

  return (
    <ScrollArea className="p-4 max-w-md mx-auto space-y-4">
      {week21Plan.map(({ day, gym, outdoor }) => (
        <Card key={day}>
          <CardContent className="p-4">
            {!gym.length ? (
              <h2 className="text-xl font-bold text-center">{day}</h2>
            ) : (
              <>
                <h2 className="text-xl font-bold mb-3">{day}</h2>

                <h3 className="font-semibold mb-1">Gym:</h3>
                <div className="space-y-4">
                  {gym.map((ex: any) => {
                    const key = `${day}::${ex.name}`;
                    const state = completedState[key];

                    return (
                      <div key={key} className="border rounded p-2">
                        <div className="flex justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Checkbox
                              checked={!!state?.completed}
                              onCheckedChange={() => toggleExercise(key)}
                            />
                            <div>
                              <div className="font-medium">{ex.name}</div>
                              {ex.repRange && (
                                <div className="text-xs text-gray-500">
                                  Target: {ex.repRange}
                                </div>
                              )}
                            </div>
                          </div>

                          <button
                            className="text-xs px-2 py-1 border rounded"
                            onClick={() => addSet(key)}
                          >
                            Add set
                          </button>
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
                            {state?.sets?.map((s, i) => (
                              <tr key={i}>
                                <td>{i + 1}</td>
                                <td>
                                  <input
                                    className="w-full border rounded p-1"
                                    type="number"
                                    value={s.weight}
                                    onChange={(e) =>
                                      updateSet(key, i, "weight", e.target.value)
                                    }
                                  />
                                </td>
                                <td>
                                  <input
                                    className="w-full border rounded p-1"
                                    type="number"
                                    value={s.reps}
                                    onChange={(e) =>
                                      updateSet(key, i, "reps", e.target.value)
                                    }
                                  />
                                </td>
                                <td>
                                  <button
                                    className="text-xs border px-2 py-1 rounded"
                                    onClick={() => removeSet(key, i)}
                                  >
                                    Remove
                                  </button>
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
                  <Checkbox
                    checked={
                      !!completedState[`${day}::outdoor`]?.completed
                    }
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
  );
}
