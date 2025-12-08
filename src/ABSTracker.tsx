import { useState, useEffect } from "react";
import { Card, CardContent } from "./components/ui/card";
import { Checkbox } from "./components/ui/checkbox";
import { ScrollArea } from "./components/ui/scroll-area";

const trxPlan = [
  {
    day: "🏋️ Bulletproof Core Session",
    gym: [
      "Butt Walks – 2x20",
      "Cable Crunches – 3x20",
      "Reverse Sit-ups – 3xFailure",
      "Back Supported Knee Tucks – 4xFailure",
      "QL Side Bends – 3x20 reps each side",
      "Lying Engaged (EO,IO,TrA) Twisting Crunches – 3x20 each side",
      "Modified Cable Rotations – 3x15 each side",
    ],
    outdoor: "15–30 min walk or jog to warm up/cool down",
  },
  {
    day: "🔥 TRX Core Focus",
    gym: [
      "TRX Plank – 3x1 min",
      "TRX Knee Tuck – 3x15",
      "TRX Mountain Climber – 3x20",
      "TRX Side Plank Hold – 3x30 sec/side",
      "TRX Body Saw – 3x12",
    ],
    outdoor: "Stretch or light mobility outdoors",
  },
  {
    day: "💪 TRX Strength Builder",
    gym: [
      "TRX Squat Jump – 3x10",
      "TRX Single-Leg Squat – 3x8/leg",
      "TRX Row – 3x12",
      "TRX Push-Up – 3x12",
      "TRX Hamstring Curl – 3x10",
    ],
    outdoor: "Quick walk or short ruck session",
  },
];

export default function TRXTracker() {
  const [completed, setCompleted] = useState({});

  useEffect(() => {
    const stored = localStorage.getItem("trxProgress");
    if (stored) setCompleted(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem("trxProgress", JSON.stringify(completed));
  }, [completed]);

  const toggleExercise = (day, exercise) => {
    setCompleted((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [exercise]: !prev[day]?.[exercise],
      },
    }));
  };

  return (
    <ScrollArea className="p-4 max-w-md mx-auto space-y-4">
      {trxPlan.map(({ day, gym, outdoor }) => (
        <Card key={day} className="rounded-2xl shadow-md">
          <CardContent className="p-4">
            <h2 className="text-xl font-bold mb-2">{day}</h2>
            <h3 className="font-semibold mb-1">Exercises:</h3>
            <ul className="space-y-1">
              {gym.map((exercise) => (
                <li key={exercise} className="flex items-center gap-2 text-sm">
                  <Checkbox
                    checked={!!completed[day]?.[exercise]}
                    onCheckedChange={() => toggleExercise(day, exercise)}
                  />
                  {exercise}
                </li>
              ))}
            </ul>
            <h3 className="font-semibold mt-4 mb-1">Outdoor:</h3>
            <div className="flex items-center gap-2 text-sm">
              <Checkbox
                checked={!!completed[day]?.outdoor}
                onCheckedChange={() => toggleExercise(day, "outdoor")}
              />
              {outdoor}
            </div>
          </CardContent>
        </Card>
      ))}
    </ScrollArea>
  );
}
