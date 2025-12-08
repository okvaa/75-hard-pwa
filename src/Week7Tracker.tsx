
import { useState, useEffect } from "react";
import { Card, CardContent } from "./components/ui/card";
import { Checkbox } from "./components/ui/checkbox";
import { ScrollArea } from "./components/ui/scroll-area";

const week7Plan = [
  {
    day: "📅  Week of August 18th to 24th",
    gym: [],
    outdoor: "",
  },
  {  
    day: "🔴 Monday – Push Strength",
      gym: [
        "Incline Bench Press – 4x8",
        "Dumbbell Arnold Press – 3x10",
        "Close-Grip Push-ups – 3x15",
        "Cable Triceps Pushdowns – 3x12",
      ],
      outdoor: "Walk/jog + upper body stretches",
    },
    {
      day: "🔵 Tuesday – Pull & Core",
      gym: [
        "Weighted Pull-ups – 4x6",
        "Barbell Rows – 3x10",
        "EZ Bar Curls – 3x12",
        "Cable Woodchoppers – 3x15",
      ],
      outdoor: "Light run or swim + ab mobility",
    },
    {
      day: "🟣 Wednesday – Lower Body Power",
      gym: [
        "Front Squats – 4x6",
        "Step-ups – 3x12",
        "Hamstring Curls – 3x15",
        "Jump Squats – 3x10",
      ],
      outdoor: "Stair sprints or sled pushes",
    },
    {
      day: "🟠 Thursday – Knees Over Toes Focus",
      gym: [
        "ATG Split Squats – 3x10",
        "Reverse Sled Drags – 4x30 ft",
        "Tibialis Raises – 3x20",
        "Slant Board Squats – 3x15",
      ],
      outdoor: "Stretch band walk & ankle rotations",
    },
    {
      day: "🟡 Friday – Shoulders & Arms",
      gym: [
        "Seated Overhead Press – 4x8",
        "Lateral Raises – 3x12",
        "Incline Curls – 3x12",
        "Dips or Bench Dips – 3x10",
      ],
      outdoor: "Mobility band shoulder opener walk",
    },
    {
      day: "🟢 Saturday – Metcon Madness",
      gym: [
        "EMOM 10 min: 5 Burpees + 10 Kettlebell Swings",
        "Wall Balls – 3x20",
        "Battle Ropes – 3x45 sec",
        "Rowing or SkiErg – 3x400m",
      ],
      outdoor: "Ruck or park circuit",
    },
    {
      day: "🔘 Sunday – Recovery",
      gym: [
        "Foam Rolling – 10 min",
        "Mobility Flow – 15 min",
        "Breathwork + Meditation – 10 min",
      ],
      outdoor: "Leisure walk and sun exposure",
  },
];

export default function Week7Tracker() {
  const [completed, setCompleted] = useState({});

  useEffect(() => {
    const saved = localStorage.getItem("week7Progress");
    if (saved) setCompleted(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("week7Progress", JSON.stringify(completed));
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
      {week7Plan.map(({ day, gym, outdoor }) => (
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
