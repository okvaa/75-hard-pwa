import { useState, useEffect } from "react";
import { Card, CardContent } from "./components/ui/card";
import { Checkbox } from "./components/ui/checkbox";
import { ScrollArea } from "./components/ui/scroll-area";

const week9Plan = {
  weekTitle: "📅 Week of September 1st to 7th",
  days: [
    { 
      day: "🔴 Monday – Push (Chest/Shoulders/Triceps)",
      gym: [
        "Incline Bench Press – 4x8",
        "Overhead Press – 3x10",
        "Dips – 3xAMRAP",
        "Lateral Raises – 3x12",
        "Triceps Extensions – 3x12",
      ],
      outdoor: "Push-ups + 45-min brisk walk",
    },
    {
      day: "🔵 Tuesday – Pull (Back & Biceps)",
      gym: [
        "Pull-ups – 4xAMRAP",
        "Barbell Rows – 4x8",
        "Shrugs – 3x15",
        "Barbell Curls – 3x12",
        "Face Pulls – 3x12",
      ],
      outdoor: "Park pull-ups or weighted ruck walk",
    },
    {
      day: "🟣 Wednesday – Legs (Quads/Hams/Glutes)",
      gym: [
        "Front Squats – 4x8",
        "RDLs – 3x10",
        "Step-ups – 3x12/leg",
        "Tibialis Raises – 3x20",
        "Calf Raises – 4x20",
      ],
      outdoor: "Hill sprints or walking lunges outside",
    },
    {
      day: "🟠 Thursday – Upper Hypertrophy",
      gym: [
        "DB Incline Press – 4x8",
        "Arnold Press – 3x10",
        "Lat Pulldown – 3x12",
        "Hammer Curls – 3x12",
        "Skullcrushers – 3x12",
      ],
      outdoor: "Resistance band presses/rows + push-up finisher",
    },
    {
      day: "🟡 Friday – Lower Hypertrophy",
      gym: [
        "Leg Press – 4x10",
        "Bulgarian Split Squats – 3x12",
        "Hamstring Curl – 3x12",
        "Glute Bridges – 3x15",
        "Standing Calf Raises – 4x20",
      ],
      outdoor: "Sled pushes or weighted step-ups outdoors",
    },
    {
      day: "🟢 Saturday – Conditioning & Core",
      gym: [
        "Burpees + Kettlebell Swings EMOM – 10 min",
        "Wall Balls – 3x20",
        "Hanging Knee Raises – 3x15",
        "V-Ups – 3x20",
      ],
      outdoor: "Sprints, jump rope, agility ladder, or circuit in yard",
    },
    {
      day: "⚪ Sunday – Mobility & Recovery",
      gym: [
        "Foam Rolling – 10 min",
        "Yoga Flow – 15 min",
        "Breathwork + Meditation – 10 min",
      ],
      outdoor: "Leisure walk and stretch in sun",
    },
  ],
};

export default function Week9Tracker() {
  const [completed, setCompleted] = useState({});

  useEffect(() => {
    const stored = localStorage.getItem("week9Progress");
    if (stored) setCompleted(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem("week9Progress", JSON.stringify(completed));
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
      <h1 className="text-2xl font-bold text-center mb-4">
        {week9Plan.weekTitle}
      </h1>

      {week9Plan.days.map(({ day, gym, outdoor }) => (
        <Card key={day} className="rounded-2xl shadow-md">
          <CardContent className="p-4">
            <h2 className="text-xl font-bold mb-2">{day}</h2>
            <h3 className="font-semibold mb-1">Gym:</h3>
            <ul className="space-y-1">
              {gym.map((exercise) => (
                <li key={exercise} className="flex items-center gap-2 text-sm">
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
