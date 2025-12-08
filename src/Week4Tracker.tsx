
import { useState } from "react";
import { Card, CardContent } from "./components/ui/card";
import { Button } from "./components/ui/button";
import { Checkbox } from "./components/ui/checkbox";
import { ScrollArea } from "./components/ui/scroll-area";

const week4Plan = [
  {
    day: "🔴 Monday – Chest & Core",
    gym: [
      "Incline Dumbbell Press – 4x8",
      "Cable Chest Flys – 3x15",
      "Weighted Sit-ups – 3x20",
      "Leg Raises – 3x15",
    ],
    outdoor: "45 min jog or ruck + yoga cooldown",
  },
  {
    day: "🔵 Tuesday – Back & Biceps",
    gym: [
      "Barbell Rows – 4x8",
      "Chin-ups – 3xAMRAP",
      "EZ Bar Curls – 3x10",
      "Superman Hold – 3x30 sec",
    ],
    outdoor: "Mobility flow + active recovery walk",
  },
  {
    day: "🟣 Wednesday – Legs",
    gym: [
      "Back Squats – 4x5",
      "Walking Lunges – 3x20",
      "Hamstring Curls – 3x15",
      "Standing Calf Raises – 3x25",
    ],
    outdoor: "Agility drills or hill sprints",
  },
  {
    day: "🟠 Thursday – Conditioning & Mobility",
    gym: [
      "AirBike Intervals – 10x20s sprint/40s rest",
      "Turkish Get-ups – 3x6/side",
      "Yoga Flow – 20 min",
    ],
    outdoor: "Outdoor hike or sport activity",
  },
  {
    day: "🟡 Friday – Shoulders & Arms",
    gym: [
      "Overhead Dumbbell Press – 4x8",
      "Lateral Raises – 3x12",
      "Barbell Curls – 3x10",
      "Overhead Triceps Extension – 3x12",
    ],
    outdoor: "Stair climbs + stretch band mobility",
  },
  {
    day: "🟢 Saturday – Full Body",
    gym: [
      "Clean & Press – 4x6",
      "Pull-ups – 3x10",
      "Push-ups – 3x25",
      "Kettlebell Swings – 4x15",
    ],
    outdoor: "Sprint intervals or weighted walk",
  },
  {
    day: "🔘 Sunday – Recovery & Flexibility",
    gym: [
      "Foam Roll – 10 min",
      "Stretch Routine – 20 min",
      "Breathing Practice – 5 min",
    ],
    outdoor: "Casual walk or yoga in the park",
  },
];

export default function Week4Tracker() {
  const [completed, setCompleted] = useState({});

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
      {week4Plan.map(({ day, gym, outdoor }) => (
        <Card key={day} className="rounded-2xl shadow-md">
          <CardContent className="p-4">
            <h2 className="text-xl font-bold mb-2">{day}</h2>
            <h3 className="font-semibold mb-1">Gym + Mobility:</h3>
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
          </CardContent>
        </Card>
      ))}
    </ScrollArea>
  );
}
