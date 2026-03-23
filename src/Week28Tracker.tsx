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
  status?: "completed" | "skipped";
  sets: SetLog[];
};

type DayLog = Record<string, ExerciseLog>;

/* ================= WEEK 28 PLAN ================= */

const week28Plan = [
  {
    date: "Mon • Jan 5",
    label: "PUSH",
    exercises: [
      { name: "Machine Chest Press", reps: "6–8", sets: 4 },
      { name: "Incline DB Press (Supported)", reps: "8–10", sets: 3 },
      { name: "Seated Shoulder Press", reps: "8–10", sets: 3 },
      { name: "Cable Fly", reps: "12–15", sets: 3 },
      { name: "Rope Triceps Pushdown", reps: "12–15", sets: 3 },
    ],
  },
  {
    date: "Tue • Jan 6",
    label: "PULL",
    exercises: [
      { name: "Neutral Lat Pulldown", reps: "8–10", sets: 4 },
      { name: "Chest-Supported Row", reps: "8–10", sets: 4 },
      { name: "Single-Arm Machine Row", reps: "10–12", sets: 3 },
      { name: "Face Pull", reps: "12–15", sets: 3 },
      { name: "Preacher Curl", reps: "10–12", sets: 3 },
    ],
  },
  {
    date: "Wed • Jan 7",
    label: "LEGS",
    exercises: [
      { name: "Hack Squat (High & Wide)", reps: "8–10", sets: 4 },
      { name: "Seated Leg Curl", reps: "10–15", sets: 3 },
      { name: "Belt Squat / Supported Goblet", reps: "10–12", sets: 3 },
      { name: "Leg Extension", reps: "12–15", sets: 3 },
      { name: "Seated Calf Raise", reps: "12–20", sets: 4 },
    ],
  },
  {
    date: "Thu • Jan 8",
    label: "UPPER",
    exercises: [
      { name: "Incline Smith Press", reps: "8–10", sets: 3 },
      { name: "Assisted Pull-Up / Pulldown", reps: "8–12", sets: 3 },
      { name: "Machine Lateral Raise", reps: "12–15", sets: 3 },
      { name: "Cable Curl", reps: "12–15", sets: 2 },
      { name: "OH Cable Triceps Extension", reps: "12–15", sets: 2 },
    ],
  },
  {
    date: "Fri • Jan 9",
    label: "FULL BODY",
    exercises: [
      { name: "Leg Press (High & Wide)", reps: "10–12", sets: 3 },
      { name: "Machine Chest Press", reps: "10–12", sets: 3 },
      { name: "Seated Row", reps: "10–12", sets: 3 },
      { name: "Reverse Pec Deck", reps: "12–15", sets: 3 },
      { name: "Farmer Carry", reps: "30–45 sec", sets: 3 },
    ],
  },
  {
    date: "Sat • Jan 10",
    label: "CONDITIONING + CORE",
    exercises: [
      { name: "Incline Walk", reps: "30–45 min", sets: 1 },
      { name: "Pallof Press", reps: "12–15", sets: 3 },
      { name: "Dead Bug", reps: "10 / side", sets: 3 },
      { name: "Side Plank", reps: "30–45 sec", sets: 3 },
    ],
  },
  {
    date: "Sun • Jan 11",
    label: "RECOVERY",
    exercises: [
      { name: "Zone 2 Walk", reps: "45–60 min", sets: 1 },
      { name: "Mobility Flow", reps: "10 min", sets: 1 },
      { name: "Breathing / Decompression", reps: "5 min", sets: 1 },
    ],
  },
];

export default function Week28Tracker() {
  const [dayIndex, setDayIndex] = useState(0);
  const [log, setLog] = useState<Record<string, DayLog>>({});

  const day = week28Plan[dayIndex];

  useEffect(() => {
    const stored = localStorage.getItem("week28Log");
    if (stored) setLog(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem("week28Log", JSON.stringify(log));
  }, [log]);

  const updateSet = (
    ex: string,
    i: number,
    field: keyof SetLog,
    value: string
  ) => {
    setLog((prev) => {
      const existing = prev[day.label]?.[ex];
      const sets = existing?.sets
        ? [...existing.sets]
        : Array.from(
            { length: day.exercises.find((e) => e.name === ex)!.sets },
            () => ({})
          );

      sets[i] = { ...sets[i], [field]: value };

      return {
        ...prev,
        [day.label]: {
          ...prev[day.label],
          [ex]: { ...existing, sets },
        },
      };
    });
  };

  return (
    <ScrollArea className="max-w-md mx-auto p-4 space-y-4">
      {/* Header */}
      <div className="text-center font-bold text-lg">
        Week of Jan 5–11 — Week 28
      </div>

      {/* Day Navigation */}
      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          disabled={dayIndex === 0}
          onClick={() => setDayIndex((i) => i - 1)}
        >
          ◀
        </Button>
        <h2 className="font-bold">
          {day.date} — {day.label}
        </h2>
        <Button
          variant="outline"
          disabled={dayIndex === week28Plan.length - 1}
          onClick={() => setDayIndex((i) => i + 1)}
        >
          ▶
        </Button>
      </div>

      <Card className="rounded-2xl">
        <CardContent className="p-4 space-y-4">
          {day.exercises.map((e) => {
            const entry = log[day.label]?.[e.name];
            return (
              <div key={e.name} className="border rounded-xl p-3 space-y-2">
                <div className="font-semibold">{e.name}</div>

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
                          sets: entry?.sets || [],
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
