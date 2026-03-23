import { Button } from "./components/ui/button";
import { Card, CardContent } from "./components/ui/card";

export default function WeekSelector({ setView }: { setView: any }) {
  return (
    <div className="max-w-md mx-auto p-4">
      <Card>
        <CardContent className="space-y-3 p-4">
          <h2 className="text-lg font-bold text-center">📅 Training Weeks</h2>

          <Button onClick={() => setView("week25")}>
            🏋️ Week 25
          </Button>

          <Button variant="secondary" onClick={() => setView("menu")}>
            ← Back
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
