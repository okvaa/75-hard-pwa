import { Input } from "./components/ui/input";
import { Card, CardContent } from "./components/ui/card";

export default function Norwegian4x4() {
  return (
    <Card className="max-w-md mx-auto mt-4">
      <CardContent className="space-y-3 p-4">
        <h2 className="font-bold text-lg">🫀 Norwegian 4x4</h2>

        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex gap-2">
            <Input placeholder={`Interval ${i} – Distance / Speed`} />
            <Input placeholder="HR / RPE" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
