import { useState, useEffect } from "react";
import { Card, CardContent } from "./components/ui/card";
import { Checkbox } from "./components/ui/checkbox";
import { Input } from "./components/ui/input";
import { ScrollArea } from "./components/ui/scroll-area";

type SetLog = {
  weight: string;
  reps: string;
};

type ExerciseLog = {
  completed: boolean;
  skipped: boolean;
  machine: string;
  sets: SetLog[];
};

type DayLog = Record<string, ExerciseLog>;

const week25Plan = [
  {
    day: "Monday – PUSH (Back Friendly)",
    exercises: [
      { name: "Machine Chest Press", reps: "6–10", sets: 4 },
      { name: "Incline DB Press (Supported)", reps: "8–10", sets: 4 },
      { name: "Seated Shoulder Press (Machine)", reps: "8–10", sets: 3 },
      { name: "Cable Fly", reps: "12–15", sets: 3 },
      { name: "Rope Triceps Pushdown", reps: "10–15", sets: 3 },
    ],
  },
  {
    day: "Tuesday – PULL (No Spinal Load)",
    exercises: [
      { name: "Neutral Lat Pulldown", reps: "8–12", sets: 4 },
      { name: "Chest-Supported Row", reps: "8–10", sets: 4 },
      { name: "Single-Arm Machine Row", reps: "10–12", sets: 3 },
      { name: "Face Pull", reps: "12–15", sets: 3 },
      { name: "Preacher Curl", reps: "10–12", sets: 3 },
    ],
  },
  {
    day: "Wednesday – LEGS (Back Safe)",
    exercises: [
      { name: "Hack Squat (High Foot)", reps: "8–10", sets: 4 },
      { name: "Seated Leg Curl", reps: "10–15", sets: 3 },
      { name: "Belt Squat", reps: "10–12", sets: 3 },
      { name: "Leg Extension", reps: "12–15", sets: 3 },
      { name: "Seated Calf Raise", reps: "12–20", sets: 4 },
    ],
  },
  {
    day: "Thursday – UPPER (Hypertrophy)",
    exercises: [
      { name: "Incline Smith Press", reps: "8–10", sets: 4 },
      { name: "Assisted Pull-Up / Pulldown", reps: "8–12", sets: 4 },
      { name: "Machine Lateral Raise", reps: "12–15", sets: 4 },
      { name: "Cable Curl", reps: "12–15", sets: 3 },
      { name: "OH Cable Triceps Extension", reps: "12–15", sets: 3 },
    ],
  },
  {
    day: "Friday – FULL BODY (Spine Neutral)",
    exercises: [
      { name: "Leg Press (High & Wide)", reps: "10–12", sets: 4 },
      { name: "Machine Chest Press", reps: "10–12", sets: 3 },
      { name: "Seated Row", reps: "10–12", sets: 3 },
      { name: "Reverse Pec Deck", reps: "12–15", sets: 3 },
      { name: "Farmer Carry (Optional)", reps: "30 sec", sets: 3 },
    ],
  },
  {
    day: "Saturday – Conditioning + Core",
    exercises: [
      { name: "Incline Treadmill Walk", reps: "30–45 min", sets: 1 },
      { name: "Pallof Press", reps: "12–15", sets: 3 },
      { name: "Dead Bug", reps: "10 / side", sets: 3 },
      { name: "Side Plank", reps: "30–45 sec", sets: 3 },
    ],
  },
  {
    day: "Sunday – Recovery / Reset",
    exercises: [
      { name: "Zone 2 Walk", reps: "45 min", sets: 1 },
      { name: "Hip Mobility Flow", reps: "10 min", sets: 1 },
      { name: "Thoracic Mobility", reps: "5–10 min", sets: 1 },
      { name: "Breathing / Decompression", reps: "5 min", sets: 1 },
    ],
  },
];

export default function Week25Tracker() {
  const [log, setLog] = useState<Record<string, DayLog>>({});

  useEffect(() => {
    const stored = localStorage.getItem("week25Log");
    if (stored) setLog(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem("week25Log", JSON.stringify(log));
  }, [log]);

  const initExercise = (day: string, name: string, sets: number) => ({
    completed: false,
    skipped: false,
    machine: "",
    sets: Array.from({ length: sets }, () => ({ weight: "", reps: "" })),
  });

  return (
    <ScrollArea className="p-4 max-w-md mx-auto">
      {week25Plan.map(({ day, exercises }) => (
        <Card key={day} className="mb-4 rounded-2xl shadow-md">
          <CardContent className="p-4 space-y-4">
            <h2 className="text-xl font-bold">{day}</h2>

            {exercises.map(({ name, reps, sets }) => {
              const ex =
                log[day]?.[name] ||
                initExercise(day, name, sets);

              return (
                <div key={name} className="border rounded-xl p-3 space-y-2">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={ex.completed}
                      onCheckedChange={() =>
                        setLog((prev) => ({
                          ...prev,
                          [day]: {
                            ...prev[day],
                            [name]: { ...ex, completed: !ex.completed },
                          },
                        }))
                      }
                    />
                    <span className="font-semibold flex-1">{name}</span>
                    <button
                      className="text-xs text-muted-foreground"
                      onClick={() =>
                        setLog((prev) => ({
                          ...prev,
                          [day]: {
                            ...prev[day],
                            [name]: { ...ex, skipped: !ex.skipped },
                          },
                        }))
                      }
                    >
                      {ex.skipped ? "Skipped" : "Skip"}
                    </button>
                  </div>

                  <Input
                    placeholder="Machine / Equipment"
                    value={ex.machine}
                    onChange={(e) =>
                      setLog((prev) => ({
                        ...prev,
                        [day]: {
                          ...prev[day],
                          [name]: { ...ex, machine: e.target.value },
                        },
                      }))
                    }
                  />

                  {!ex.skipped &&
                    ex.sets.map((set, i) => (
                      <div key={i} className="flex items-center gap-2 mt-1">
                        <span className="text-xs w-10">Set {i + 1}</span>
                        <span className="text-xs w-16 text-muted-foreground">
                          {reps}
                        </span>
                        <Input
                          className="w-16 h-8 text-sm"
                          placeholder="Wt"
                          value={set.weight}
                          onChange={(e) => {
                            const newSets = [...ex.sets];
                            newSets[i].weight = e.target.value;
                            setLog((prev) => ({
                              ...prev,
                              [day]: {
                                ...prev[day],
                                [name]: { ...ex, sets: newSets },
                              },
                            }));
                          }}
                        />
                        <Input
                          className="w-14 h-8 text-sm"
                          placeholder="Reps"
                          value={set.reps}
                          onChange={(e) => {
                            const newSets = [...ex.sets];
                            newSets[i].reps = e.target.value;
                            setLog((prev) => ({
                              ...prev,
                              [day]: {
                                ...prev[day],
                                [name]: { ...ex, sets: newSets },
                              },
                            }));
                          }}
                        />
                      </div>
                    ))}
                </div>
              );
            })}
          </CardContent>
        </Card>
      ))}
    </ScrollArea>
  );
}
