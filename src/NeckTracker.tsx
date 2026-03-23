import { useEffect, useState } from "react";
import { Card, CardContent } from "./components/ui/card";
import { Button } from "./components/ui/button";
import { ScrollArea } from "./components/ui/scroll-area";

const STORAGE_KEY = "neckRoutineLog";

type NeckLog = Record<string, boolean>;

function getDateKey(date = new Date()) {
  return date.toISOString().split("T")[0];
}

function getTodayPlan(day: number) {
  // 0=Sun, 1=Mon...
  if (day === 0) return "Off";
  if (day === 6) return "Mobility";
  if (day === 3) return "Light";
  return "Full";
}

const exercises = [
  { id: "warmup", label: "Neck Mobility Flow (2 min)" },
  { id: "chinLift", label: "Chin Lift + Kiss" },
  { id: "jawPress", label: "Jaw Resistance Press" },
  { id: "tonguePress", label: "Tongue-to-Roof Press" },
  { id: "platysma", label: "Platysma Smile Pull" },
  { id: "isometric", label: "Isometric Neck Resistance" },
  { id: "chinTuck", label: "Chin Tucks (Posture Fix)" },
];

export default function NeckRoutineTracker() {
  const [log, setLog] = useState<Record<string, NeckLog>>({});

  const today = new Date();
  const key = getDateKey(today);
  const plan = getTodayPlan(today.getDay());
  const entry = log[key] || {};

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setLog(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(log));
  }, [log]);

  const toggle = (id: string) => {
    setLog((p) => ({
      ...p,
      [key]: {
        ...p[key],
        [id]: !p[key]?.[id],
      },
    }));
  };

  const visibleExercises =
    plan === "Off"
      ? []
      : plan === "Mobility"
      ? exercises.filter((e) => e.id === "warmup")
      : plan === "Light"
      ? exercises.filter(
          (e) => !["jawPress", "isometric"].includes(e.id)
        )
      : exercises;

  return (
    <ScrollArea className="max-w-md mx-auto p-4">
      <Card className="rounded-2xl shadow-md">
        <CardContent className="p-4 space-y-4">
          <h1 className="text-xl font-bold text-center">
            🧠 Neck Routine
          </h1>

          <div className="text-center text-sm text-muted-foreground">
            {today.toDateString()}
          </div>

          <div className="text-center font-semibold">
            Today:{" "}
            <span
              className={
                plan === "Full"
                  ? "text-green-600"
                  : plan === "Light"
                  ? "text-yellow-600"
                  : plan === "Mobility"
                  ? "text-blue-600"
                  : "text-gray-500"
              }
            >
              {plan}
            </span>
          </div>

          {plan === "Off" ? (
            <div className="text-center text-sm text-muted-foreground">
              Recovery day — posture awareness only 👍
            </div>
          ) : (
            <div className="space-y-2">
              {visibleExercises.map((ex) => (
                <Button
                  key={ex.id}
                  variant="outline"
                  className={
                    entry[ex.id]
                      ? "bg-green-600 text-white hover:bg-green-700"
                      : "border-green-600 text-green-700 hover:bg-green-50"
                  }
                  onClick={() => toggle(ex.id)}
                >
                  {entry[ex.id] ? "✓ " : ""}
                  {ex.label}
                </Button>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </ScrollArea>
  );
}
