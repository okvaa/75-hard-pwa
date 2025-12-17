import { useState, useEffect } from "react";
import { Card, CardContent } from "./components/ui/card";
import { Button } from "./components/ui/button";
import {
  getHard75Day,
  setHard75Day,
  buildWeekStarts,
  weekForDay,
} from "./dayCounter";

export default function DayCounterView() {
  const [day, setDay] = useState(131);

  useEffect(() => {
    setDay(getHard75Day());
  }, []);

  const weekStarts = buildWeekStarts();
  const currentWeek = weekForDay(day, weekStarts);

  return (
    <div className="max-w-md mx-auto p-4 space-y-4">
      <Card className="rounded-2xl shadow-md">
        <CardContent className="p-4 space-y-3 text-center">
          <h2 className="text-xl font-bold">📆 Day Counter</h2>

          <div className="text-4xl font-extrabold">{day}</div>
          <div className="text-sm text-muted-foreground">
            {currentWeek}
          </div>

          <div className="flex gap-2 justify-center">
            <Button
              variant="outline"
              onClick={() => {
                const next = day - 1;
                setDay(next);
                setHard75Day(next);
              }}
            >
              −
            </Button>

            <Button
              onClick={() => {
                const next = day + 1;
                setDay(next);
                setHard75Day(next);
              }}
            >
              +
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
