import { useState, useEffect } from "react";
import { Card, CardContent } from "./components/ui/card";
import { Checkbox } from "./components/ui/checkbox";
import { ScrollArea } from "./components/ui/scroll-area";

const week15Plan = [
  {
    day: "📅 Week of October 13th to 19th",
    gym: [],
    outdoor: "",
  },
  {
    day: "🔴 (97) Monday – Chest Strength",
    gym: [
      "Barbell Bench Press – 5x5",
      "Incline Dumbbell Press – 4x8",
      "Weighted Dips – 3xAMRAP",
      "Cable Crossovers – 3x15",
    ],
    outdoor: "Push-ups finisher + 45-min walk",
  },
  {
    day: "🔵 (98) Tuesday – Back & Pull",
    gym: [
      "Deadlifts – 5x5",
      "Pull-ups – 4xAMRAP",
      "Seated Rows – 4x10",
      "Barbell Curls – 3x12",
    ],
    outdoor: "Ruck walk or stair climbs",
  },
  {
    day: "🟣 (99) Wednesday – Legs",
    gym: [
      "Back Squats – 5x5",
      "Walking Lunges – 3x12 each leg",
      "Leg Press – 4x12",
      "Standing Calf Raises – 4x20",
    ],
    outdoor: "Hill sprints or sled drags",
  },
  {
    day: "🟠 (100) Thursday – Chest Hypertrophy",
    gym: [
      "Incline Barbell Press – 4x10",
      "Flat Dumbbell Press – 4x12",
      "Decline Press – 3x12",
      "Pec Deck Fly – 3x15",
    ],
    outdoor: "Push-up burnout + resistance band work",
  },
  {
    day: "🟡 (101) Friday – Shoulders & Arms",
    gym: [
      "Overhead Press – 4x8",
      "Lateral Raises – 4x12",
      "Barbell Curls – 4x10",
      "Skullcrushers – 3x12",
    ],
    outdoor: "Band shoulder opener walk + jog",
  },
  {
    day: "🟢 (102) Saturday – Chest & Conditioning",
    gym: [
      "Incline Dumbbell Press – 4x12",
      "Flat Barbell Press – 4x8",
      "Push-ups (weighted if possible) – 3xAMRAP",
      "Burpees EMOM – 10 min",
    ],
    outdoor: "Sprints, jump rope, or circuit outside",
  },
  {
    day: "⚪ (103) Sunday – Recovery",
    gym: [
      "Yoga Flow – 20 min",
      "Foam Rolling – 10 min",
      "Deep Stretch – 10 min",
    ],
    outdoor: "Leisure walk",
  },
];

export default function Week15Tracker() {
  const [completed, setCompleted] = useState({});

  useEffect(() => {
    const stored = localStorage.getItem("week15Progress");
    if (stored) setCompleted(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem("week15Progress", JSON.stringify(completed));
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
      {week15Plan.map(({ day, gym, outdoor }) => (
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
