
import { useState, useEffect } from "react";
import { Card, CardContent } from "./components/ui/card";
import { Checkbox } from "./components/ui/checkbox";
import { ScrollArea } from "./components/ui/scroll-area";

const week6Plan = [
  {
      day: "🔴 Monday – Upper Body Push",
      gym: [
        "Barbell Bench Press – 4x6",
        "Dumbbell Shoulder Press – 3x10",
        "Incline Push-ups – 3x15",
        "Overhead Triceps Extension – 3x12",
      ],
      outdoor: "30-min power walk + shoulder mobility drill",
    },
    {
      day: "🔵 Tuesday – Lower Body Strength",
      gym: [
        "Trap Bar Deadlifts – 4x5",
        "Bulgarian Split Squats – 3x10",
        "Glute Bridges – 3x15",
        "Tibialis Raises – 3x20",
      ],
      outdoor: "Hiking or long incline treadmill walk",
    },
    {
      day: "🟣 Wednesday – Mobility & Core",
      gym: [
        "Couch Stretch – 2 min/leg",
        "Plank to Down Dog – 3x10",
        "V-Ups – 3x15",
        "Side Plank – 3x30 sec/side",
      ],
      outdoor: "Easy bike ride or long stretch in the sun",
    },
    {
      day: "🟠 Thursday – Full Body Hypertrophy",
      gym: [
        "Kettlebell Swings – 3x20",
        "Chin-ups – 3xAMRAP",
        "Landmine Press – 3x10",
        "Lunges – 3x20 steps",
      ],
      outdoor: "Bodyweight circuit in the park",
    },
    {
      day: "🟡 Friday – Posterior Chain Focus",
      gym: [
        "Romanian Deadlifts – 4x8",
        "Single Leg Deadlifts – 3x10",
        "Face Pulls – 3x15",
        "Calf Raises – 4x25",
      ],
      outdoor: "Sandbag carry + ankle mobility routine",
    },
    {
      day: "🟢 Saturday – Conditioning Challenge",
      gym: [
        "Row 500m x 4",
        "Battle Ropes – 3x30 sec",
        "Wall Balls – 3x15",
        "Box Jumps – 3x12",
      ],
      outdoor: "Jog/walk intervals or sport of choice",
    },
    {
      day: "🔘 Sunday – Recovery",
      gym: [
        "Lacrosse Ball Massage – 10 min",
        "Deep Stretch – 20 min",
        "Diaphragmatic Breathing – 5 min",
      ],
      outdoor: "Nature walk or active play",
  },
];

export default function Week6Tracker() {
  const [completed, setCompleted] = useState({});

  useEffect(() => {
    const saved = localStorage.getItem("week6Progress");
    if (saved) setCompleted(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("week6Progress", JSON.stringify(completed));
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
      {week6Plan.map(({ day, gym, outdoor }) => (
        <Card key={day} className="rounded-2xl shadow-md">
          <CardContent className="p-4">
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
          </CardContent>
        </Card>
      ))}
    </ScrollArea>
  );
}
