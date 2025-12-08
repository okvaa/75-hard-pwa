import { useState, useEffect } from "react";
import ABSTracker from "./ABSTracker";
import TRXTracker from "./TRXTracker";
import Week2Tracker from "./Week2Tracker";
import Week3Tracker from "./Week3Tracker";
import Week4Tracker from "./Week4Tracker";
import Week5Tracker from "./Week5Tracker";
import Week6Tracker from "./Week6Tracker";
import Week7Tracker from "./Week7Tracker";
import Week8Tracker from "./Week8Tracker";
import Week9Tracker from "./Week9Tracker";
import Week10Tracker from "./Week10Tracker";
import Week11Tracker from "./Week11Tracker";
import Week12Tracker from "./Week12Tracker";
import Week13Tracker from "./Week13Tracker";
import Week14Tracker from "./Week14Tracker";
import Week15Tracker from "./Week15Tracker";
import Week16Tracker from "./Week16Tracker";
import Week17Tracker from "./Week17Tracker";
import Week18Tracker from "./Week18Tracker";
import Week19Tracker from "./Week19Tracker";
import Week20Tracker from "./Week20Tracker";
import Week21Tracker from "./Week21Tracker";
import Week22Tracker from "./Week22Tracker";
import Week23Tracker from "./Week23Tracker";
import Week24Tracker from "./Week24Tracker";
import Week25Tracker from "./Week25Tracker";
import Week26Tracker from "./Week26Tracker";



export default function ExerciseTracker() {
  // 🗓️ Set your actual Day 1 start date here:
  const startDate = new Date("2024-07-01");
  const today = new Date();

  // Calculate how many full weeks have passed since Day 1
  const weekNumber = Math.ceil(
    (today.getTime() - startDate.getTime()) / (7 * 24 * 60 * 60 * 1000)
  );

  // Cap the week number to 19 since that’s your current max
  const autoWeek = `Week ${Math.min(Math.max(weekNumber, 2), 19)}`;

  // Try to load last selected week, fallback to current week
  const [selectedWeek, setSelectedWeek] = useState(() => {
    return localStorage.getItem("selectedWeek") || autoWeek;
  });

  // Persist selected week
  useEffect(() => {
    localStorage.setItem("selectedWeek", selectedWeek);
  }, [selectedWeek]);

  const weeks = [
    "ABS Workouts",
    "TRX Workouts",
    "Week 2",
    "Week 3",
    "Week 4",
    "Week 5",
    "Week 6",
    "Week 7",
    "Week 8",
    "Week 9",
    "Week 10",
    "Week 11",
    "Week 12",
    "Week 13",
    "Week 14",
    "Week 15",
    "Week 16",
    "Week 17",
    "Week 18",
    "Week 19",
    "Week 20",
    "Week 21",
    "Week 22",
    "Week 23",
    "Week 24",
    "Week 25",
    "Week 26",
  ];

  return (
    <div className="p-4 max-w-md mx-auto">
      {/* Week selector tabs */}
      <div className="flex flex-wrap justify-center gap-2 mb-4">
        {weeks.map((week) => (
          <button
            key={week}
            onClick={() => setSelectedWeek(week)}
            className={`px-3 py-1 rounded-full text-sm font-medium border transition ${
              selectedWeek === week
                ? "bg-blue-600 text-white"
                : "bg-white border-gray-300 text-gray-600"
            }`}
          >
            {week}
          </button>
        ))}
      </div>

      {/* Render the correct week tracker */}
      {selectedWeek === "ABS Workouts" && <ABSTracker />} 
      {selectedWeek === "TRX Workouts" && <TRXTracker />}
      {selectedWeek === "Week 2" && <Week2Tracker />}
      {selectedWeek === "Week 3" && <Week3Tracker />}
      {selectedWeek === "Week 4" && <Week4Tracker />}
      {selectedWeek === "Week 5" && <Week5Tracker />}
      {selectedWeek === "Week 6" && <Week6Tracker />}
      {selectedWeek === "Week 7" && <Week7Tracker />}
      {selectedWeek === "Week 8" && <Week8Tracker />}
      {selectedWeek === "Week 9" && <Week9Tracker />}
      {selectedWeek === "Week 10" && <Week10Tracker />}
      {selectedWeek === "Week 11" && <Week11Tracker />}
      {selectedWeek === "Week 12" && <Week12Tracker />}
      {selectedWeek === "Week 13" && <Week13Tracker />}
      {selectedWeek === "Week 14" && <Week14Tracker />}
      {selectedWeek === "Week 15" && <Week15Tracker />}
      {selectedWeek === "Week 16" && <Week16Tracker />}
      {selectedWeek === "Week 17" && <Week17Tracker />}
      {selectedWeek === "Week 18" && <Week18Tracker />}
      {selectedWeek === "Week 19" && <Week19Tracker />}
      {selectedWeek === "Week 20" && <Week20Tracker />}
      {selectedWeek === "Week 21" && <Week21Tracker />}
      {selectedWeek === "Week 22" && <Week22Tracker />}
      {selectedWeek === "Week 23" && <Week23Tracker />}
      {selectedWeek === "Week 24" && <Week24Tracker />}
      {selectedWeek === "Week 25" && <Week25Tracker />}
      {selectedWeek === "Week 26" && <Week26Tracker />}
    </div>
  );
}
