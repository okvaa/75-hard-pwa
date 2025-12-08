import { useState, useEffect } from "react";
import { Card, CardContent } from "./components/ui/card";
import { Checkbox } from "./components/ui/checkbox";
import { ScrollArea } from "./components/ui/scroll-area";

const week14Plan = [
  {
    day: "📅 Week of October 6th to October 12th",
    gym: [],
    outdoor: "",
  },
  {
    day: "🔴 (90) Monday – Chest Power",
    gym: [
      "Barbell Bench Press – 5x5",
      "Incline Dumbbell Press – 4x8",
      "Weighted Dips – 4x10",
      "Cable Flys – 3x12",
    ],
    outdoor: "Push-ups pyramid outside + 45-min brisk walk",
  },
  {
    day: "🔵 (91) Tuesday – Back & Biceps",
    gym: [
      "Pull-ups – 4xAMRAP",
      "Barbell Rows – 4x8",
      "One-Arm Dumbbell Row – 3x12",
      "Incline Dumbbell Curls – 3x12",
    ],
    outdoor: "Ruck walk or hill sprints",
  },
  {
    day: "🟣 (92) Wednesday – Legs & Core",
    gym: [
      "Front Squats – 4x8",
      "RDLs – 4x10",
      "Walking Lunges – 3x12 each leg",
      "Hanging Knee Raises – 3x15",
    ],
    outdoor: "Stair sprints or sled drags",
  },
  {
    day: "🟠 (93) Thursday – Chest Hypertrophy",
    gym: [
      "Incline Barbell Press – 4x10",
      "Flat Dumbbell Press – 4x12",
      "Decline Press – 3x12",
      "Pec Deck Fly – 3x15",
    ],
    outdoor: "Push-up burnout set outdoors",
  },
  {
    day: "🟡 (94) Friday – Shoulders & Arms",
    gym: [
      "Overhead Press – 4x8",
      "Lateral Raises – 3x12",
      "Barbell Curls – 3x12",
      "Skullcrushers – 3x12",
    ],
    outdoor: "Band shoulder openers + jog",
  },
  {
    day: "🟢 (95) Saturday – Chest & Conditioning",
    gym: [
      "Incline Dumbbell Press – 4x12",
      "Flat Barbell Press – 4x8",
      "Dips – 3xAMRAP",
      "Burpees EMOM – 10 min",
    ],
    outdoor: "Sprints or agility ladder",
  },
  {
    day: "⚪ (96) Sunday – Mobility & Recovery",
    gym: [
      "Yoga Flow – 20 min",
      "Foam Rolling – 10 min",
      "Breathwork + Meditation – 5 min",
    ],
    outdoor: "Light hike or leisure walk",
  },
];

export default function Week14Tracker() {
  const [completed, setCompleted] = useState({});

  useEffect(() => {
    const stored = localStorage.getItem("week14Progress");
    if (stored) setCompleted(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem("week14Progress", JSON.stringify(completed));
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
      {week14Plan.map(({ day, gym, outdoor }) => (
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
