import { useEffect, useState } from "react";
import { Card, CardContent } from "./components/ui/card";
import { Button } from "./components/ui/button";
import { ScrollArea } from "./components/ui/scroll-area";

type RoutineLog = Record<string, boolean>;

const STORAGE_KEY = "dailySupplementRoutine";

function getDateKey(date = new Date()) {
  return date.toISOString().split("T")[0];
}

const ROUTINE = [
  {
    section: "🌅 Morning — 05:00–05:25",
    items: [
      "Shower + Face Wash",
      "Vitamin D3 – 10,000 IU",
      "Vitamin K2 (MK-7) – 100–200 mcg",
      "Magnesium Glycinate (AM) – 250 mg",
      "Copper – 1 mg",
      "Neck Lotion (AM)",
      "BPC-157 (AM– 250 mcg",
    ],
  },
  {
    section: "🏋️ Pre-Workout — 07:15–07:30",
    items: [
      "Collagen Peptides – 15–20 g",
      "Vitamin C – 1,000 mg",
      "Pre-Workout (Transparent Labs)",
      "Creatine – 5–7 g",
      "Water",
    ],
  },
  {
    section: "🍽️ Post-Workout — 08:30",
    items: ["Whey Protein – 28 g"],
  },
  {
    section: "🕒 Afternoon — 15:30",
    items: ["Zinc – 25 mg (or 50 mg 2–3× / week)"],
  },
  {
    section: "🌙 Evening — 20:30–21:30",
    items: [
      "BPC-157 (PM)– 250 mcg",
      "TB4 – 2 mg (Mon & Thu)",
      "GHK-Cu Topical (Neck/Jawline)",
      "OLLY Sleep Gummies",
      "Magnesium Glycinate (PM)– 250 mg",
      "Optional: Glycine – 3 g",
    ],
  },
];

export default function SupplementRoutineTracker() {
  const [log, setLog] = useState<Record<string, RoutineLog>>({});

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setLog(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(log));
  }, [log]);

  const today = new Date();
  const key = getDateKey(today);
  const entry = log[key] || {};

  const toggle = (item: string) => {
    setLog((p) => ({
      ...p,
      [key]: {
        ...p[key],
        [item]: !p[key]?.[item],
      },
    }));
  };

  const btnClass = (active?: boolean) =>
    active
      ? "bg-green-600 text-white hover:bg-green-700"
      : "border-green-600 text-green-700 hover:bg-green-50";

  return (
    <ScrollArea className="max-w-md mx-auto p-4">
      <Card className="rounded-2xl shadow-md">
        <CardContent className="p-4 space-y-5 text-center">
          <h1 className="text-xl font-bold">💊 Daily Supplement Routine</h1>
          <div className="text-sm text-muted-foreground">
            {today.toDateString()}
          </div>

          {ROUTINE.map((block) => (
            <div key={block.section} className="pt-3 border-t space-y-2">
              <h2 className="font-semibold">{block.section}</h2>
              <div className="flex flex-wrap justify-center gap-2">
                {block.items.map((item) => (
                  <Button
                    key={item}
                    variant="outline"
                    className={btnClass(entry[item])}
                    onClick={() => toggle(item)}
                  >
                    {entry[item] ? `✓ ${item}` : item}
                  </Button>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </ScrollArea>
  );
}

