import { useState, useEffect } from "react";
import { Card, CardContent } from "./components/ui/card";
import { Checkbox } from "./components/ui/checkbox";
import { ScrollArea } from "./components/ui/scroll-area";

const week16Plan = [
  {
    day: "📅 Week of October 20th to 26th",
    gym: [],
    outdoor: "",
  },
  {
    day: "🔴 (104) Monday – Legs Power",
    gym: [
      "Back Squat – 5x5",
      "Romanian Deadlift – 4x8",
      "Walking Lunges – 3x12 per leg",
      "Seated Calf Raise – 4x15",
    ],
    outdoor: "Hill sprints or weighted ruck walk",
  },
  {
    day: "🔵 (105) Tuesday – Arms (Biceps/Triceps)",
    gym: [
      "Barbell Curls – 4x10",
      "Close-Grip Bench Press – 4x8",
      "Incline Dumbbell Curls – 3x12",
      "Overhead Triceps Extension – 3x12",
    ],
    outdoor: "Push-ups and band curls circuit + 45-min brisk walk",
  },
  {
    day: "🟣 (106) Wednesday – Chest & Back Pump",
    gym: [
      "Incline Dumbbell Press – 4x12",
      "Lat Pulldown – 4x12",
      "Dumbbell Fly – 3x15",
      "Seated Cable Row – 3x15",
    ],
    outdoor: "Bodyweight rows + push-ups outside",
  },
  {
    day: "🟠 (107) Thursday – Legs Volume",
    gym: [
      "Front Squat – 4x8",
      "Leg Press – 4x12",
      "Hamstring Curl – 3x15",
      "Standing Calf Raise – 4x20",
    ],
    outdoor: "Walking lunges outdoors + mobility flow",
  },
  {
    day: "🟡 (108) Friday – Arms Focus",
    gym: [
      "EZ Bar Curl – 4x10",
      "Dips – 4xAMRAP",
      "Preacher Curls – 3x12",
      "Cable Triceps Pushdowns – 3x15",
    ],
    outdoor: "Outdoor circuit: curls + dips on park benches",
  },
  {
    day: "🟢 (109) Saturday – Conditioning & Core",
    gym: [
      "Kettlebell Swings – 3x20",
      "Hanging Leg Raises – 3x15",
      "Plank – 3x60 sec",
      "Burpees – 3x20",
    ],
    outdoor: "Jog intervals or sled drag session",
  },
  {
    day: "⚪ (110) Sunday – Recovery & Mobility",
    gym: [
      "Foam Rolling – 10 min",
      "Yoga Flow – 15 min",
      "Ankle/hip mobility – 10 min",
    ],
    outdoor: "Easy walk and stretching outdoors",
  },
];

export default function Week16Tracker() {
  const [completed, setCompleted] = useState({});

  useEffect(() => {
    const stored = localStorage.getItem("week16Progress");
    if (stored) setCompleted(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem("week16Progress", JSON.stringify(completed));
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
      {week16Plan.map(({ day, gym, outdoor }) => (
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
