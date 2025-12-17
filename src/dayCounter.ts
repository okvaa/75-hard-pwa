import { useState, useEffect } from "react";
import { Card, CardContent } from "./components/ui/card";
import { Button } from "./components/ui/button";
import {
  getHard75Day,
  setHard75Day,
} from "./dayCounter";

export default function DayCounterView() {
  const [day, setDay] = useState<number>(getHard75Day());

  useEffect(() => {
    setHard75Day(day);
  }, [day]);

  return (
    <Card className="rounded-2xl shadow-md">
      <CardContent className="p-4 text-center space-y-4">
        <h2 className="text-xl font-bold">📆 75 Hard Day</h2>

        <div className="text-5xl font-bold">{day}</div>

        <div className="flex justify-center gap-4">
          <Button onClick={() => setDay((d) => Math.max(1, d - 1))}>
            −
          </Button>
          <Button onClick={() => setDay((d) => d + 1)}>+</Button>
        </div>
      </CardContent>
    </Card>
  );
}
