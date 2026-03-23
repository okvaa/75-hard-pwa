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
  completed?: boolean; // ✅ cardio checkbox
};


type DayLog = Record<string, ExerciseLog>;

/* ================= CARDIO ================= */

const isCardioExercise = (name: string) =>
  [
    "Exercise Bike",
    "Incline Walk",
    "Zone 2 Walk",
    "Mobility Flow",
    "Breathing / Decompression",
    "Foam Roller + Mobility",
  ].includes(name);

/* ================= WEEK 33 PLAN ================= */

const week33Plan = [/* ⬅️ unchanged, keep your plan exactly as-is */
  {
    date: "Mon • Feb 9",
    label: "PUSH",
    exercises: [
      { name: "Exercise Bike", reps: "5 min", sets: 1 },
      { name: "Foam Roller + Mobility", reps: "1", sets: 1 },
      { name: "Machine Chest Press",target: "", reps: "6–8", sets: 4 },
      { name: "Incline DB Press (Neutral)",target: "", reps: "8–10", sets: 3 },
      { name: "Seated Machine Shoulder Press",target: "", reps: "8–10", sets: 3 },
      { name: "Cable Fly (slow stretch",target: "", reps: "12–15", sets: 3 },
      { name: "Rope Triceps Pushdown",target: "", reps: "12–15", sets: 3 },
      { name: "Pallof Press", reps: "12–15 / side", sets: 3 },
      { name: "Dead Bug", reps: "10 / side", sets: 3 },
      { name: "Chin Tucks", reps: "15", sets: 3 },
      { name: "Platysma Exercise", reps: "15", sets: 3 },
      { name: "Tongue Press", reps: "15", sets: 3 },
    ],
  },
  {
    date: "Tue • Feb 10",
    label: "PULL",
    exercises: [
      { name: "Exercise Bike", reps: "5 min", sets: 1 },
      { name: "Neutral-Grip Lat Pulldown", reps: "8–10", sets: 4 },
      { name: "Chest-Supported Row", target: "", reps: "8–10", sets: 4 },
      { name: "Single-Arm Machine Row", target: "", reps: "10–12", sets: 3 },
      { name: "Face Pull", target: "", reps: "12–15", sets: 3 },
      { name: "Preacher Curl", target: "", reps: "10–12", sets: 3 },
       // ABS
      { name: "Hanging Knee Raise", reps: "10–15", sets: 3 },
      // Neck
      { name: "Chin Tucks", reps: "15", sets: 3 },
      { name: "Platysma Exercise", reps: "15", sets: 3 },
      { name: "Tongue Press", reps: "15", sets: 3 }, 
    ],
  },
  {
    date: "Wed • Feb 11",
    label: "LEGS",
    exercises: [
      { name: "Exercise Bike", reps: "5 min", sets: 1 },
      { name: "Foam Roller + Mobility", reps: "1", sets: 1 },
      { name: "Seated Calf Raise", target: "", reps: "12–20", sets: 4 },
      { name: "Hack Squat (High & Wide)", target: "", reps: "8–10", sets: 4 },
      { name: "Belt Squat / Supported Goblet", target: "", reps: "10–12", sets: 3 },
      { name: "Seated Leg Curl", target: "", reps: "10–15", sets: 3 },
      { name: "Leg Extension", target: "", reps: "12–15", sets: 3 },
      // Neck
      { name: "Chin Tucks", reps: "15", sets: 3 },
      { name: "Platysma Exercise", reps: "15", sets: 3 },
      { name: "Tongue Press", reps: "15", sets: 3 }, 
    ],
  },
  {
    date: "Thu • Feb 12",
    label: "UPPER",
    exercises: [
      { name: "Exercise Bike", reps: "5 min", sets: 1 },
      { name: "Incline Smith Press", reps: "8–10", sets: 3 },
      { name: "Assisted Pull-Up", target: "",reps: "8–12", sets: 3 },
      { name: "Machine Lateral Raise", target: "",reps: "12–15", sets: 3 },
      { name: "Cable Curl", target: "",reps: "12–15", sets: 2 },
      { name: "OH Cable Triceps Extension", target: "", reps: "12–15", sets: 2 },
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
    date: "Fri • Feb 13",
    label: "FULL BODY",
    exercises: [
      { name: "Exercise Bike", reps: "5 min", sets: 1 },
      { name: "Foam Roller + Mobility", reps: "1", sets: 1 },
      { name: "Leg Press", target: "",reps: "10–12", sets: 3 },
      { name: "Machine Chest Press", target: "",reps: "10–12", sets: 3 },
      { name: "Seated Row", target: "",reps: "10–12", sets: 3 },
      { name: "Reverse Pec Deck", target: "",reps: "12–15", sets: 3 },
      { name: "Farmer Carry", target: "",reps: "30–40 sec", sets: 3 },
      // Neck
      { name: "Chin Tucks", reps: "15", sets: 3 },
      { name: "Platysma Exercise", reps: "15", sets: 3 },
      { name: "Tongue Press", reps: "15", sets: 3 }, 
    ],
  },
  {
    date: "Sat • Feb 14",
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
    date: "Sun • Feb 15",
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

export default function Week33Tracker() {
  const [dayIndex, setDayIndex] = useState(0);
  const [log, setLog] = useState<Record<string, DayLog>>({});

  const day = week33Plan[dayIndex];

  const hasData = Object.keys(log).length > 0;

  /* Load from localStorage */
  useEffect(() => {
    const stored = localStorage.getItem("week33Log");
    if (stored) setLog(JSON.parse(stored));
  }, []);

  /* Save to localStorage */
  useEffect(() => {
    localStorage.setItem("week33Log", JSON.stringify(log));
  }, [log]);

    /* ================= UPDATE SET ================= */
  /* Update a single set */
  const updateSet = (
    ex: string,
    i: number,
    field: keyof SetLog,
    value: string
  ) => {
    setLog((prev) => {
      const dayLog = prev[day.label] ?? {};
      const entry = dayLog[ex] ?? {};
      
       const sets = [...(entry.sets ?? [])];

        sets[i] = {
        ...sets[i],
        [field]: value,
       };

      return {
      ...prev,
      [day.label]: {
        ...dayLog,
        [ex]: {
          ...entry,
          sets,
     },
      },
    };
  });
};

   /* ============== DOWNLOAD LOGS ================= */
  /* ✅ DOWNLOAD FUNCTIONS  */

  const downloadJSON = () => {
  const blob = new Blob([JSON.stringify(log, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "week33-training-log.json";
  a.click();
  URL.revokeObjectURL(url);
};

const downloadCSV = () => {
  const rows: string[] = [
    "Day,Exercise,Set,Weight,Reps,Pain,Machine",
  ];

  Object.entries(log).forEach(([day, exercises]) => {
    Object.entries(exercises).forEach(([exercise, entry]) => {
      (entry.sets ?? []).forEach((set, i) => {
        rows.push(
          [
            day,
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
  a.download = "week33-training-log.csv";
  a.click();
  URL.revokeObjectURL(url);
};
 /* ================= COMPLETION ================= */
   /* Completion logic */
   /* Check if an exercise is complete (all sets have reps filled) */
  const isExerciseComplete = (
  entry: ExerciseLog | undefined,
  totalSets: number,
  name: string
) => {
  // ✅ Cardio uses checkbox
  if (isCardioExercise(name)) {
    return entry?.completed === true;
  }
  // Strength → must exist
  if (!entry?.sets) return false;
  if (entry.sets.length !== totalSets) return false;
  
  // ✅ STRICT: every set must be touched AND have reps
  return entry.sets.every(
      (s) => s.reps && s.reps.trim() !== ""
    );
  };

/* ================= HEADER ================= */

  return (
    <ScrollArea className="max-w-md mx-auto p-4 space-y-4">
      {/* WEEK HEADER */}
      <div className="text-center font-bold text-lg">
        Week of Feb 9 – Feb 15 • Week 33
      </div>
      <div className="text-center font-bold text-lg">Week 33 Training</div>

      {/* DAY NAVIGATION */}
      <div className="flex justify-between items-center">
        <Button disabled={dayIndex === 0} onClick={() => setDayIndex((i) => i - 1)}>
          ◀
        </Button>
        <h2 className="font-bold">
          {day.date} — {day.label}
        </h2>
        <Button
          disabled={dayIndex === week33Plan.length - 1}
          onClick={() => setDayIndex((i) => i + 1)}
        >
          ▶
        </Button>
      </div>
    {/* DOWNLOAD BUTTONS */}
          <div className="flex gap-2 justify-center">
           <Button
             variant="outline"
              onClick={downloadJSON}
  >
         Download JSON
          </Button>

          <Button
             variant="outline"
             onClick={downloadCSV}
  >
          Download CSV
         </Button>
        </div>

      {/* EXERCISE CARDS */}
      <Card className="rounded-2xl">
        <CardContent className="p-4 space-y-4">
          {day.exercises.map((e) => {
            const entry = log[day.label]?.[e.name];
            const completed = isExerciseComplete(entry, e.sets,e.name);

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
                  {e.sets} sets × {e.reps}
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
          
                {[...Array(e.sets)].map((_, i) => (
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
    </ScrollArea>
  );
}