import { useState, useEffect } from "react";
import { Card, CardContent } from "./components/ui/card";
import { Checkbox } from "./components/ui/checkbox";
import { ScrollArea } from "./components/ui/scroll-area";

const week18Plan = [
  {
    day: "📅 Week of November 3rd to 9th",
    gym: [],
    outdoor: "",
  },
  {
    day: "🔴 (118) Monday – Push Strength",
    gym: [
      "Bench Press – 4x8",
      "Overhead Press – 4x10",
      "Incline Dumbbell Press – 3x12",
      "Cable Fly – 3x15",
      "Triceps Pushdown – 3x12",
    ],
    outdoor: "Push-ups + 45-min brisk walk",
  },
  {
    day: "🔵 (119) Tuesday – Pull Strength",
    gym: [
      "Weighted Pull-ups – 4xAMRAP",
      "Barbell Rows – 4x8",
      "Lat Pulldown – 3x10",
      "Hammer Curls – 3x12",
      "Face Pulls – 3x15",
    ],
    outdoor: "Ruck walk or pull-ups in park",
  },
  {
    day: "🟣 (120) Wednesday – Legs Power",
    gym: [
      "Back Squat – 5x5",
      "Romanian Deadlift – 4x8",
      "Walking Lunges – 3x12/leg",
      "Seated Calf Raise – 4x20",
    ],
    outdoor: "Hill sprints or stair climbs",
  },
  {
    day: "🟠 (121) Thursday – Arms & Chest Pump",
    gym: [
      "Close-Grip Bench Press – 4x10",
      "EZ Bar Curl – 4x10",
      "Dumbbell Fly – 3x12",
      "Overhead Triceps Extension – 3x12",
    ],
    outdoor: "Resistance band pump + walk",
  },
  {
    day: "🟡 (122) Friday – Lower Hypertrophy",
    gym: [
      "Leg Press – 4x12",
      "Hamstring Curl – 4x12",
      "Glute Bridge – 3x15",
      "Tibialis Raise – 3x20",
    ],
    outdoor: "Weighted step-ups outside",
  },
  {
    day: "🟢 (123) Saturday – Conditioning & Core",
    gym: [
      "Kettlebell Swings – EMOM 10 min",
      "Burpees – 3x15",
      "Ab-Roller – 3x15",
      "V-Ups – 3x20",
    ],
    outdoor: "Outdoor sprints or circuit",
  },
  {
    day: "⚪ (124) Sunday – TRX & Mobility",
    gym: [
      "TRX Row – 3x12",
      "TRX Chest Press – 3x12",
      "TRX Split Squat – 3x10/leg",
      "TRX Biceps Curl – 3x12",
      "TRX Triceps Extension – 3x12",
      "TRX Pike – 3x10",
      "Stretch Flow – 10 min",
    ],
    outdoor: "Light walk in sun",
  },
];

export default function Week18Tracker() {
  const [completed, setCompleted] = useState({});

  useEffect(() => {
    const stored = localStorage.getItem("week18Progress");
    if (stored) setCompleted(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem("week18Progress", JSON.stringify(completed));
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
      {week18Plan.map(({ day, gym, outdoor }) => (
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
