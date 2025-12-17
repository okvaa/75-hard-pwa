import { useEffect, useState } from "react";
import { Card, CardContent } from "./components/ui/card";
import { Button } from "./components/ui/button";
import { Checkbox } from "./components/ui/checkbox";
import { Input } from "./components/ui/input";
import { ScrollArea } from "./components/ui/scroll-area";

type SetLog = {
  weight: string;
  reps: string;
};

type ExerciseLog = {
  completed: boolean;
  sets: SetLog[];
};

type DayLog = Record<string, ExerciseLog>;

const STORAGE_KEY = "week25-progress";

const week25Plan: Record<string, { title: string; exercises: { name: string; sets: number }[] }> = {
  Monday: {
    title: "Lower Body + Machines",
    exercises: [
      { name: "Leg Press (Machine)", sets: 4 },
      { name: "Seated Hamstring Curl (Machine)", sets: 3 },
      { name: "Walking Lunges", sets: 3 },
      { name: "Calf Raise (Machine)", sets: 4 },
      { name: "Cable Crunch (ABS)", sets: 3 },
      { name: "Hanging Knee Raise (ABS)", sets: 3 },
    ],
  },
  Tuesday: {
    title: "Upper Push",
    exercises: [
      { name: "Incline DB Press", sets: 4 },
      { name: "Machine Chest Press", sets: 3 },
      { name: "Seated Shoulder Press (Machine)", sets: 3 },
      { name: "Cable Triceps Pushdown", sets: 3 },
      { name: "Ab Wheel Rollout (ABS)", sets: 3 },
    ],
  },
  Wednesday: {
    title: "Norwegian 4x4",
    exercises: [
      { name: "Norwegian 4x4 Intervals (Run / Bike / Row)", sets: 4 },
      { name: "Plank Hold (ABS – seconds)", sets: 3 },
    ],
  },
  Thursday: {
    title: "Upper Pull",
    exercises: [
      { name: "Lat Pulldown (Machine)", sets: 4 },
      { name: "Chest Supported Row (Machine)", sets: 3 },
      { name: "Face Pulls", sets: 3 },
      { name: "EZ Bar Curl", sets: 3 },
      { name: "Cable Woodchoppers (ABS)", sets: 3 },
    ],
  },
  Friday: {
    title: "Full Body / Accessories",
    exercises: [
      { name: "Hack Squat (Machine)", sets: 4 },
      { name: "Incline Machine Press", sets: 3 },
      { name: "Seated Row (Machine)", sets: 3 },
      { name: "Lateral Raise", sets: 3 },
      { name: "Cable Crunch (ABS)", sets: 3 },
    ],
  },
};

export default function Week25Tracker({ onBack }: { onBack: () => void }) {
  const [log, setLog] = useState<Record<string, DayLog>>({});

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) setLog(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(log));
  }, [log]);

  const toggleExercise = (day: string, ex: string) => {
    setLog((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [ex]: {
          ...prev[day]?.[ex],
          completed: !prev[day]?.[ex]?.completed,
        },
      },
    }));
  };

  const updateSet = (
    day: string,
    ex: string,
    index: number,
    field: "weight" | "reps",
    value: string
  ) => {
    setLog((prev) => {
      const sets = prev[day]?.[ex]?.sets || [];
      sets[index] = { ...sets[index], [field]: value };
      return {
        ...prev,
        [day]: {
          ...prev[day],
          [ex]: {
            completed: prev[day]?.[ex]?.completed || false,
            sets,
          },
        },
      };
    });
  };

  return (
    <ScrollArea className="p-4 max-w-md mx-auto space-y-4">
      <Button variant="outline" onClick={onBack}>
        ← Back to Menu
      </Button>

      <h1 className="text-2xl font-bold text-center">
        Week 25 – Dec 15–21
      </h1>

      {Object.entries(week25Plan).map(([day, { title, exercises }]) => (
        <Card key={day} className="rounded-2xl shadow-md">
          <CardContent className="p-4 space-y-3">
            <h2 className="text-lg font-bold">
              {day} – {title}
            </h2>

            {exercises.map(({ name, sets }) => (
              <div key={name} className="space-y-2">
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={!!log[day]?.[name]?.completed}
                    onCheckedChange={() => toggleExercise(day, name)}
                  />
                  <span className="font-medium">{name}</span>
                </div>

                {Array.from({ length: sets }).map((_, i) => (
                  <div key={i} className="flex gap-2 pl-6">
                    <Input
                      placeholder="Weight"
                      value={log[day]?.[name]?.sets?.[i]?.weight || ""}
                      onChange={(e) =>
                        updateSet(day, name, i, "weight", e.target.value)
                      }
                    />
                    <Input
                      placeholder="Reps / Sec"
                      value={log[day]?.[name]?.sets?.[i]?.reps || ""}
                      onChange={(e) =>
                        updateSet(day, name, i, "reps", e.target.value)
                      }
                    />
                  </div>
                ))}
              </div>
            ))}
          </CardContent>
        </Card>
      ))}
    </ScrollArea>
  );
}
