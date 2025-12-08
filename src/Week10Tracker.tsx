import { useState, useEffect } from "react";
import { Card, CardContent } from "./components/ui/card";
import { ScrollArea } from "./components/ui/scroll-area";

const week10Plan = {
  weekTitle: "📅 Week of September 8th to 14th",
  days: [
    {
      day: "🔴 Monday – Push (Chest/Shoulders/Triceps)",
      gym: [
        { name: "Barbell Bench Press", sets: 4, reps: 8 },
        { name: "Overhead Press", sets: 3, reps: 10 },
        { name: "Dips", sets: 3, reps: 12 },
      ],
      outdoor: "Push-ups + 45-min brisk walk",
    },
    {
      day: "🔵 Tuesday – Pull (Back & Biceps)",
      gym: [
        { name: "Pull-ups", sets: 4, reps: 8 },
        { name: "Barbell Rows", sets: 4, reps: 8 },
        { name: "Barbell Curls", sets: 3, reps: 12 },
      ],
      outdoor: "Jog intervals or pull-up practice",
    },
    {
      day: "🟣 Wednesday – Legs (Quads/Hams/Glutes)",
      gym: [
        { name: "Front Squats", sets: 4, reps: 8 },
        { name: "Romanian Deadlifts", sets: 3, reps: 10 },
        { name: "Walking Lunges", sets: 3, reps: 12 },
      ],
      outdoor: "Hill sprints or weighted ruck walk",
    },
    {
      day: "🟠 Thursday – Upper Hypertrophy",
      gym: [
        { name: "Incline Dumbbell Press", sets: 4, reps: 8 },
        { name: "Arnold Press", sets: 3, reps: 10 },
        { name: "Skull Crushers", sets: 3, reps: 12 },
      ],
      outdoor: "Resistance band presses/rows outdoors",
    },
    {
      day: "🟡 Friday – Lower Hypertrophy",
      gym: [
        { name: "Leg Press", sets: 4, reps: 10 },
        { name: "Bulgarian Split Squats", sets: 3, reps: 12 },
        { name: "Hamstring Curl", sets: 3, reps: 12 },
      ],
      outdoor: "Sled pushes or step-ups outside",
    },
    {
      day: "🟢 Saturday – Conditioning & Core",
      gym: [
        { name: "Burpees", sets: 3, reps: 15 },
        { name: "Kettlebell Swings", sets: 3, reps: 20 },
        { name: "V-Ups", sets: 3, reps: 20 },
      ],
      outdoor: "Jump rope / circuit outdoors",
    },
    {
      day: "⚪ Sunday – Mobility & Recovery",
      gym: [
        { name: "Foam Rolling", sets: 1, reps: 10 },
        { name: "Yoga Flow", sets: 1, reps: 20 },
      ],
      outdoor: "Leisure walk & stretch in sun",
    },
  ],
};

export default function Week10Tracker() {
  const [progress, setProgress] = useState({});

  useEffect(() => {
    const stored = localStorage.getItem("week10Progress");
    if (stored) setProgress(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem("week10Progress", JSON.stringify(progress));
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
      <h1 className="text-2xl font-bold text-center">
        {week10Plan.weekTitle}
      </h1>

      {week10Plan.days.map(({ day, gym, outdoor }) => (
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
