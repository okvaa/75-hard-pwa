
import { useState } from "react";
import { Card, CardContent } from "./components/ui/card";
import { Button } from "./components/ui/button";
import { Checkbox } from "./components/ui/checkbox";
import { ScrollArea } from "./components/ui/scroll-area";


const weekPlan = [
  {
    day: "Monday",
    gym: [
      "Bench Press – 4x6-8",
      "Overhead Dumbbell Press – 3x10",
      "Incline Dumbbell Press – 3x10",
      "Lateral Raises – 3x12-15",
      "Triceps Rope Pushdown – 3x12",
      "Dips – 3xAMRAP",
    ],
    outdoor: "45-min fast walk or jog",
  },
  {
    day: "Tuesday",
    gym: [
      "Deadlifts – 4x5",
      "Pull-ups – 3x8-10",
      "Bent-over Rows – 3x8",
      "Seated Cable Row – 3x12",
      "EZ Bar Curls – 3x10",
      "Hammer Curls – 3x10",
    ],
    outdoor: "Ruck walk or outdoor bodyweight circuit",
  },
  {
    day: "Wednesday",
    gym: [
      "Barbell Squats – 4x6-8",
      "Romanian Deadlifts – 3x10",
      "Walking Lunges – 3x10 each leg",
      "Glute Bridges – 3x12",
      "Calf Raises – 4x15",
    ],
    outdoor: "Hill walk, sprints, or stair climb",
  },
  {
    day: "Thursday",
    gym: [
      "Hanging Leg Raises – 15",
      "Plank – 1 min",
      "Russian Twists – 30",
      "Cable Woodchopper – 3x10/side",
      "Rowing or Assault Bike – 15 min intervals",
    ],
    outdoor: "Outdoor yoga or mobility walk",
  },
  {
    day: "Friday",
    gym: [
      "Clean and Press – 3x6",
      "Kettlebell Swings – 3x20",
      "TRX Rows – 3x12",
      "Push-ups – 3x20",
      "Farmer’s Carries – 3x40m",
      "Battle Ropes – 5x30 sec",
    ],
    outdoor: "HIIT sprints or agility training",
  },
  {
    day: "Saturday",
    gym: [
      "Deadlift – 3x5",
      "Front Squat – 3x6",
      "Pull-ups – 3xAMRAP",
      "Dumbbell Thrusters – 3x10",
      "Plank – 3x1 min",
      "Sled Push or incline treadmill – 5x1 min",
    ],
    outdoor: "Hike, long walk, or bodyweight drills",
  },
  {
    day: "Sunday",
    gym: [
      "Air squats – 20",
      "Push-ups – 15",
      "Band pull-aparts – 20",
      "Walking lunges – 10/leg",
      "Light rowing or treadmill walk – 15 min",
    ],
    outdoor: "Outdoor recovery walk or light cycle",
  },
];

export default function Week2Tracker() {
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
      {weekPlan.map(({ day, gym, outdoor }) => (
        <Card key={day} className="rounded-2xl shadow-md">
          <CardContent className="p-4">
            <h2 className="text-xl font-bold text-red-500 mb-2">{day}</h2>
            <h3 className="text-xl font-bold text-blue-500">Gym Workout:</h3>
            <ul className="space-y-1">
              {gym.map((exercise) => (
                <li
                  key={exercise}
                   className={`flex items-center gap-2 text-sm ${
                    completed[day]?.[exercise] ? "text-green-600 line-through font-semibold" : ""
                    }`}
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
            <div
              className={`flex items-center gap-2 text-sm ${
                completed[day]?.outdoor ? "text-green-600 line-through font-semibold" : ""
             }`}
          >
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
