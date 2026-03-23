import { useEffect, useState } from "react";
import { Card, CardContent } from "./components/ui/card";
import { Input } from "./components/ui/input";
import { Button } from "./components/ui/button";
import { ScrollArea } from "./components/ui/scroll-area";

/* ================= TYPES ================= */

type SetLog = {
  weight?: string;
  reps?: string;
  pain?: string;
};

type ExerciseLog = {
  machine?: string;
  sets?: SetLog[];
};

type DayLog = Record<string, ExerciseLog>;

type TrainingLog = {
  [day: string]: DayLog;
};
const STORAGE_KEY = "week31-training-log";

/* ================= WEEK 31 PLAN ================= */

const week31Plan = [
  {
    date: "Mon • Jan 26",
    label: "PUSH",
    exercises: [
      { name: "Exercise Bike", reps: "5 min", sets: 1 },
      { name: "Foam Roller + Mobility", reps: "1", sets: 1 },
      { name: "Machine Chest Press", reps: "6–8", sets: 4 },
      { name: "Incline DB Press (Neutral)", reps: "8–10", sets: 3 },
      { name: "Seated Machine Shoulder Press", reps: "8–10", sets: 3 },
      { name: "Cable Fly", reps: "12–15", sets: 3 },
      { name: "Rope Triceps Pushdown", reps: "12–15", sets: 3 },
      { name: "Pallof Press", reps: "12–15 / side", sets: 3 },
      { name: "Dead Bug", reps: "10 / side", sets: 3 },
      { name: "Chin Tucks", reps: "15", sets: 3 },
      { name: "Platysma Exercise", reps: "15", sets: 3 },
      { name: "Tongue Press", reps: "15", sets: 3 },
    ],
  },
  {
    date: "Tue • Jan 27",
    label: "PULL",
    exercises: [
      { name: "Exercise Bike", reps: "5 min", sets: 1 },
      { name: "Neutral-Grip Lat Pulldown", reps: "8–10", sets: 4 },
      { name: "Chest-Supported Row", reps: "8–10", sets: 4 },
      { name: "Single-Arm Machine Row", reps: "10–12", sets: 3 },
      { name: "Face Pull", reps: "12–15", sets: 3 },
      { name: "Preacher Curl", reps: "10–12", sets: 3 },
       // ABS
      { name: "Hanging Knee Raise", reps: "10–15", sets: 3 },
      // Neck
      { name: "Chin Tucks", reps: "15", sets: 3 },
      { name: "Platysma Exercise", reps: "15", sets: 3 },
      { name: "Tongue Press", reps: "15", sets: 3 }, 
    ],
  },
  {
    date: "Wed • Jan 28",
    label: "LEGS",
    exercises: [
      { name: "Exercise Bike", reps: "5 min", sets: 1 },
      { name: "Foam Roller + Mobility", reps: "1", sets: 1 },
      { name: "Seated Calf Raise", reps: "12–20", sets: 4 },
      { name: "Hack Squat (High & Wide)", reps: "8–10", sets: 4 },
      { name: "Belt Squat / Supported Goblet", reps: "10–12", sets: 3 },
      { name: "Seated Leg Curl", reps: "10–15", sets: 3 },
      { name: "Leg Extension", reps: "12–15", sets: 3 },
      // Neck
      { name: "Chin Tucks", reps: "15", sets: 3 },
      { name: "Platysma Exercise", reps: "15", sets: 3 },
      { name: "Tongue Press", reps: "15", sets: 3 }, 
    ],
  },
  {
    date: "Thu • Jan 29",
    label: "UPPER",
    exercises: [
      { name: "Exercise Bike", reps: "5 min", sets: 1 },
      { name: "Incline Smith Press", reps: "8–10", sets: 3 },
      { name: "Assisted Pull-Up", reps: "8–12", sets: 3 },
      { name: "Machine Lateral Raise", reps: "12–15", sets: 3 },
      { name: "Cable Curl", reps: "12–15", sets: 2 },
      { name: "OH Cable Triceps Extension", reps: "12–15", sets: 2 },
      // ABS
      { name: "Cable Crunch", reps: "12–15", sets: 3 },
      { name: "Pallof Press", reps: "10–12 / side", sets: 2 },
      // Neck
      { name: "Chin Tucks", reps: "15", sets: 3 },
      { name: "Platysma Exercise", reps: "15", sets: 3 },
      { name: "Tongue Press", reps: "15", sets: 3 }, 
    ],
  },
  {
    date: "Fri • Jan 30",
    label: "FULL BODY",
    exercises: [
      { name: "Exercise Bike", reps: "5 min", sets: 1 },
      { name: "Foam Roller + Mobility", reps: "1", sets: 1 },
      { name: "Leg Press", reps: "10–12", sets: 3 },
      { name: "Machine Chest Press", reps: "10–12", sets: 3 },
      { name: "Seated Row", reps: "10–12", sets: 3 },
      { name: "Reverse Pec Deck", reps: "12–15", sets: 3 },
      { name: "Farmer Carry", reps: "30–40 sec", sets: 3 },
      // Neck
      { name: "Chin Tucks", reps: "15", sets: 3 },
      { name: "Platysma Exercise", reps: "15", sets: 3 },
      { name: "Tongue Press", reps: "15", sets: 3 }, 
    ],
  },
  {
    date: "Sat • Jan 31",
    label: "CONDITIONING",
    exercises: [
      { name: "Incline Walk", reps: "30–45 min", sets: 1 },
      { name: "Pallof Press", reps: "12–15", sets: 3 },
      { name: "Dead Bug", reps: "10 / side", sets: 3 },
      { name: "Side Plank", reps: "30–45 sec", sets: 3 },
      // Neck
      { name: "Chin Tucks", reps: "15", sets: 3 },
      { name: "Platysma Exercise", reps: "15", sets: 3 },
      { name: "Tongue Press", reps: "15", sets: 3 }, 
    ],
  },
  {
    date: "Sun • Feb 1",
    label: "RECOVERY",
    exercises: [
      { name: "Zone 2 Walk", reps: "45–60 min", sets: 1 },
      { name: "Mobility Flow", reps: "10 min", sets: 1 },
      { name: "Breathing / Decompression", reps: "5 min", sets: 1 },
      // Neck
      { name: "Chin Tucks", reps: "15", sets: 3 },
      { name: "Platysma Exercise", reps: "15", sets: 3 },
      { name: "Tongue Press", reps: "15", sets: 3 }, 
    ],
  },
];
/* ================= COMPONENT ================= */

