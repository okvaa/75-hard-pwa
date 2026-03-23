import { ScrollArea } from "./components/ui/scroll-area";
import { Card, CardContent } from "./components/ui/card";

export default function WeekTracker({
  weekId,
  plan,
}: {
  weekId: string;
  plan: {
    day: string;
    exercises: { name: string }[];
  }[];
}) {
  return (
    <ScrollArea className="p-4 max-w-md mx-auto">
      {plan.map((day) => (
        <Card key={day.day} className="mb-4 rounded-2xl shadow-md">
          <CardContent className="p-4">
            <h2 className="text-xl font-bold mb-2">{day.day}</h2>
            <ul className="list-disc pl-5 text-sm">
              {day.exercises.map((ex) => (
                <li key={ex.name}>{ex.name}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      ))}
    </ScrollArea>
  );
}
