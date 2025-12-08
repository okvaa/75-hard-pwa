import { useState, useEffect } from "react";
import { Card, CardContent } from "./components/ui/card";
import { ScrollArea } from "./components/ui/scroll-area";

const week11Plan = {
  weekTitle: "📅 Week of September 15th to 21st",
  days: [
    {
      day: "🔴 Monday – Push (Chest/Shoulders/Triceps)",
      gym: [
        { name: "Incline Bench Press", sets: 4, reps: 8 },
        { name: "Seated Overhead Press", sets: 4, reps: 8 },
        { name: "Weighted Dips", sets: 3, reps: 10 },
        { name: "Lateral Raises", sets: 3, reps: 15 },
      ],
      outdoor: "Push-up ladder + 45-min brisk walk",
    },
    {
      day: "🔵 Tuesday – Pull (Back & Biceps)",
      gym: [
        { name: "Pull-ups (weighted if possible)", sets: 4, reps: 6 },
        { name: "Barbell Rows", sets: 4, reps: 8 },
        { name: "Chest-Supported Rows", sets: 3, reps: 12 },
        { name: "Incline Dumbbell Curls", sets: 3, reps: 12 },
      ],
      outdoor: "Pull-up holds + jog intervals",
    },
    {
      day: "🟣 Wednesday – Legs (Quads/Hams/Glutes)",
      gym: [
        { name: "Back Squats", sets: 4, reps: 8 },
        { name: "Romanian Deadlifts", sets: 3, reps: 8 },
        { name: "Walking Lunges", sets: 3, reps: 14 },
        { name: "Calf Raises", sets: 4, reps: 20 },
      ],
      outdoor: "Hill sprints or sled pushes",
    },
    {
      day: "🟠 Thursday – Upper Hypertrophy",
      gym: [
        { name: "Flat Dumbbell Press", sets: 4, reps: 10 },
        { name: "Arnold Press", sets: 3, reps: 10 },
        { name: "Cable Flys", sets: 3, reps: 15 },
        { name: "Triceps Rope Pushdowns", sets: 3, reps: 12 },
      ],
      outdoor: "Resistance band push/pull circuit outdoors",
    },
    {
      day: "🟡 Friday – Lower Hypertrophy",
      gym: [
        { name: "Leg Press", sets: 4, reps: 12 },
        { name: "Bulgarian Split Squats", sets: 3, reps: 12 },
        { name: "Nordic Hamstring Curls", sets: 3, reps: 8 },
        { name: "Hip Thrusts", sets: 3, reps: 12 },
      ],
      outdoor: "Weighted carries or outdoor stair climbs",
    },
    {
      day: "🟢 Saturday – Conditioning & Core",
      gym: [
        { name: "Row 500m x 4 (timed)", sets: 4, reps: 1 },
        { name: "Battle Ropes", sets: 4, reps: 30 },
        { name: "Hanging Leg Raises", sets: 3, reps: 12 },
        { name: "Plank Variations", sets: 3, reps: 1 }, // 1 = hold
      ],
      outdoor: "Agility ladder + sprints in the park",
    },
    {
      day: "⚪ Sunday – Mobility & Recovery",
      gym: [
        { name: "Full-Body Stretch Routine", sets: 1, reps: 20 },
        { name: "Slant Board Squats (light)", sets: 2, reps: 15 },
        { name: "Breathwork & Meditation", sets: 1, reps: 10 },
      ],
      outdoor: "Leisure walk and mindful movement",
    },
  ],
};

export default function Week11Tracker() {
  const [progress, setProgress] = useState({});

  useEffect(() => {
    const stored = localStorage.getItem("week11Progress");
    if (stored) setProgress(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem("week11Progress", JSON.stringify(progress));
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
        {week11Plan.weekTitle}
      </h1>

      {week11Plan.days.map(({ day, gym, outdoor }) => (
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