export default function Week31Tracker() {
  const [dayIndex, setDayIndex] = useState(0);
  
  const [log, setLog] = useState<TrainingLog>({});

  const day = week31Plan[dayIndex];

  /* Load from localStorage */
  useEffect(() => {
     const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) setLog(JSON.parse(stored));
  }, []);

  /* Save to localStorage */
  useEffect(() => {
   localStorage.setItem(STORAGE_KEY, JSON.stringify(log));
  }, [log]);

  /* Update a single set */
  const updateSet = (
    exercise: string,
    setIndex: number,
    field: keyof SetLog,
    value: string
  ) => {
    setLog((prev) => {
      const dayLog = prev[day.label] ?? {};
      const existing = dayLog[exercise];
      const plan = day.exercises.find((e) => e.name === exercise)!;

      const sets =
        existing?.sets ??
        Array.from({ length: plan.sets }, () => ({
          weight: "",
          reps: "",
          pain: "",
        }));

      sets[setIndex] = { ...sets[setIndex], [field]: value };

      return {
        ...prev,
        [day.label]: {
          ...dayLog,
          [exercise]: { ...existing, sets },
        },
      };
    });
  };

/* ✅ Completion = user-entered reps only */
  const isExerciseComplete = (
    entry: ExerciseLog | undefined,
    totalSets: number
  ) => {
    if (!entry?.sets) return false;
    return (
      entry.sets.filter((s) => s.reps && s.reps.trim() !== "").length ===
      totalSets
    );
  };

 /* ⬇️ DOWNLOAD TRAINING LOG */
  const downloadLog = () => {
    const blob = new Blob([JSON.stringify(log, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "week31-training-log.json";
    a.click();

    URL.revokeObjectURL(url);
  };

  return (
    <ScrollArea className="max-w-md mx-auto p-4 space-y-4">
      <div className="text-center font-bold text-lg">
        Week of Jan 26 – Feb 1 • Week 31
      </div>
       
       {/* ⬇️ DOWNLOAD BUTTON */}
      <Button onClick={downloadLog} className="w-full">
        Download Training Log
      </Button>

      <div className="flex justify-between items-center">
        <Button disabled={dayIndex === 0} onClick={() => setDayIndex((i) => i - 1)}>
          ◀
        </Button>
        <h2 className="font-bold">
          {day.date} — {day.label}
        </h2>
        <Button
          disabled={dayIndex === week31Plan.length - 1}
          onClick={() => setDayIndex((i) => i + 1)}
        >
          ▶
        </Button>
      </div>

      <Card className="rounded-2xl">
        <CardContent className="p-4 space-y-4">
          {day.exercises.map((e) => {
            const entry = log[day.label]?.[e.name];
            const completed = isExerciseComplete(entry, e.sets);

            return (
              <div
                key={e.name}
                className={`border rounded-xl p-3 space-y-2 ${
                  completed ? "bg-green-50 border-green-600" : ""
                }`}
              >
                <div className="font-semibold flex justify-between">
                  <span>{e.name}</span>
                  {completed && <span className="text-green-600">✓</span>}
                </div>

                <div className="text-xs text-muted-foreground">
                  {e.sets} sets × {e.reps}
                </div>

                {/* 👇 Machine no longer creates sets */}
                <Input
                  placeholder="Machine / Equipment"
                  value={entry?.machine || ""}
                  onChange={(ev) =>
                    setLog((p) => ({
                      ...p,
                      [day.label]: {
                        ...p[day.label],
                        [e.name]: {
                          ...p[day.label]?.[e.name],
                          machine: ev.target.value,
                        },
                      },
                    }))
                  }
                />

                {[...Array(e.sets)].map((_, i) => (
                  <div key={i} className="flex gap-2 items-center">
                    <span className="text-xs w-8">S{i + 1}</span>
                    <Input
                      className="w-16 h-8 text-sm"
                      placeholder="Wt"
                      value={entry?.sets?.[i]?.weight || ""}
                      onChange={(ev) =>
                        updateSet(e.name, i, "weight", ev.target.value)
                      }
                    />
                    <Input
                      className="w-14 h-8 text-sm"
                      placeholder="Reps"
                      value={entry?.sets?.[i]?.reps || ""}
                      onChange={(ev) =>
                        updateSet(e.name, i, "reps", ev.target.value)
                      }
                    />
                    <Input
                      className="w-12 h-8 text-sm"
                      placeholder="Pain"
                      value={entry?.sets?.[i]?.pain || ""}
                      onChange={(ev) =>
                        updateSet(e.name, i, "pain", ev.target.value)
                      }
                    />
                  </div>
                ))}
              </div>
            );
          })}
        </CardContent>
      </Card>
    </ScrollArea>
  );
}