import { Card, CardContent } from "./components/ui/card";

export default function Norwegian4x4() {
  return (
    <div className="max-w-md mx-auto p-4 space-y-4">
      <Card>
        <CardContent className="p-4">
          <h1 className="text-xl font-bold mb-2">🇳🇴 Norwegian 4x4</h1>

          <p className="text-sm mb-2">
            4 intervals × 4 minutes at 85–95% max HR
          </p>

          <ul className="list-disc ml-5 text-sm space-y-1">
            <li>Warm-up: 10 minutes easy</li>
            <li>Work: 4 min hard</li>
            <li>Recover: 3 min easy</li>
            <li>Repeat 4 times</li>
            <li>Cool-down: 5–10 minutes</li>
          </ul>

          <p className="text-xs text-gray-500 mt-3">
            Modalities: incline walk, bike, rower, ski-erg
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
