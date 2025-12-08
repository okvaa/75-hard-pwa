import { useState, useEffect } from "react";
import { Card, CardContent } from "./components/ui/card";
import { Checkbox } from "./components/ui/checkbox";
import { ScrollArea } from "./components/ui/scroll-area";

const week12Plan = [
  {
    day: "📅 Week of September 22nd to 28th",
    gym: [],
    outdoor: "",
  },
  {
    day: "🔴 (76) Monday – Chest & Shoulders (Strength)",
    gym: [
      "Barbell Bench Press – 5x5",
      "Incline Dumbbell Press – 4x8",
      "Overhead Barbell Press – 4x6",
      "Lateral Raises – 3x12",
    ],
    outdoor: "Push-ups + 45-min brisk walk",
  },
  {
    day: "🔵 (77) Tuesday – Back & Biceps",
    gym: [
      "Weighted Pull-ups – 5x5",
      "Barbell Rows – 4x8",
      "Face Pulls – 3x12",
      "Barbell Curls – 3x10",
    ],
    outdoor: "Ruck walk or hill sprints",
  },
  {
    day: "🟣 (78) Wednesday – Legs (Strength)",
    gym: [
      "Back Squats – 5x5",
      "Romanian Deadlifts – 4x8",
      "Walking Lunges – 3x12 per leg",
      "Standing Calf Raises – 4x20",
    ],
    outdoor: "Sled pushes or stair climbs",
  },
  {
    day: "🟠 (79) Thursday – Upper Hypertrophy",
    gym: [
      "Incline Dumbbell Press – 4x10",
      "Arnold Press – 4x10",
      "Cable Chest Fly – 3x12",
      "Hammer Curls – 3x12",
    ],
    outdoor: "Push-up ladder outside + banded rows",
  },
  {
    day: "🟡 (80) Friday – Posterior Chain",
    gym: [
      "Deadlifts – 5x5",
      "Good Mornings – 3x10",
      "Chin-ups – 4xAMRAP",
      "Hip Thrusts – 4x12",
    ],
    outdoor: "Sandbag carry + mobility drills",
  },
  {
    day: "🟢 (81) Saturday – Chest Blast",
    gym: [
      "Flat Dumbbell Press – 4x12",
      "Incline Barbell Press – 4x8",
      "Cable Crossovers – 3x15",
      "Dips – 3xAMRAP",
    ],
    outdoor: "Push-up burnout set + jog",
  },
  {
    day: "⚪ (82) Sunday – Mobility & Recovery",
    gym: [
      "Yoga Flow – 20 min",
      "Foam Rolling – 10 min",
      "Breathwork – 5 min",
    ],
    outdoor: "Leisure walk",
  },
];

export default function Week12Tracker() {
  const [completed, setCompleted] = useState({});

  useEffect(() => {
    const stored = localStorage.getItem("week12Progress");
    if (stored) setCompleted(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem("week12Progress", JSON.stringify(completed));
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
      {week12Plan.map(({ day, gym, outdoor }) => (
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
