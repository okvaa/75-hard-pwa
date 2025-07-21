import { useState, useEffect } from "react";
import { Button } from "./components/ui/button";
import Week2Tracker from "./Week2Tracker";
import Week3Tracker from "./Week3Tracker";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { Dumbbell, BookOpen, Camera, Salad, CalendarDays } from "lucide-react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';

const tasks = [
  "Exercise",
  "Exercise – Week 3",
  "Follow a diet",
  "Drink a gallon of water",
  "Read 10 pages",
  "Take a progress photo",
  "View streaks",
];

export default function MainTaskMenu() {
  const [selectedTask, setSelectedTask] = useState<string | null>(() => {
    const stored = localStorage.getItem("selectedTask");
    return stored ? stored : null;
  });

  const [waterIntake, setWaterIntake] = useState(() => {
    const stored = localStorage.getItem("waterIntake");
    return stored ? parseInt(stored) : 0;
  });
  const [pagesRead, setPagesRead] = useState(() => {
    const stored = localStorage.getItem("pagesRead");
    return stored ? parseInt(stored) : 0;
  });
  const [darkMode, setDarkMode] = useState(() => {
    const stored = localStorage.getItem("darkMode");
    return stored ? stored === "true" : false;
  });
  const [completedDates, setCompletedDates] = useState<Date[]>(() => {
    const stored = localStorage.getItem("completedDates");
    return stored ? JSON.parse(stored).map((d: string) => new Date(d)) : [];
  });

  useEffect(() => {
    localStorage.setItem("selectedTask", selectedTask ?? "");
  }, [selectedTask]);

  useEffect(() => {
    localStorage.setItem("waterIntake", waterIntake.toString());
  }, [waterIntake]);

  useEffect(() => {
    localStorage.setItem("pagesRead", pagesRead.toString());
  }, [pagesRead]);

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode.toString());
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem("completedDates", JSON.stringify(completedDates));
  }, [completedDates]);

  const handleSelect = (task: string) => {
    setSelectedTask(task);
    localStorage.setItem("selectedTask", task);
  };

  const handleWaterIncrease = () => {
    const next = Math.min(waterIntake + 17, 129);
    setWaterIntake(next);
    if (next === 129) {
      confetti();
      markTodayComplete();
    }
  };

  const handlePagesIncrease = () => {
    const next = pagesRead + 1;
    setPagesRead(next);
    if (next >= 10) {
      confetti();
      markTodayComplete();
    }
  };

  const markTodayComplete = () => {
    const today = new Date();
    const alreadyMarked = completedDates.some(
      (date) => date.toDateString() === today.toDateString()
    );
    if (!alreadyMarked) {
      setCompletedDates([...completedDates, today]);
    }
  };

  const resetProgress = () => {
    setWaterIntake(0);
    setPagesRead(0);
    localStorage.removeItem("waterIntake");
    localStorage.removeItem("pagesRead");
    localStorage.removeItem("selectedTask");
    localStorage.removeItem("exerciseProgress");
    localStorage.removeItem("completedDates");
    setCompletedDates([]);
  };

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      className={`p-4 space-y-4 max-w-sm mx-auto min-h-screen transition-colors duration-300 ${darkMode ? "bg-gray-900 text-white" : "bg-white text-black"}`}
      initial="initial"
      animate="animate"
      variants={fadeIn}
      transition={{ duration: 0.5 }}
    >
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-center mb-4 flex-1">75 Hard Tracker</h2>
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="text-xs border px-2 py-1 rounded"
        >
          {darkMode ? "☀️ Light" : "🌙 Dark"}
        </button>
      </div>

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

      <div className="text-center mt-4">
        <Button variant="destructive" onClick={resetProgress} className="w-full">
          Clear All Data
        </Button>
      </div>

      {selectedTask === "Exercise" && (
        <motion.div className="mt-6" variants={fadeIn}>
          <Week2Tracker persist={true} />
        </motion.div>
      )}
      {selectedTask === "Exercise – Week 3" && <Week3Tracker />}


      {selectedTask === "Drink a gallon of water" && (
        <motion.div className="mt-6 space-y-4 flex flex-col items-center bg-blue-50 dark:bg-blue-900 rounded-xl p-4 shadow-md" variants={fadeIn}>
          <h3 className="text-xl font-bold">Water tracker 💧</h3>
          <p className="text-sm">You must drink</p>
          <p className="text-3xl font-bold">129oz</p>

          <div className="w-40 h-40 relative">
            <CircularProgressbar
              value={(waterIntake / 129) * 100}
              text={`${waterIntake}`}
              styles={buildStyles({
                textColor: darkMode ? "#fff" : "#1e3a8a",
                pathColor: "#0077cc",
                trailColor: "#d1e9ff",
                textSize: "24px",
              })}
            />
            <div className="absolute inset-0 flex flex-col justify-center items-center text-center text-sm mt-2">
              <div className="font-semibold">{waterIntake}</div>
              <div className="text-gray-500">/ 129</div>
              <div className="text-xs text-gray-400 mt-1">First steps ;)</div>
            </div>
          </div>

          <button
            className="bg-blue-600 text-white px-6 py-2 rounded-full font-semibold w-full"
            onClick={() => {
              setWaterIntake(129);
              confetti();
              markTodayComplete();
            }}
          >
            Drink all ✅
          </button>

          <button
            className="bg-blue-600 text-white px-6 py-2 rounded-full font-semibold w-full"
            onClick={handleWaterIncrease}
          >
            Drink 17oz
          </button>
        </motion.div>
      )}

      {selectedTask === "Read 10 pages" && (
        <motion.div className="mt-6 space-y-3 text-center bg-purple-50 dark:bg-purple-900 shadow-md rounded-xl p-4" variants={fadeIn}>
          <BookOpen className="mx-auto text-purple-500 w-8 h-8 animate-bounce" />
          <p className="text-lg font-semibold">Pages read: {pagesRead}</p>
          <Button onClick={handlePagesIncrease} className="w-full">Add 1 Page</Button>
        </motion.div>
      )}

      {selectedTask === "Take a progress photo" && (
        <motion.div className="mt-6 space-y-3 text-center bg-yellow-50 dark:bg-yellow-900 shadow-md rounded-xl p-4" variants={fadeIn}>
          <Camera className="mx-auto text-yellow-500 w-8 h-8 animate-pulse" />
          <p className="text-base font-medium">Tap to upload today's photo:</p>
          <input type="file" accept="image/*" className="text-sm mx-auto block" />
        </motion.div>
      )}

      {selectedTask === "Follow a diet" && (
        <motion.div className="mt-6 text-center bg-green-50 dark:bg-green-900 shadow-md rounded-xl p-4" variants={fadeIn}>
          <Salad className="mx-auto text-green-600 w-8 h-8 animate-spin-slow" />
          <p className="text-base font-medium">Stay consistent and no cheat meals!</p>
        </motion.div>
      )}

      {selectedTask === "View streaks" && (
        <motion.div className="mt-6 space-y-3 text-center bg-gray-50 dark:bg-gray-800 shadow-md rounded-xl p-4" variants={fadeIn}>
          <CalendarDays className="mx-auto text-indigo-600 w-8 h-8" />
          <h3 className="text-xl font-semibold">Daily Completion Calendar</h3>
          <Calendar
            value={new Date()}
            tileClassName={({ date }) =>
              completedDates.some(
                (d) => d.toDateString() === date.toDateString()
              )
                ? "bg-indigo-400 text-white rounded-full"
                : ""
            }
          />
        </motion.div>
      )}
    </motion.div>
  );
}
