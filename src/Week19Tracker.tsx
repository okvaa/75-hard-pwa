import { useState, useEffect } from "react";
import { Card, CardContent } from "./components/ui/card";
import { Checkbox } from "./components/ui/checkbox";
import { ScrollArea } from "./components/ui/scroll-area";

const week19Plan = [
  {
    day: "📅 Week of November 10th to 16th",
    gym: [],
    outdoor: "",
  },
  {
    day: "🔴 (125) Monday – Push Power",
    gym: [
      "Incline Bench Press – 5x5",
      "Seated Dumbbell Press – 4x8",
      "Dips – 3xAMRAP",
      "Lateral Raise – 3x15",
      "Triceps Kickback – 3x15",
    ],
    outdoor: "Push-up walk",
  },
  {
    day: "🔵 (126) Tuesday – Pull Power",
    gym: [
      "Deadlift – 4x6",
      "Chest-Supported Row – 4x10",
      "Barbell Curl – 3x10",
      "Reverse Fly – 3x15",
    ],
    outdoor: "Pull-ups + walk",
  },
  {
    day: "🟣 (127) Wednesday – Legs Strength",
    gym: [
      "Front Squat – 4x8",
      "Romanian Deadlift – 4x10",
      "Leg Extension – 3x15",
      "Standing Calf Raise – 4x20",
    ],
    outdoor: "Hill walk or stairs",
  },
  {
    day: "🟠 (128) Thursday – Arms Superset",
    gym: [
      "Barbell Curl + Triceps Pushdown – 4x12",
      "Incline Curl + Overhead Extension – 3x15",
      "Forearm Curls – 3x20",
    ],
    outdoor: "Band pump outside",
  },
  {
    day: "🟡 (129) Friday – Upper Hypertrophy",
    gym: [
      "Dumbbell Bench Press – 4x12",
      "Cable Row – 4x12",
      "Arnold Press – 3x10",
      "Lateral Raise – 3x15",
    ],
    outdoor: "Outdoor walk",
  },
  {
    day: "🟢 (130) Saturday – Conditioning & Core",
    gym: [
      "Sled Push – 10 rounds",
      "Kettlebell Snatch – 3x10/arm",
      "Sit-ups – 3x25",
      "Plank – 3x1 min",
    ],
    outdoor: "Intervals outside",
  },
  {
    day: "⚪ (131) Sunday – TRX & Recovery",
    gym: [
      "TRX Row – 3x12",
      "TRX Chest Press – 3x12",
      "TRX Split Squat – 3x10/leg",
      "TRX Biceps Curl – 3x12",
      "TRX Triceps Extension – 3x12",
      "TRX Pike – 3x10",
      "Stretch Flow – 10 min",
    ],
    outdoor: "Bike ride or long walk",
  },
];

export default function Week19Tracker() {
  const [completed, setCompleted] = useState({});

  useEffect(() => {
    const stored = localStorage.getItem("week19Progress");
    if (stored) setCompleted(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem("week19Progress", JSON.stringify(completed));
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
      {week19Plan.map(({ day, gym, outdoor }) => (
        <Card key={day} className="rounded-2xl shadow-md">
          <CardContent className="p-4">
            {gym.length === 0 ? (
              <h2 className="text-xl font-bold text-center">{day}</h2>
            ) : (
              <>
                <h2 className="text-xl font-bold mb-2">{day}</h2>
                <h3 className="font-semibold mb-1">Gym:</h3>
                <ul className="space-y-1">
                  {gym.map((exercise) => (
                    <li
                      key={exercise}
                      className="flex items-center gap-2 text-sm"
                    >
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
              </>
            )}
          </CardContent>
        </Card>
      ))}
    </ScrollArea>
  );
}
