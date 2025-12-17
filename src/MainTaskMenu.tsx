import { Button } from "./components/ui/button";
import { Card, CardContent } from "./components/ui/card";

const weeks = [
  { id: "week20", label: "Week 20" },
  { id: "week21", label: "Week 21" },
  { id: "week22", label: "Week 22" },
  { id: "week23", label: "Week 23" },
  { id: "week24", label: "Week 24" },
  { id: "week25", label: "Week 25" },
];

export default function MainTaskMenu({
  setView,
}: {
  setView: (view: string) => void;
}) {
  return (
    <div className="max-w-md mx-auto p-4">
      <Card className="rounded-2xl shadow-md">
        <CardContent className="space-y-4 p-4">
          <h1 className="text-xl font-bold text-center">
            🏁 75 Hard Main Menu
          </h1>

          {/* Core Tracking */}
          <Button onClick={() => setView("day")}>📆 Day Counter</Button>
          <Button onClick={() => setView("dashboard")}>
            📊 Progress Dashboard
          </Button>
          <Button onClick={() => setView("photos")}>
            📸 Photo / Measurements
          </Button>

          {/* Training Weeks */}
          <div className="pt-2 border-t">
            <h2 className="text-sm font-semibold text-gray-600 mb-2">
              🏋️ Training Weeks
            </h2>
            <div className="grid grid-cols-2 gap-2">
              {weeks.map((week) => (
                <Button
                  key={week.id}
                  variant="secondary"
                  onClick={() => setView(week.id)}
                >
                  {week.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Conditioning & Accessories */}
          <div className="pt-2 border-t space-y-2">
            <Button onClick={() => setView("norwegian")}>
              🫀 Norwegian 4x4
            </Button>

            <Button onClick={() => setView("trx")}>
              🤸 TRX Workouts
            </Button>

            <Button onClick={() => setView("abs")}>
              💥 ABS / Core Workouts
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
