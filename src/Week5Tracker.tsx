
import { useState, useEffect } from "react";
import { Card, CardContent } from "./components/ui/card";
import { Checkbox } from "./components/ui/checkbox";
import { ScrollArea } from "./components/ui/scroll-area";

const week5Plan = [
  {
    day: "🔴 Monday – ATG Split Squats & Tibialis",
    gym: [
      "Tibialis Raises – 3x15",
      "ATG Split Squats – 3x8/leg",
      "Sled Push – 4x40m",
      "Step-ups – 3x12",
    ],
    outdoor: "45-min walk backward and forward (split time)",
  },
  {
    day: "🔵 Tuesday – Knee Mobility + Hamstrings",
    gym: [
      "Nordic Curls – 3x5 (assisted OK)",
      "Hamstring Curls – 3x12",
      "Couch Stretch – 3x30 sec",
      "Sled Pull Backward – 4x20m",
    ],
    outdoor: "Easy run or jump rope (10 mins) + stretch",
  },
  {
    day: "🟣 Wednesday – Ankles & Calves",
    gym: [
      "Slant Board Squats – 3x12",
      "Seated Calf Raise – 4x20",
      "Standing Calf Raise – 3x25",
      "ATG Toe Touches – 2x10",
    ],
    outdoor: "Walk hills or stairs for 30–45 minutes",
  },
  {
    day: "🟠 Thursday – Strength Day",
    gym: [
      "Front Squats – 4x5",
      "Reverse Nordic Curls – 2x10",
      "Hip Flexor Lifts – 3x12",
      "Tibialis DB Walk – 3x20m",
    ],
    outdoor: "Sprint intervals or sled drag",
  },
  {
    day: "🟡 Friday – Athletic Movement",
    gym: [
      "Depth Drops – 3x5",
      "Box Jumps – 3x5",
      "ATG Split Squat – 3x6",
      "Walking Lunges – 3x20 steps",
    ],
    outdoor: "Agility ladder + mobility drills",
  },
  {
    day: "🟢 Saturday – Recovery Flow",
    gym: [
      "Foam Roll – 10 min",
      "KOT Stretch Routine – 20 min",
      "Isometric Lunges – 3x30 sec/leg",
    ],
    outdoor: "Walk backward for 20 minutes",
  },
  {
    day: "🔘 Sunday – Optional/Repeat Favorite",
    gym: [
      "Repeat one of the week’s best sessions",
      "Focus on form, not intensity",
    ],
    outdoor: "Your choice – no pressure",
  },
];

export default function Week5Tracker() {
  const [completed, setCompleted] = useState({});

  useEffect(() => {
    const saved = localStorage.getItem("week5Progress");
    if (saved) setCompleted(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("week5Progress", JSON.stringify(completed));
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
      {week5Plan.map(({ day, gym, outdoor }) => (
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
