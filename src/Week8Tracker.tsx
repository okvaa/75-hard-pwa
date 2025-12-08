import { useState, useEffect } from "react";
import { Card, CardContent } from "./components/ui/card";
import { Checkbox } from "./components/ui/checkbox";
import { ScrollArea } from "./components/ui/scroll-area";

const week8Plan = [

  {
    day: "📅  Week of August 25th to 31st",
    gym: [],
    outdoor: "",
  },
  {
    day: "🔴 Monday – Chest & Triceps",
    gym: [
      "Barbell Bench Press – 4x8",
      "Incline Dumbbell Press – 3x10",
      "Overhead DB Press – 3x10",
      "Skullcrushers – 3x12",
      "Dips – 3xAMRAP",
    ],
    outdoor: "45-min brisk walk OR hill sprints + push-ups",
  },
  {
    day: "🔵 Tuesday – Back & Biceps",
    gym: [
      "Barbell Rows – 4x8",
      "Pull-ups – 3xAMRAP",
      "Lat Pulldown – 3x12",
      "Barbell Curl – 3x12",
      "Hammer Curl – 3x12",
    ],
    outdoor: "Weighted ruck (20–30 lb backpack) or pull-up bar work",
  },
  {
    day: "🟣 Wednesday – Legs & Core",
    gym: [
      "Squats – 4x8",
      "Romanian Deadlifts – 3x10",
      "Walking Lunges – 3x20 steps",
      "Hanging Leg Raises – 3x12",
      "Plank – 3x45s",
    ],
    outdoor: "Sled pushes/drags or hill walking lunges",
  },
  {
    day: "🟠 Thursday – Shoulders & Chest Hypertrophy",
    gym: [
      "Arnold Press – 4x10",
      "Lateral Raises – 3x15",
      "DB Bench Press – 3x10",
      "Cable Fly – 3x15",
      "Face Pulls – 3x15",
    ],
    outdoor: "Band shoulder mobility + dips/push-ups in park",
  },
  {
    day: "🟡 Friday – Posterior Chain & Arms",
    gym: [
      "Deadlifts – 4x6",
      "Bulgarian Split Squats – 3x10/leg",
      "Barbell Curl – 3x12",
      "Triceps Pushdowns – 3x12",
      "Standing Calf Raises – 4x20",
    ],
    outdoor: "Farmer’s carry walk or sandbag carry",
  },
  {
    day: "🟢 Saturday – Conditioning & Core Blast",
    gym: [
      "Kettlebell Swings – 4x15",
      "Row Intervals – 4x500m",
      "Ab Wheel Rollouts – 3x12",
      "Box Jumps – 3x12",
    ],
    outdoor: "Sprint intervals, agility ladder, or outdoor circuit",
  },
  {
    day: "⚪ Sunday – Mobility & Active Recovery",
    gym: [
      "Foam Rolling – 10 min",
      "Yoga Flow – 15 min",
      "Breathwork – 5 min",
    ],
    outdoor: "Easy walk, hike, or slow bike ride",
  },
];

export default function Week8Tracker() {
  const [completed, setCompleted] = useState({});

  useEffect(() => {
    const stored = localStorage.getItem("week8Progress");
    if (stored) setCompleted(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem("week8Progress", JSON.stringify(completed));
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
        {week8Plan.map(({ day, gym, outdoor }) => (
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