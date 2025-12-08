import { useState, useEffect } from "react";
import { Button } from "./components/ui/button";
import ExerciseTracker from "./ExerciseTracker";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { BookOpen, CalendarDays } from "lucide-react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

import MealPlanTracker from "./MealPlanTracker";
import PhotoPage from "./PhotoPage";
import ProgressDashboard from "./ProgressDashboard";

const TASKS = [
  { label: "Exercise" },
  { label: "Follow a diet" },
  { label: "Drink a gallon of water" },
  { label: "Read 10 pages" },
  { label: "Take a progress photo" },
  { label: "View streaks" },
  { label: "Progress Dashboard" },
];

export default function MainTaskMenu() {
  const [selectedTask, setSelectedTask] = useState<string | null>(() => {
    return localStorage.getItem("selectedTask") || null;
  });

  const [waterIntake, setWaterIntake] = useState(() => {
    return parseInt(localStorage.getItem("waterIntake") || "0");
  });

  const [pagesRead, setPagesRead] = useState(() => {
    return parseInt(localStorage.getItem("pagesRead") || "0");
  });

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("darkMode") === "true";
  });

  const [completedDates, setCompletedDates] = useState<Date[]>(() => {
    const stored = localStorage.getItem("completedDates");
    return stored ? JSON.parse(stored).map((d: string) => new Date(d)) : [];
  });

  // Persist state
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

  // Helpers
  const markTodayComplete = () => {
    const today = new Date();
    const isMarked = completedDates.some(
      (d) => d.toDateString() === today.toDateString()
    );
    if (!isMarked) {
      setCompletedDates([...completedDates, today]);
    }
  };

  const handleWater = () => {
    const next = Math.min(waterIntake + 17, 129);
    setWaterIntake(next);
    if (next === 129) {
      confetti();
      markTodayComplete();
    }
  };

  const handleRead = () => {
    const next = pagesRead + 1;
    setPagesRead(next);
    if (next >= 10) {
      confetti();
      markTodayComplete();
    }
  };

  const resetProgress = () => {
    setWaterIntake(0);
    setPagesRead(0);
    setCompletedDates([]);
    localStorage.clear();
  };

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      className={`p-4 space-y-4 max-w-sm mx-auto min-h-screen transition-colors duration-300 ${
        darkMode ? "bg-gray-900 text-white" : "bg-white text-black"
      }`}
      initial="initial"
      animate="animate"
      variants={fadeIn}
      transition={{ duration: 0.4 }}
    >
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-center flex-1">
          75 Hard Tracker
        </h2>
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="text-xs border px-2 py-1 rounded"
        >
          {darkMode ? "☀️ Light" : "🌙 Dark"}
        </button>
      </div>

      {/* Task buttons */}
      <div className="grid gap-2">
        {TASKS.map((t) => (
          <Button
            key={t.label}
            variant={selectedTask === t.label ? "default" : "outline"}
            onClick={() => setSelectedTask(t.label)}
            className="w-full"
          >
            {t.label}
          </Button>
        ))}
      </div>

      {/* Reset */}
      <div className="text-center mt-4">
        <Button variant="destructive" onClick={resetProgress} className="w-full">
          Clear All Data
        </Button>
      </div>

      {/* Views */}
      {selectedTask === "Exercise" && (
        <motion.div className="mt-6" variants={fadeIn}>
          <ExerciseTracker />
        </motion.div>
      )}

      {selectedTask === "Follow a diet" && (
        <motion.div className="mt-6" variants={fadeIn}>
          <MealPlanTracker />
        </motion.div>
      )}

      {selectedTask === "Drink a gallon of water" && (
        <motion.div
          className="mt-6 space-y-4 flex flex-col items-center bg-blue-50 dark:bg-blue-900 rounded-xl p-4 shadow-md"
          variants={fadeIn}
        >
          <h3 className="text-xl font-bold">Water Tracker 💧</h3>
          <p className="text-sm">Goal</p>
          <p className="text-3xl font-bold">129oz</p>

          <div className="w-40 h-40 relative">
            <CircularProgressbar
              value={(waterIntake / 129) * 100}
              text={`${waterIntake}`}
              styles={buildStyles({
                textColor: darkMode ? "#fff" : "#1e3a8a",
                pathColor: "#0077cc",
                trailColor: "#d1e9ff",
              })}
            />
          </div>

          <Button onClick={() => setWaterIntake(129)} className="w-full">
            Drink All
          </Button>

          <Button onClick={handleWater} className="w-full">
            Drink 17oz
          </Button>
        </motion.div>
      )}

      {selectedTask === "Read 10 pages" && (
        <motion.div
          className="mt-6 space-y-3 text-center bg-purple-50 dark:bg-purple-900 shadow-md rounded-xl p-4"
          variants={fadeIn}
        >
          <BookOpen className="mx-auto text-purple-500 w-8 h-8 animate-bounce" />
          <p className="text-lg font-semibold">Pages read: {pagesRead}</p>
          <Button onClick={handleRead} className="w-full">
            Add 1 Page
          </Button>
        </motion.div>
      )}

      {selectedTask === "Take a progress photo" && (
        <motion.div
          className="mt-6 bg-yellow-50 dark:bg-yellow-900 shadow-md rounded-xl p-4"
          variants={fadeIn}
        >
          <PhotoPage />
        </motion.div>
      )}

      {selectedTask === "View streaks" && (
        <motion.div
          className="mt-6 space-y-3 text-center bg-gray-50 dark:bg-gray-800 shadow-md rounded-xl p-4"
          variants={fadeIn}
        >
          <CalendarDays className="mx-auto text-indigo-600 w-8 h-8" />
          <h3 className="text-xl font-semibold">Daily Completion Calendar</h3>

          <Calendar
            tileClassName={({ date }) =>
              completedDates.some(
                (d) => d.toDateString() === date.toDateString()
              )
                ? "bg-indigo-500 text-white rounded-full"
                : ""
            }
          />
        </motion.div>
      )}

      {selectedTask === "Progress Dashboard" && (
        <motion.div className="mt-6" variants={fadeIn}>
          <ProgressDashboard />
        </motion.div>
      )}
    </motion.div>
  );
}
