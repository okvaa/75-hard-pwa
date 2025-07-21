
import { useState } from "react";
import { Card, CardContent } from "./components/ui/card";
import { Button } from "./components/ui/button";
import { Checkbox } from "./components/ui/checkbox";
import { ScrollArea } from "./components/ui/scroll-area";

const week3Plan = [
  {
    day: "🔴 Monday – Push (Chest/Shoulders/Triceps)",
    gym: [
      "Mobility Flow – 15 min",
      "Barbell Bench Press – 4x6",
      "Overhead Press – 3x10",
      "Triceps Dips – 3xAMRAP",
      "Lateral Raises – 3x12",
    ],
    outdoor: "45 min brisk walk + full body stretch",
  },
  {
    day: "🔵 Tuesday – Pull (Back/Biceps/Hamstrings)",
    gym: [
      "Deadlifts – 4x5",
      "Pull-ups – 3x8",
      "Dumbbell Rows – 3x10",
      "Face Pulls – 3x15",
      "Hamstring Floss – 3x30 sec",
    ],
    outdoor: "Mobility drills or ruck walk",
  },
  {
    day: "🟣 Wednesday – Legs & Mobility",
    gym: [
      "Hip Mobility Flow – 10 min",
      "Back Squats – 4x6",
      "Bulgarian Split Squats – 3x10",
      "Glute Ham Raise – 3x10",
      "Ankle Mobility – 3x30 sec",
    ],
    outdoor: "Trail walk or agility ladder + foam roll",
  },
  {
    day: "🟠 Thursday – Core & Conditioning",
    gym: [
      "Core Circuit: Plank, Dead Bug, Side Plank – 3 rounds",
      "Rowing Machine – 15 min intervals",
      "Band Shoulder Mobility – 10 min",
    ],
    outdoor: "Yoga session (30–45 min)",
  },
  {
    day: "🟡 Friday – Full Body Power",
    gym: [
      "Kettlebell Flow – 15 min",
      "Push Press – 3x8",
      "TRX Rows – 3x10",
      "Farmer’s Carries – 4x40m",
      "Couch Stretch – 3x30 sec",
    ],
    outdoor: "Sled drag or hill sprints + light stretch",
  },
  {
    day: "🟢 Saturday – Functional Strength",
    gym: [
      "Front Squats – 4x5",
      "Romanian Deadlifts – 3x10",
      "Push-ups – 3x20",
      "Mobility Drills – 15 min",
    ],
    outdoor: "Hike or outdoor circuit + band stretching",
  },
  {
    day: "🔘 Sunday – Recovery & Flexibility",
    gym: [
      "Foam Roll – 10 min",
      "Yoga Flow – 20 min",
      "Breathing Exercises – 10 min",
    ],
    outdoor: "Recovery walk or easy cycling",
  },
];

export default function Week3Tracker() {
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
      {week3Plan.map(({ day, gym, outdoor }) => (
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
