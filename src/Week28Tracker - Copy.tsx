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
      { name: "Machine Chest Press", reps: "6–10", sets: 4 },
      { name: "Incline DB Press (Supported)", reps: "8–10", sets: 4 },
      { name: "Seated Shoulder Press (Machine)", reps: "8–10", sets: 3 },
      { name: "Cable Fly (Low → High)", reps: "12–15", sets: 3 },
      { name: "Rope Triceps Pushdown", reps: "10–15", sets: 3 },
    ],
  },
  {
    date: "Tue• Jan 6",
    label: "PULL",
    exercises: [
      { name: "Neutral Grip Lat Pulldown", reps: "8–12", sets: 4 },
      { name: "Chest-Supported Row", reps: "8–10", sets: 4 },
      { name: "Single-Arm Machine Row", reps: "10–12", sets: 3 },
      { name: "Face Pull", reps: "12–15", sets: 3 },
      { name: "Preacher Curl", reps: "10–12", sets: 3 },
    ],
  },
  {
    date: "Wed • Jan 7",
    label: "LEGS (BACK SAFE)",
    exercises: [
      { name: "Hack Squat (High Foot)", reps: "8–10", sets: 4 },
      { name: "Seated Leg Curl", reps: "10–15", sets: 3 },
      { name: "Belt Squat", reps: "10–12", sets: 3 },
      { name: "Leg Extension", reps: "12–15", sets: 3 },
      { name: "Seated Calf Raise", reps: "12–20", sets: 4 },
    ],
  },
  {
    date: "Thu • Jan 8",
    label: "UPPER",
    exercises: [
      { name: "Incline Smith Press", reps: "8–10", sets: 4 },
      { name: "Assisted Pull-Up / Pulldown", reps: "8–12", sets: 4 },
      { name: "Machine Lateral Raise", reps: "12–15", sets: 4 },
      { name: "Cable Curl", reps: "12–15", sets: 3 },
      { name: "OH Cable Triceps Extension", reps: "12–15", sets: 3 },
    ],
  },
  {
    date: "Fri • Jan 9",
    label: "FULL BODY",
    exercises: [
      { name: "Leg Press (High & Wide)", reps: "10–12", sets: 4 },
      { name: "Machine Chest Press", reps: "10–12", sets: 3 },
      { name: "Seated Row", reps: "10–12", sets: 3 },
      { name: "Reverse Pec Deck", reps: "12–15", sets: 3 },
      { name: "Farmer Carry (Light)", reps: "30–45 sec", sets: 3 },
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
      { name: "Zone 2 Walk", reps: "45 min", sets: 1 },
      { name: "Mobility Flow", reps: "10 min", sets: 1 },
      { name: "Breathing / Decompression", reps: "5 min", sets: 1 },
    ],
  },
];

export default function Week28Tracker() {
  const [log, setLog] = useState<Record<string, DayLog>>({});

  useEffect(() => {
    const stored = localStorage.getItem("week28Log");
    if (stored) setLog(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem("week28Log", JSON.stringify(log));
  }, [log]);

  const updateSet = (
    day: string,
    ex: string,
    i: number,
    field: keyof SetLog,
    value: string
  ) => {
    setLog((prev) => {
      const existing = prev[day]?.[ex];
      const sets = existing?.sets
        ? [...existing.sets]
        : Array.from({ length: i + 1 }, () => ({}));

      sets[i] = { ...sets[i], [field]: value };

      return {
        ...prev,
        [day]: {
          ...prev[day],
          [ex]: {
            ...existing,
            sets,
          },
        },
      };
    });
  };

  const setStatus = (
    day: string,
    ex: string,
    status: "completed" | "skipped"
  ) =>
    setLog((p) => ({
      ...p,
      [day]: {
        ...p[day],
        [ex]: {
          ...p[day]?.[ex],
          status,
          sets: p[day]?.[ex]?.sets || [],
        },
      },
    }));

  return (
    <ScrollArea className="max-w-md mx-auto p-4">
      {week28Plan.map(({ date, label, exercises }) => (
        <Card key={date} className="mb-4 rounded-2xl">
          <CardContent className="p-4 space-y-4">
            <h2 className="text-lg font-bold">
              {date} — {label}
            </h2>

            {exercises.map((e) => {
              const entry = log[label]?.[e.name];
              return (
                <div key={e.name} className="border rounded-xl p-3 space-y-2">
                  <div className="font-semibold">{e.name}</div>

                  <Input
                    placeholder="Machine / Equipment"
                    value={entry?.machine || ""}
                    onChange={(ev) =>
                      setLog((p) => ({
                        ...p,
                        [label]: {
                          ...p[label],
                          [e.name]: {
                            ...p[label]?.[e.name],
                            machine: ev.target.value,
                            sets: entry?.sets || [],
                          },
                        },
                      }))
                    }
                  />

                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => setStatus(label, e.name, "completed")}>
                      ✅
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setStatus(label, e.name, "skipped")}>
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
                          onChange={(ev) =>
                            updateSet(label, e.name, i, "weight", ev.target.value)
                          }
                        />
                        <Input
                          className="w-14 h-8 text-sm"
                          placeholder="Reps"
                          onChange={(ev) =>
                            updateSet(label, e.name, i, "reps", ev.target.value)
                          }
                        />
                        <Input
                          className="w-12 h-8 text-sm"
                          placeholder="Pain"
                          onChange={(ev) =>
                            updateSet(label, e.name, i, "pain", ev.target.value)
                          }
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
