import { useState } from "react";
import MainTaskMenu from "./MainTaskMenu";
import Week25Tracker from "./Week25Tracker";
import Week26Tracker from "./Week26Tracker";
import Week27Tracker from "./Week27Tracker";
import Week28Tracker from "./Week28Tracker";
import Week29Tracker from "./Week29Tracker"; 
import Week30Tracker from "./Week30Tracker";
import Week31Tracker from "./Week31Tracker";
import Week32Tracker from "./Week32Tracker";
import Week33Tracker from "./Week33Tracker";
import Week34Tracker from "./Week34Tracker";
import Week35Tracker from "./Week35Tracker";
import Week36Tracker from "./Week36Tracker"; 
import Week37Tracker from "./Week37Tracker"; // Placeholder for future week
import DayCounter from "./DayCounterView";
import Dashboard from "./ProgressDashboard";
import Photos from "./PhotoPage";
import SupplementRoutineTracker from "./SupplementRoutineTracker";
import InjectionTracker from "./InjectionTracker";
import Norwegian4x4 from "./Norwegian4x4";
import TRXTracker from "./TRXTracker";
import ABSTracker from "./ABSTracker";
import NeckTracker from "./NeckTracker";
import Week31NeckFinisher from "./Week31NeckFinisher";  

// Map your week trackers
const weekPlans: Record<string, any> = {
  week25: Week25Tracker,
  week26: Week26Tracker,
  week27: Week27Tracker,
  week28: Week28Tracker,
  week29: Week29Tracker, 
  week30: Week30Tracker,
  week31: Week31Tracker,
  week32: Week32Tracker,
  week33: Week33Tracker,
  week34: Week34Tracker,
  week35: Week35Tracker,
  week36: Week36Tracker,
  week37: Week37Tracker, // Placeholder for future week
};

// Map other views
const otherViews: Record<string, any> = {
  day: DayCounter,
  dashboard: Dashboard,
  photos: Photos,
  supplements: SupplementRoutineTracker,
  injections: InjectionTracker,
  norwegian: Norwegian4x4,
  trx: TRXTracker,
  abs: ABSTracker,
  neck: NeckTracker,
  neck31: Week31NeckFinisher,

};

export default function App() {
  const [view, setView] = useState("menu");

  // Determine which component to render
  const Component = weekPlans[view] || otherViews[view] || null;

  return (
    <div className="min-h-screen bg-background p-4">
      {/* Main menu */}
      {view === "menu" && <MainTaskMenu setView={setView} />}

      {/* Render selected view */}
      {Component && view !== "menu" && <Component />}

      {/* Fallback for invalid view */}
      {!Component && view !== "menu" && (
        <div className="text-center text-red-600 mt-10">
          ⚠ View not found: {view}
        </div>
      )}

      {/* Back button */}
      {view !== "menu" && (
        <button
          className="fixed bottom-4 left-4 px-4 py-2 rounded-xl bg-muted"
          onClick={() => setView("menu")}
        >
          ⬅ Menu
        </button>
      )}
    </div>
  );
}
