import { useEffect, useState } from "react";
import { Card, CardContent } from "./components/ui/card";
import { Button } from "./components/ui/button";
import { ScrollArea } from "./components/ui/scroll-area";

type InjectionLog = {
  bpcAM?: boolean;
  bpcPM?: boolean;
  tb4?: boolean;
  healing?: number; // 0–100
};

const STORAGE_KEY = "injectionLog";

function getDateKey(date = new Date()) {
  return date.toISOString().split("T")[0];
}

function isTB4Day(date: Date) {
  const day = date.getDay(); // 0=Sun, 1=Mon, 4=Thu
  return day === 1 || day === 4;
}

export default function InjectionTracker() {
  const [log, setLog] = useState<Record<string, InjectionLog>>({});

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

  const toggle = (field: keyof InjectionLog) => {
    setLog((p) => ({
      ...p,
      [key]: {
        ...p[key],
        [field]: !p[key]?.[field],
      },
    }));
  };

  const greenButton = (active?: boolean) =>
    active
      ? "bg-green-600 text-white hover:bg-green-700"
      : "border-green-600 text-green-700 hover:bg-green-50";

  return (
    <ScrollArea className="max-w-md mx-auto p-4">
      <Card className="rounded-2xl shadow-md">
        <CardContent className="p-4 space-y-4 text-center">
          <h1 className="text-xl font-bold">💉 Injection Tracker</h1>

          <div className="text-sm text-muted-foreground">
            {today.toDateString()}
          </div>

          {/* BPC 500mcg*/}
          <div className="space-y-2">
            <h2 className="font-semibold">BPC-157 (Daily)</h2>
            <div className="flex justify-center gap-3">
              <Button
                variant="outline"
                className={greenButton(entry.bpcAM)}
                onClick={() => toggle("bpcAM")}
              >
                {entry.bpcAM ? "✓ BPC AM – 5u" : "BPC AM – 5u"}
              </Button>

              <Button
                variant="outline"
                className={greenButton(entry.bpcPM)}
                onClick={() => toggle("bpcPM")}
              >
                {entry.bpcPM ? "✓ BPC PM – 5u" : "BPC PM – 5u"}
              </Button>
            </div>
          </div>
       
        {/* GHK-Cu 1mg*/}
        
          <div className="space-y-2">
            <h2 className="font-semibold">GHK-Cu (Daily)</h2>
            <div className="flex justify-center gap-3">
              <Button
                variant="outline"
                className={greenButton(entry.ghkAM)}
                onClick={() => toggle("ghkAM")}
              >
                {entry.ghkAM ? "✓ GHK-Cu AM – 10u" : "GHK-Cu AM – 10u"}
              </Button>

              <Button
                variant="outline"
                className={greenButton(entry.ghkPM)}
                onClick={() => toggle("ghkPM")}
              >
                {entry.ghkPM ? "✓ GHK-Cu PM – 10u" : "GHK-Cu PM – 10u"}
                
              </Button>
            </div>
          </div>
        
        {/* AOD-9604 150mcg*/}
        
          <div className="space-y-2">
            <h2 className="font-semibold">AOD-9604 (Daily)</h2>
            <div className="flex justify-center gap-3">
              <Button
                variant="outline"
                className={greenButton(entry.aod)}
                onClick={() => toggle("aod")}
              >
                {entry.aod ? "✓ AOD-9604 – ??u" : "AOD-9604 – ??u"}
              </Button>
            </div>
          </div>
        
          {/* TB4 2mg*/}
          {/*isTB4Day(today) ? (
            <div className="pt-3 border-t space-y-2">
              <h2 className="font-semibold text-green-700">
                TB4 (30 units – Today)
              </h2>
              <Button
                variant="outline"
                className={greenButton(entry.tb4)}
                onClick={() => toggle("tb4")}
              >
                {entry.tb4 ? "✓ TB4 – 30u" : "TB4 – 30u"}
              </Button>
            </div>
          ) : (
            <div className="pt-3 text-xs text-muted-foreground">
              TB4 scheduled Monday & Thursday
            </div>
          )}

          {/* Healing Slider */}
          <div className="pt-4 border-t space-y-2">
            <h2 className="font-semibold">🩹 Healing Progress</h2>

            <div className="flex items-center gap-3">
              <input
                type="range"
                min={0}
                max={100}
                step={5}
                value={entry.healing ?? 50}
                onChange={(e) =>
                  setLog((p) => ({
                    ...p,
                    [key]: {
                      ...p[key],
                      healing: Number(e.target.value),
                    },
                  }))
                }
                className="flex-1 accent-green-600"
              />
              <span className="w-12 text-sm font-semibold text-right">
                {entry.healing ?? 50}%
              </span>
            </div>

            <div className="text-xs text-muted-foreground">
              Overall how your back felt today
            </div>
          </div>
        </CardContent>
      </Card>
    </ScrollArea>
  );
}
