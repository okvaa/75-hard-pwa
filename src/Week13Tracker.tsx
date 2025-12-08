import { useState, useEffect } from "react";
import { Card, CardContent } from "./components/ui/card";
import { ScrollArea } from "./components/ui/scroll-area";

const week13Plan = {
  weekTitle: "📅 Week of September 29th to October 5th",
  days: [
    {
      day: "🔴 (83) Monday – Chest Power",
      gym: [
        { name: "Barbell Bench Press", sets: 5, reps: 5 },
        { name: "Incline Barbell Press", sets: 4, reps: 8 },
        { name: "Weighted Dips", sets: 3, reps: 10 },
      ],
      outdoor: "Push-ups pyramid + brisk walk",
    },
    {
      day: "🔵 (84) Tuesday – Pull Strength",
      gym: [
        { name: "Pull-ups", sets: 4, reps: 8 },
        { name: "Barbell Rows", sets: 4, reps: 8 },
        { name: "Barbell Curls", sets: 3, reps: 12 },
      ],
      outdoor: "Jog intervals + pull-aparts",
    },
    {
      day: "🟣 (85) Wednesday – Legs",
      gym: [
        { name: "Back Squats", sets: 4, reps: 8 },
        { name: "Romanian Deadlifts", sets: 4, reps: 8 },
        { name: "Calf Raises", sets: 4, reps: 20 },
      ],
      outdoor: "Hill sprints / walking lunges",
    },
    {
      day: "🟠 (86) Thursday – Chest Hypertrophy",
      gym: [
        { name: "Incline Dumbbell Press", sets: 4, reps: 10 },
        { name: "Cable Flys", sets: 3, reps: 15 },
        { name: "Push-ups to failure", sets: 3, reps: 1 },
      ],
      outdoor: "Push-up finisher outdoors",
    },
    {
      day: "🟡 (87) Friday – Shoulders & Arms",
      gym: [
        { name: "Seated OHP", sets: 4, reps: 8 },
        { name: "Lateral Raises", sets: 3, reps: 12 },
        { name: "Incline Dumbbell Curls", sets: 3, reps: 12 },
        { name: "Skull Crushers", sets: 3, reps: 12 },
      ],
      outdoor: "Band shoulder openers + jog",
    },
    {
      day: "🟢 (88) Saturday – Conditioning + Chest Finish",
      gym: [
        { name: "Burpees", sets: 3, reps: 15 },
        { name: "Kettlebell Swings", sets: 3, reps: 20 },
        { name: "Decline Push-ups", sets: 3, reps: 15 },
      ],
      outdoor: "Circuit training outdoors",
    },
    {
      day: "⚪ (89) Sunday – Recovery",
      gym: [
        { name: "Foam Rolling", sets: 1, reps: 10 },
        { name: "Yoga Flow", sets: 1, reps: 20 },
      ],
      outdoor: "Leisure walk + stretch",
    },
  ],
};

export default function Week13Tracker() {
  const [progress, setProgress] = useState({});

  useEffect(() => {
    const stored = localStorage.getItem("week13Progress");
    if (stored) setProgress(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem("week13Progress", JSON.stringify(progress));
  }, [progress]);

  const updateSet = (day, exercise, setIndex, field, value) => {
    setProgress((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [exercise]: {
          ...(prev[day]?.[exercise] || {}),
          [setIndex]: {
            ...(prev[day]?.[exercise]?.[setIndex] || {}),
            [field]: value,
          },
        },
      },
    }));
  };

  return (
    <ScrollArea className="p-4 max-w-md mx-auto space-y-4">
      <h1 className="text-2xl font-bold text-center">{week13Plan.weekTitle}</h1>

      {week13Plan.days.map(({ day, gym, outdoor }) => (
        <Card key={day} className="rounded-2xl shadow-md">
          <CardContent className="p-4 space-y-2">
            <h2 className="text-xl font-bold">{day}</h2>
            <h3 className="font-semibold">Gym:</h3>
            {gym.map((exercise) => (
              <div key={exercise.name} className="mb-2">
                <p className="font-medium">{exercise.name}</p>
                {Array.from({ length: exercise.sets }).map((_, i) => (
                  <div key={i} className="flex gap-2 mb-1">
                    <input
                      type="number"
                      placeholder={`Reps (${exercise.reps})`}
                      value={progress[day]?.[exercise.name]?.[i]?.reps || ""}
                      onChange={(e) =>
                        updateSet(day, exercise.name, i, "reps", e.target.value)
                      }
                      className="w-20 border rounded px-2"
                    />
                    <input
                      type="number"
                      placeholder="Weight"
                      value={progress[day]?.[exercise.name]?.[i]?.weight || ""}
                      onChange={(e) =>
                        updateSet(day, exercise.name, i, "weight", e.target.value)
                      }
                      className="w-24 border rounded px-2"
                    />
                  </div>
                ))}
              </div>
            ))}
            <h3 className="font-semibold mt-2">Outdoor:</h3>
            <p>{outdoor}</p>
          </CardContent>
        </Card>
      ))}
    </ScrollArea>
  );
}
