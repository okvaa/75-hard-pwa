import { useState } from "react";
import { Button } from "./components/ui/button";
import Week2Tracker from "./Week2Tracker";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { Dumbbell, BookOpen, Camera, Salad } from "lucide-react";

const tasks = [
  "Exercise",
  "Follow a diet",
  "Drink a gallon of water",
  "Read 10 pages",
  "Take a progress photo",
];

export default function MainTaskMenu() {
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  const [waterIntake, setWaterIntake] = useState(0);
  const [pagesRead, setPagesRead] = useState(0);

  const handleSelect = (task: string) => {
    setSelectedTask(task);
  };

  const handleWaterIncrease = () => setWaterIntake(waterIntake + 1);
  const handlePagesIncrease = () => setPagesRead(pagesRead + 1);

  const resetProgress = () => {
    setWaterIntake(0);
    setPagesRead(0);
  };

  return (
    <div className="p-4 space-y-4 max-w-sm mx-auto">
      <h2 className="text-2xl font-bold text-center text-blue-800 mb-4">75 Hard Tracker</h2>
      <div className="grid gap-2">
        {tasks.map((task) => (
          <Button
            key={task}
            variant={selectedTask === task ? "default" : "outline"}
            onClick={() => handleSelect(task)}
            className="w-full"
          >
            {task}
          </Button>
        ))}
      </div>

      {selectedTask === "Exercise" && (
        <div className="mt-6">
          <Week2Tracker />
        </div>
      )}

      {selectedTask === "Drink a gallon of water" && (
        <div className="mt-6 space-y-4 flex flex-col items-center">
          <h3 className="text-xl font-bold text-blue-700">Water tracker 💧</h3>
          <p className="text-sm">You must drink</p>
          <p className="text-3xl font-bold text-blue-900">129oz</p>

          <div className="w-40 h-40 relative">
            <CircularProgressbar
              value={(waterIntake / 129) * 100}
              text={`${waterIntake}`}
              styles={buildStyles({
                textColor: "#1e3a8a",
                pathColor: "#0077cc",
                trailColor: "#d1e9ff",
                textSize: "24px",
              })}
            />
            <div className="absolute inset-0 flex flex-col justify-center items-center text-center text-sm mt-2">
              <div className="text-blue-800 font-semibold">{waterIntake}</div>
              <div className="text-gray-500">/ 129</div>
              <div className="text-xs text-gray-400 mt-1">First steps ;)</div>
            </div>
          </div>

          <button
            className="bg-blue-600 text-white px-6 py-2 rounded-full font-semibold w-full"
            onClick={() => setWaterIntake(129)}
          >
            Drink all ✅
          </button>

          <button
            className="bg-blue-600 text-white px-6 py-2 rounded-full font-semibold w-full"
            onClick={() => setWaterIntake((prev) => Math.min(prev + 17, 129))}
          >
            Drink 17oz
          </button>

          <Button variant="outline" onClick={resetProgress}>
            Reset
          </Button>
        </div>
      )}

      {selectedTask === "Read 10 pages" && (
        <div className="mt-6 space-y-3 text-center bg-white shadow-md rounded-xl p-4">
          <BookOpen className="mx-auto text-blue-500 w-8 h-8" />
          <p className="text-lg font-semibold text-blue-700">Pages read: {pagesRead}</p>
          <Button onClick={handlePagesIncrease} className="w-full">Add 1 Page</Button>
          <Button variant="outline" onClick={resetProgress} className="w-full">Reset</Button>
        </div>
      )}

      {selectedTask === "Take a progress photo" && (
        <div className="mt-6 space-y-3 text-center bg-white shadow-md rounded-xl p-4">
          <Camera className="mx-auto text-blue-500 w-8 h-8" />
          <p className="text-base font-medium">Tap to upload today's photo:</p>
          <input type="file" accept="image/*" className="text-sm mx-auto block" />
        </div>
      )}

      {selectedTask === "Follow a diet" && (
        <div className="mt-6 text-center bg-white shadow-md rounded-xl p-4">
          <Salad className="mx-auto text-green-600 w-8 h-8" />
          <p className="text-base font-medium text-green-800">Stay consistent and no cheat meals!</p>
        </div>
      )}
    </div>
  );
}
