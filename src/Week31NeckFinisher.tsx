import { useEffect, useState } from "react";
import { Card, CardContent } from "./components/ui/card";
import { Button } from "./components/ui/button";
import { ScrollArea } from "./components/ui/scroll-area";
import { Input } from "./components/ui/input";

type NeckLog = {
  chinTucks?: boolean;
  platysma?: boolean;
  tonguePress?: boolean;
  isometric?: boolean;
  pain?: string;
};

const STORAGE_KEY = "week31NeckLog";
const REMINDER_KEY = "week31NeckReminderShown";

function todayKey() {
  return new Date().toISOString().split("T")[0];
}

export default function Week31NeckFinisher() {
  const [log, setLog] = useState<Record<string, NeckLog>>({});
  const [loaded, setLoaded] = useState(false);

  const key = todayKey();
  const entry = log[key] || {};

  // Load saved data
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setLog(JSON.parse(saved));
    setLoaded(true);
  }, []);

  // Save changes
  useEffect(() => {
    if (loaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(log));
    }
  }, [log, loaded]);

  // Reset reminder daily
  useEffect(() => {
    const lastShown = localStorage.getItem(REMINDER_KEY);
    if (lastShown !== key) {
      localStorage.removeItem(REMINDER_KEY);
    }
  }, [key]);

  // Reminder logic
  useEffect(() => {
    if (!loaded) return;

    const shown = localStorage.getItem(REMINDER_KEY);
    const incomplete =
      !entry.chinTucks || !entry.platysma || !entry.tonguePress;

    if (!shown && incomplete) {
      const timeout = setTimeout(() => {
        alert("🧠 Don’t forget your neck finisher — 5 minutes, protect your posture.");
        localStorage.setItem(REMINDER_KEY, key);
      }, 15 * 60 * 1000);

      return () => clearTimeout(timeout);
    }
  }, [entry, key, loaded]);

  const toggle = (field: keyof NeckLog) => {
    setLog((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        [field]: !prev[key]?.[field],
      },
    }));
  };

  return (
    <ScrollArea className="max-w-md mx-auto p-4">
      <Card className="rounded-2xl shadow-md">
        <CardContent className="p-4 space-y-4 text-center">
          <h1 className="text-xl font-bold">🧠 Week 31 – Neck Finisher</h1>
          <div className="text-sm text-muted-foreground">
            5–7 minutes • Post-workout
          </div>

          <Button
            variant="outline"
            className={
              entry.chinTucks
                ? "bg-green-600 text-white hover:bg-green-700"
                : "border-green-600 text-green-700 hover:bg-green-50"
            }
            onClick={() => toggle("chinTucks")}
          >
            {entry.chinTucks ? "✓ Chin Tucks" : "Chin Tucks — 3×10"}
          </Button>

          <Button
            variant="outline"
            className={
              entry.platysma
                ? "bg-green-600 text-white hover:bg-green-700"
                : "border-green-600 text-green-700 hover:bg-green-50"
            }
            onClick={() => toggle("platysma")}
          >
            {entry.platysma
              ? "✓ Platysma Pulls"
              : "Platysma Smile Pull — 3×10"}
          </Button>

          <Button
            variant="outline"
            className={
              entry.tonguePress
                ? "bg-green-600 text-white hover:bg-green-700"
                : "border-green-600 text-green-700 hover:bg-green-50"
            }
            onClick={() => toggle("tonguePress")}
          >
            {entry.tonguePress
              ? "✓ Tongue Press"
              : "Tongue-to-Roof Press — 5–8 holds"}
          </Button>

          <div className="pt-2 border-t space-y-2">
            <div className="text-xs text-muted-foreground">
              Optional • 2× / week only
            </div>
            <Button
              variant="outline"
              className={
                entry.isometric
                  ? "bg-green-600 text-white hover:bg-green-700"
                  : "border-green-600 text-green-700 hover:bg-green-50"
              }
              onClick={() => toggle("isometric")}
            >
              {entry.isometric
                ? "✓ Isometric Neck"
                : "Isometric Neck (All Directions)"}
            </Button>
          </div>

          <div className="pt-3 border-t space-y-2">
            <Input
              placeholder="Neck / shoulder notes (optional)"
              value={entry.pain || ""}
              onChange={(e) =>
                setLog((prev) => ({
                  ...prev,
                  [key]: {
                    ...prev[key],
                    pain: e.target.value,
                  },
                }))
              }
            />
            <div className="text-xs text-muted-foreground">
              Stop if shoulder or low back feels irritated
            </div>
          </div>
        </CardContent>
      </Card>
    </ScrollArea>
  );
}
