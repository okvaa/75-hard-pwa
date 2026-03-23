import { useEffect, useState, useMemo } from "react";
import { Card, CardContent } from "./components/ui/card";
import { Input } from "./components/ui/input";
import { Button } from "./components/ui/button";
import { ScrollArea } from "./components/ui/scroll-area";

/* ================= TYPES ================= */

// type SetLog = { weight?: string; reps?: string; pain?: string; };
// type ExerciseLog = { machine?: string; sets?: SetLog[]; completed?: boolean; };
// type DayLog = Record<string, ExerciseLog>;

/* ================= CARDIO ================= */

const isCardioExercise = (name) =>
  [
    "Exercise Bike",
    "Incline Walk",
    "Zone 2 Walk",
    "Mobility Flow",
    "Breathing / Decompression",
    "Foam Roller + Mobility",
  ].includes(name);

/* ================= WEEK 36 PLAN ================= */

const week36Plan = [
  {
    date: "Mon • Week 36",
    label: "PUSH",
    exercises: [
      { name: "Incline Walk", reps: "5 min", sets: 1 },
      { name: "Smith Flat Press", target: "", reps: "6–8", sets: 4 },
      { name: "Low Incline DB Press", target: "", reps: "8–10", sets: 3 },
      { name: "Cable Fly (Deep Stretch)", target: "", reps: "12–15", sets: 3 },
      { name: "Overhead Cable Triceps Extension", target: "", reps: "12–15", sets: 3 },
      { name: "Rope Pushdown (Pump)", target: "", reps: "15–20", sets: 2 },
      { name: "Pallof Press", reps: "12 / side", sets: 3 },
    ],
  },
  {
    date: "Tue • Week 36",
    label: "PULL",
    exercises: [
      { name: "Incline Walk", reps: "5 min", sets: 1 },
      { name: "Assisted Pull-Up", target: "", reps: "6–8", sets: 4 },
      { name: "Single-Arm Cable Row (Pause)", target: "", reps: "10 / side", sets: 3 },
      { name: "Rear Delt Cable Fly", target: "", reps: "12–15", sets: 3 },
      { name: "Incline DB Curl", target: "", reps: "10–12", sets: 3 },
      { name: "Cable Curl (Constant Tension)", target: "", reps: "15–20", sets: 2 },
      { name: "Hanging Knee Raise", reps: "10–15", sets: 3 },
    ],
  },
  {
    date: "Wed • Week 36",
    label: "LEGS",
    exercises: [
      { name: "Incline Walk", reps: "5 min", sets: 1 },
      { name: "Belt Squat or Hack Squat", target: "", reps: "8–10", sets: 3 },
      { name: "Seated Leg Curl", target: "", reps: "12–15", sets: 3 },
      { name: "Seated Calf Raise", target: "", reps: "15–20", sets: 3 },
      { name: "Dead Bug", reps: "10 / side", sets: 3 },
    ],
  },
  {
    date: "Thu • Week 36",
    label: "UPPER",
    exercises: [
      { name: "Incline Walk", reps: "5 min", sets: 1 },
      { name: "Incline Smith Press", target: "", reps: "8–10", sets: 4 },
      { name: "Chest-Supported Row", target: "", reps: "10–12", sets: 4 },
      { name: "Machine Lateral Raise", target: "", reps: "12–15", sets: 3 },
      { name: "Cable Curl", target: "", reps: "12–15", sets: 3 },
      { name: "Cable Fly (Mid Range Pump)", target: "", reps: "15–20", sets: 2 },
      { name: "Triceps Pushdown (High Rep)", target: "", reps: "15–20", sets: 2 },
    ],
  },
  {
    date: "Fri • Week 36",
    label: "FULL BODY",
    exercises: [
      { name: "Incline Walk", reps: "5 min", sets: 1 },
      { name: "Weighted Push-Up", target: "", reps: "AMRAP", sets: 4 },
      { name: "Machine Chest Press", target: "", reps: "12–15", sets: 3 },
      { name: "EZ Bar Curl", target: "", reps: "8–10", sets: 3 },
      { name: "Hammer Curl (Slow)", target: "", reps: "12", sets: 2 },
      { name: "Overhead Rope Extension", target: "", reps: "15", sets: 3 },
      { name: "Farmer Carry", target: "", reps: "30–40 sec", sets: 3 },
    ],
  },
  {
    date: "Sat • Week 36",
    label: "CONDITIONING",
    exercises: [
      { name: "Incline Walk Intervals", reps: "30–40 min", sets: 1 },
      { name: "Cable Crunch", reps: "12–15", sets: 3 },
      { name: "Side Plank", reps: "30–45 sec", sets: 3 },
    ],
  },
  {
    date: "Sun • Week 36",
    label: "RECOVERY",
    exercises: [
      { name: "Zone 2 Walk", reps: "45–60 min", sets: 1 },
      { name: "Mobility Flow", reps: "10–15 min", sets: 1 },
      { name: "Breathing / Decompression", reps: "5 min", sets: 1 },
    ],
  },
];

