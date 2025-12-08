import { useState, useEffect } from "react";
import { Card, CardContent } from "./components/ui/card";
import { Checkbox } from "./components/ui/checkbox";
import { ScrollArea } from "./components/ui/scroll-area";

const week17Plan = [
  {
    day: "📅 Week of October 27th to November 2nd",
    gym: [],
    outdoor: "",
  },
  {
    day: "🔴 (111) Monday – Legs Strength",
    gym: [
      "Back Squat – 5x5",
      "Deadlift – 4x6",
      "Bulgarian Split Squat – 3x10",
      "Standing Calf Raise – 4x15",
    ],
    outdoor: "Hill sprints + walking lunges outside",
  },
  {
    day: "🔵 (112) Tuesday – Arms Power",
    gym: [
      "Barbell Curl – 4x8",
      "Close-Grip Bench Press – 4x8",
      "Dumbbell Hammer Curl – 3x12",
      "Skullcrushers – 3x12",
    ],
    outdoor: "Resistance band curls/triceps + walk",
  },
  {
    day: "🟣 (113) Wednesday – Upper Push",
    gym: [
      "Incline Barbell Press – 4x8",
      "Dumbbell Shoulder Press – 4x10",
      "Cable Fly – 3x15",
      "Overhead Dumbbell Extension – 3x12",
    ],
    outdoor: "Push-up burnout in the park",
  },
  {
    day: "🟠 (114) Thursday – Legs Volume",
    gym: [
      "Front Squat – 4x10",
      "Leg Press – 4x15",
      "Hamstring Curl – 4x12",
      "Seated Calf Raise – 4x20",
    ],
    outdoor: "Walking lunges or stair climbs",
  },
  {
    day: "🟡 (115) Friday – Arms Hypertrophy",
    gym: [
      "Incline Dumbbell Curl – 4x12",
      "EZ Bar Curl – 4x10",
      "Cable Pushdown – 4x12",
      "Rope Overhead Extension – 3x15",
    ],
    outdoor: "Arm pump band circuit + walk",
  },
  {
    day: "🟢 (116) Saturday – Full Body Pump",
    gym: [
      "Kettlebell Swing – 3x20",
      "Push-ups – 3xAMRAP",
      "Pull-ups – 3xAMRAP",
      "Walking Lunges – 3x15",
    ],
    outdoor: "Agility or cardio circuit outdoors",
  },
  {
    day: "⚪ (117) Sunday – Recovery",
    gym: [
      "Foam Roll – 10 min",
      "Stretch Flow – 15 min",
      "Breathwork – 10 min",
    ],
    outdoor: "Leisure walk or yoga in the sun",
  },
];

export default function Week17Tracker() {
  const [completed, setCompleted] = useState({});

  useEffect(() => {
    const stored = localStorage.getItem("week17Progress");
    if (stored) setCompleted(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem("week17Progress", JSON.stringify(completed));
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
      {week17Plan.map(({ day, gym, outdoor }) => (
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
