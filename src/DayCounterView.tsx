import { Card, CardContent } from "./components/ui/card";
import { getHard75Day } from "./dayCounter";

export default function DayCounterView() {
  const day = getHard75Day();

  return (
    <div className="max-w-md mx-auto p-4">
      <Card className="rounded-2xl shadow-md">
        <CardContent className="p-4 text-center space-y-4">
          <h2 className="text-xl font-bold">📆 75 Hard Day</h2>
          <div className="text-5xl font-extrabold">{day}</div>
          <div className="text-sm text-muted-foreground">
            Started July 8, 2025
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
