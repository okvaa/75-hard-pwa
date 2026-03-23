import { useState, useEffect } from "react";
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

/* ================= WEEK 26 PLAN ================= */

const week26 = [
  {
    date: "Mon • Dec 22",
    label: "PUSH",
    exercises: [
      { name: "Machine Chest Press", reps: "6–10", sets: 4 },
      { name: "Incline DB Press", reps: "8–10", sets: 4 },
      { name: "Seated Shoulder Press", reps: "8–10", sets: 3 },
      { name: "Cable Fly", reps: "12–15", sets: 3 },
      { name: "Rope Triceps Pushdown", reps: "10–15", sets: 3 },
    ],
  },
  {
    date: "Tue • Dec 23",
    label: "PULL",
    exercises: [
      { name: "Neutral Lat Pulldown", reps: "8–12", sets: 4 },
      { name: "Chest-Supported Row", reps: "8–10", sets: 4 },
      { name: "Single-Arm Machine Row", reps: "10–12", sets: 3 },
      { name: "Face Pull", reps: "12–15", sets: 3 },
      { name: "Preacher Curl", reps: "10–12", sets: 3 },
    ],
  },
  {
    date: "Wed • Dec 24",
    label: "LEGS",
    exercises: [
      { name: "Hack Squat", reps: "8–10", sets: 4 },
      { name: "Seated Leg Curl", reps: "10–15", sets: 3 },
      { name: "Belt Squat", reps: "10–12", sets: 3 },
      { name: "Leg Extension", reps: "12–15", sets: 3 },
      { name: "Seated Calf Raise", reps: "12–20", sets: 4 },
    ],
  },
  {
    date: "Thu • Dec 25",
    label: "UPPER",
    exercises: [
      { name: "Incline Smith Press", reps: "8–10", sets: 4 },
      { name: "Assisted Pull-Up", reps: "8–12", sets: 4 },
      { name: "Machine Lateral Raise", reps: "12–15", sets: 4 },
      { name: "Cable Curl", reps: "12–15", sets: 3 },
      { name: "Overhead Triceps Extension", reps: "12–15", sets: 3 },
    ],
  },
  {
    date: "Fri • Dec 26",
    label: "FULL BODY",
    exercises: [
      { name: "Leg Press", reps: "10–12", sets: 4 },
      { name: "Machine Chest Press", reps: "10–12", sets: 3 },
      { name: "Seated Row", reps: "10–12", sets: 3 },
      { name: "Reverse Pec Deck", reps: "12–15", sets: 3 },
      { name: "Farmer Carry", reps: "30–45 sec", sets: 3 },
    ],
  },
  {
    date: "Sat • Dec 27",
    label: "CONDITIONING",
    exercises: [
      { name: "Incline Walk", reps: "30–45 min", sets: 1 },
      { name: "Pallof Press", reps: "12–15", sets: 3 },
      { name: "Dead Bug", reps: "10 / side", sets: 3 },
      { name: "Side Plank", reps: "30–45 sec", sets: 3 },
    ],
  },
  {
    date: "Sun • Dec 28",
    label: "RECOVERY",
    exercises: [
      { name: "Zone 2 Walk", reps: "45 min", sets: 1 },
      { name: "Mobility Flow", reps: "10 min", sets: 1 },
      { name: "Breathing / Decompression", reps: "5 min", sets: 1 },
    ],
  },
];

/* ================= COMPONENT ================= */

export default function Week26Tracker() {
  const [dayIndex, setDayIndex] = useState(0);
  const [log, setLog] = useState<Record<string, DayLog>>({});

  /* Load */
  useEffect(() => {
    const stored = localStorage.getItem("week26Log");
    if (stored) setLog(JSON.parse(stored));
  }, []);

  /* Save */
  useEffect(() => {
    localStorage.setItem("week26Log", JSON.stringify(log));
  }, [log]);

  const day = week26[dayIndex];

  const updateSet = (
    ex: string,
    setIndex: number,
    field: keyof SetLog,
    value: string
  ) => {
    setLog((prev) => {
      const existing = prev[day.label]?.[ex];

      const sets =
        existing?.sets?.length
          ? [...existing.sets]
          : Array.from({ length: setIndex + 1 }, () => ({}));

      sets[setIndex] = { ...sets[setIndex], [field]: value };

      return {
        ...prev,
        [day.label]: {
          ...prev[day.label],
          [ex]: {
            ...existing,
            sets,
          },
        },
      };
    });
  };

  const setStatus = (ex: string, status: "completed" | "skipped") =>
    setLog((prev) => ({
      ...prev,
      [day.label]: {
        ...prev[day.label],
        [ex]: {
          ...prev[day.label]?.[ex],
          sets: prev[day.label]?.[ex]?.sets || [],
          status,
        },
      },
    }));

  return (
    <ScrollArea className="max-w-md mx-auto p-4 space-y-4">
      {/* Header */}
      <div className="text-center font-bold text-lg">
        Week of Dec 22–28
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <Button
          size="sm"
          variant="outline"
          onClick={() => setDayIndex((i) => Math.max(0, i - 1))}
          disabled={dayIndex === 0}
        >
          ◀
        </Button>

        <div className="font-semibold">
          {day.date} — {day.label}
        </div>

        <Button
          size="sm"
          variant="outline"
          onClick={() =>
            setDayIndex((i) => Math.min(week26.length - 1, i + 1))
          }
          disabled={dayIndex === week26.length - 1}
        >
          ▶
        </Button>
      </div>

      {/* Day */}
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

                <div className="flex gap-2">
                  <Button size="sm" onClick={() => setStatus(e.name, "completed")}>
                    ✅
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setStatus(e.name, "skipped")}
                  >
                    ⏭
                  </Button>
                </div>

                {entry?.status !== "skipped" &&
                  [...Array(e.sets)].map((_, i) => (
                    <div key={i} className="flex gap-2 items-center">
                      <span className="text-xs w-10">S{i + 1}</span>
                      <span className="text-xs w-16">{e.reps}</span>

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