/* ================= COMPONENT ================= */

export default function Week36Tracker() {
  const [dayIndex, setDayIndex] = useState(0);
  const [log, setLog] = useState({});

  // FIX 1: Hooks must be inside the component, not at module scope
  const [recovery, setRecovery] = useState(null);

  // FIX 2: useMemo must also be inside the component
  const readinessScore = useMemo(() => {
    if (recovery === null) return null;
    if (recovery >= 80) return 5;
    if (recovery >= 65) return 4;
    if (recovery >= 50) return 3;
    if (recovery >= 35) return 2;
    return 1;
  }, [recovery]);

  const workoutMode = useMemo(() => {
    if (readinessScore === null) return "unset";
    if (readinessScore >= 4) return "full";
    if (readinessScore === 3) return "reduced";
    return "recovery";
  }, [readinessScore]);

  const day = week36Plan[dayIndex];

  /* Load from localStorage */
  useEffect(() => {
    const stored = localStorage.getItem("week36Log");
    if (stored) setLog(JSON.parse(stored));
  }, []);

  /* Save to localStorage */
  useEffect(() => {
    localStorage.setItem("week36Log", JSON.stringify(log));
  }, [log]);

  /* ================= UPDATE SET ================= */
  const updateSet = (ex, i, field, value) => {
    setLog((prev) => {
      const dayLog = prev[day.label] ?? {};
      const entry = dayLog[ex] ?? {};
      const sets = [...(entry.sets ?? [])];
      sets[i] = { ...sets[i], [field]: value };
      return {
        ...prev,
        [day.label]: {
          ...dayLog,
          [ex]: { ...entry, sets },
        },
      };
    });
  };

  /* ================= DOWNLOAD LOGS ================= */
  const downloadJSON = () => {
    const blob = new Blob([JSON.stringify(log, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "week36-training-log.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadCSV = () => {
    const rows = ["Day,Exercise,Set,Weight,Reps,Pain,Machine"];
    Object.entries(log).forEach(([dayLabel, exercises]) => {
      Object.entries(exercises).forEach(([exercise, entry]) => {
        (entry.sets ?? []).forEach((set, i) => {
          rows.push(
            [
              dayLabel,
              exercise,
              i + 1,
              set.weight || "",
              set.reps || "",
              set.pain || "",
              entry.machine || "",
            ].join(",")
          );
        });
      });
    });
    const blob = new Blob([rows.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "week36-training-log.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  /* ================= COMPLETION ================= */
  const isExerciseComplete = (entry, totalSets, name) => {
    if (isCardioExercise(name)) return entry?.completed === true;
    if (!entry?.sets) return false;
    if (entry.sets.length !== totalSets) return false;
    return entry.sets.every((s) => s.reps && s.reps.trim() !== "");
  };

  /* ================= RENDER ================= */
  return (
    <ScrollArea className="max-w-md mx-auto p-4 space-y-4">
      {/* WEEK HEADER */}
      <div className="text-center font-bold text-lg">
        Week of March 22 – March 28 • Week 36
      </div>
      <div className="text-center font-bold text-lg">Week 36 Training</div>

      {/* DAY NAVIGATION */}
      <div className="flex justify-between items-center">
        <Button disabled={dayIndex === 0} onClick={() => setDayIndex((i) => i - 1)}>
          ◀
        </Button>
        <h2 className="font-bold">
          {day.date} — {day.label}
        </h2>
        <Button
          disabled={dayIndex === week36Plan.length - 1}
          onClick={() => setDayIndex((i) => i + 1)}
        >
          ▶
        </Button>
      </div>

      {/* DOWNLOAD BUTTONS */}
      <div className="flex gap-2 justify-center">
        <Button variant="outline" onClick={downloadJSON}>
          Download JSON
        </Button>
        <Button variant="outline" onClick={downloadCSV}>
          Download CSV
        </Button>
      </div>

      {/* READINESS CARD */}
      <Card className="rounded-2xl">
        <CardContent className="p-4 space-y-3">
          <h2 className="font-semibold text-sm">🧠 Daily Readiness</h2>
          <Input
            type="number"
            placeholder="Recovery % (WHOOP / Oura / Google Fit)"
            value={recovery ?? ""}
            onChange={(e) => {
              const val = Number(e.target.value);
              if (!isNaN(val)) setRecovery(val);
            }}
          />
          {readinessScore !== null && (
            <div className="text-sm">
              Mode:{" "}
              <strong>
                {workoutMode === "full" && "🔥 Full Session"}
                {workoutMode === "reduced" && "⚡ Reduced Volume"}
                {workoutMode === "recovery" && "🧘 Mobility Only"}
              </strong>
            </div>
          )}
        </CardContent>
      </Card>

      {/* FIX 3: Recovery mode card OR exercise cards — both branches render correctly */}
      {workoutMode === "recovery" ? (
        <Card className="rounded-2xl">
          <CardContent className="p-4 space-y-3">
            <h2 className="font-semibold">🧘 Recovery Day</h2>
            <p className="text-sm text-gray-500">
              Focus on mobility, stretching, light walking. No heavy lifting today.
            </p>
          </CardContent>
        </Card>
      ) : (
        /* EXERCISE CARDS */
        <Card className="rounded-2xl">
          <CardContent className="p-4 space-y-4">
            {day.exercises.map((e) => {
              const entry = log[day.label]?.[e.name];

              // FIX 4: adjustedSets was self-referencing; use e.sets as the base
              const adjustedSets =
                workoutMode === "reduced"
                  ? Math.ceil(e.sets * 0.75)
                  : e.sets;

              const completed = isExerciseComplete(entry, adjustedSets, e.name);

              return (
                <div
                  key={e.name}
                  className={`border rounded-xl p-3 space-y-2 transition ${
                    completed ? "bg-green-50 border-green-600" : ""
                  }`}
                >
                  <div className="font-semibold flex justify-between items-center">
                    <span>{e.name}</span>
                    {completed && <span className="text-green-600">✓</span>}
                  </div>

                  <div className="text-xs text-muted-foreground">
                    {adjustedSets} sets × {e.reps}
                  </div>

                  {/* Cardio checkbox */}
                  {isCardioExercise(e.name) && (
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={entry?.completed || false}
                        onChange={(ev) =>
                          setLog((p) => ({
                            ...p,
                            [day.label]: {
                              ...p[day.label],
                              [e.name]: {
                                ...(p[day.label]?.[e.name] ?? {}),
                                completed: ev.target.checked,
                              },
                            },
                          }))
                        }
                      />
                      Completed
                    </label>
                  )}

                  {/* Strength */}
                  {!isCardioExercise(e.name) && (
                    <>
                      <Input
                        placeholder="Machine / Equipment"
                        value={entry?.machine || ""}
                        onChange={(ev) =>
                          setLog((p) => ({
                            ...p,
                            [day.label]: {
                              ...p[day.label],
                              [e.name]: {
                                ...(p[day.label]?.[e.name] ?? {}),
                                machine: ev.target.value,
                              },
                            },
                          }))
                        }
                      />

                      {[...Array(adjustedSets)].map((_, i) => (
                        <div key={i} className="flex gap-2">
                          <Input
                            className="w-16"
                            placeholder="Wt"
                            value={entry?.sets?.[i]?.weight || ""}
                            onChange={(ev) =>
                              updateSet(e.name, i, "weight", ev.target.value)
                            }
                          />
                          <Input
                            className="w-14"
                            placeholder="Reps"
                            value={entry?.sets?.[i]?.reps || ""}
                            onChange={(ev) =>
                              updateSet(e.name, i, "reps", ev.target.value)
                            }
                          />
                          <Input
                            className="w-12"
                            placeholder="Pain"
                            value={entry?.sets?.[i]?.pain || ""}
                            onChange={(ev) =>
                              updateSet(e.name, i, "pain", ev.target.value)
                            }
                          />
                        </div>
                      ))}
                    </>
                  )}
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}
    </ScrollArea>
  );
}
