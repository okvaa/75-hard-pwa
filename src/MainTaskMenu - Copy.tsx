import { Card, CardContent } from "./components/ui/card";
import { Button } from "./components/ui/button";

// Only include weeks you have implemented
const weeks = [
  { id: "week25", label: "Week 25" },
  { id: "week26", label: "Week 26" },
  { id: "week27", label: "Week 27" },
  { id: "week28", label: "Week 28" },
  { id: "week29", label: "Week 29" },
  { id: "week30", label: "Week 30" },
  { id: "week31", label: "Week 31" },
  { id: "week32", label: "Week 32" },
  { id: "week33", label: "Week 33" },
  { id: "week34", label: "Week 34" },
  { id: "week35", label: "Week 35" },
  { id: "week36", label: "Week 36" },
  { id: "week37", label: "Week 37" }  // Placeholder for future week
 
];

export default function MainTaskMenu({
  setView,
}: {
  setView: (view: string) => void;
}) {
  return (
    <div className="max-w-md mx-auto p-4">
      <Card className="rounded-2xl shadow-md">
        <CardContent className="p-4 space-y-4 text-center">
          <h1 className="text-xl font-bold">🏁 75 Hard Main Menu</h1>

          {/* Core tracking */}
          <Button onClick={() => setView("day")}>📆 Day Counter</Button>
          <Button onClick={() => setView("dashboard")}>📊 Progress Dashboard</Button>
          <Button onClick={() => setView("photos")}>📸 Photos / Measurements</Button>
          <Button onClick={() => setView("supplements")}>💊 Supplements Tracker</Button>
          <Button onClick={() => setView("injections")}>💉 Injection / Tracker</Button>  

          {/* Training Weeks */}
          <div className="pt-2 border-t">
            <h2 className="text-sm font-semibold text-gray-600 mb-2">🏋️ Training Weeks</h2>
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
            <h2 className="text-sm font-semibold text-gray-600 mb-2">🏋️ Conditioning</h2>
            <Button onClick={() => setView("norwegian")}>🫀 Norwegian 4x4</Button>
            <Button onClick={() => setView("trx")}>🤸 TRX Workouts</Button>
            <Button onClick={() => setView("abs")}>💥 ABS / Core Workouts</Button>
            <Button onClick={() => setView("neck")}> Neck / Jawline</Button>
            <Button onClick={() => setView("neck31")}>🧠 Neck Finisher</Button>

          </div>
        </CardContent>
      </Card>
    </div>
  );
}
