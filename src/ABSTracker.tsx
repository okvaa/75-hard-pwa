import { useEffect, useState } from "react";
import { Card, CardContent } from "./components/ui/card";
import { Checkbox } from "./components/ui/checkbox";
import { ScrollArea } from "./components/ui/scroll-area";

const absPlan = [
  {
    day: "🔥 Core Stability",
    exercises: [
      "Cable Crunch – 3x20",
      "Ab Wheel – 3x10",
      "Plank Hold – 3x60s",
    ],
  },
  {
    day: "💪 Obliques & Rotation",
    exercises: [
      "Woodchoppers – 3x15/side",
      "Side Plank – 3x30s/side",
      "Russian Twist – 3x20",
    ],
  },
];

export default function ABSTracker() {
  const [done, setDone] = useState<any>({});

  useEffect(() => {
    const stored = localStorage.getItem("absProgress");
    if (stored) setDone(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem("absProgress", JSON.stringify(done));
  }, [done]);

  const toggle = (day: string, ex: string) => {
    setDone((p: any) => ({
      ...p,
      [day]: { ...p[day], [ex]: !p[day]?.[ex] },
    }));
  };

  return (
    <ScrollArea className="p-4 max-w-md mx-auto space-y-4">
      {absPlan.map(({ day, exercises }) => (
        <Card key={day}>
          <CardContent className="p-4">
            <h2 className="font-bold">{day}</h2>
            {exercises.map((e) => (
              <div key={e} className="flex gap-2 text-sm">
                <Checkbox
                  checked={!!done[day]?.[e]}
                  onCheckedChange={() => toggle(day, e)}
                />
                {e}
              </div>
            ))}
          </CardContent>
        </Card>
      ))}
    </ScrollArea>
  );
}
