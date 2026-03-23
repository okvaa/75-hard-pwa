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
import Week37Tracker from "./Week37Tracker";
import Week38Tracker from "./Week38Tracker";
import Week39Tracker from "./Week39Tracker";
import Week40Tracker from "./Week40Tracker";
import DayCounter from "./DayCounterView";
import Dashboard from "./ProgressDashboard";
import Photos from "./PhotoPage";
import SupplementRoutineTracker from "./SupplementRoutineTracker";
import InjectionTracker from "./InjectionTracker";
import FastingTracker from "./FastingTracker";
import Norwegian4x4 from "./Norwegian4x4";
import TRXTracker from "./TRXTracker";
import ABSTracker from "./ABSTracker";
import NeckTracker from "./NeckTracker";
import Week31NeckFinisher from "./Week31NeckFinisher";

const weekPlans: Record<string, any> = {
  week25: Week25Tracker, week26: Week26Tracker, week27: Week27Tracker,
  week28: Week28Tracker, week29: Week29Tracker, week30: Week30Tracker,
  week31: Week31Tracker, week32: Week32Tracker, week33: Week33Tracker,
  week34: Week34Tracker, week35: Week35Tracker, week36: Week36Tracker,
  week37: Week37Tracker, week38: Week38Tracker, week39: Week39Tracker,
};

const otherViews: Record<string, any> = {
  day: DayCounter, dashboard: Dashboard, photos: Photos,
  supplements: SupplementRoutineTracker, injections: InjectionTracker,
  norwegian: Norwegian4x4, trx: TRXTracker, abs: ABSTracker,
  neck: NeckTracker, neck31: Week31NeckFinisher,
};

export default function App() {
  const [view, setView] = useState("menu");

  // ── THEME STATE lifted to App level so it applies everywhere ──
  const [isDark, setIsDark] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem("75h-theme");
      return saved !== null ? saved === "dark" : true;
    } catch { return true; }
  });

  const toggleTheme = () => {
    setIsDark((prev) => {
      const next = !prev;
      try { localStorage.setItem("75h-theme", next ? "dark" : "light"); } catch {}
      return next;
    });
  };

  const Component = weekPlans[view] || otherViews[view] || null;

  // Back button styles driven by theme
  const backBtnStyle: React.CSSProperties = {
    position: "fixed",
    bottom: 16,
    left: 16,
    padding: "8px 16px",
    borderRadius: 10,
    border: `1px solid ${isDark ? "#3a3a3a" : "#d0cdc8"}`,
    background: isDark ? "#1c1c1c" : "#ffffff",
    color: isDark ? "#e8e8e8" : "#1a1a1a",
    fontFamily: "'Barlow Condensed', sans-serif",
    fontSize: 13,
    fontWeight: 700,
    letterSpacing: "0.08em",
    textTransform: "uppercase" as const,
    cursor: "pointer",
    boxShadow: isDark ? "none" : "0 2px 8px rgba(0,0,0,0.1)",
    transition: "all 0.2s ease",
    zIndex: 50,
  };

  return (
    // Apply theme class at the very root — everything inside inherits CSS variables
    <div
      className={isDark ? "theme-dark" : "theme-light"}
      style={{
        minHeight: "100vh",
        background: isDark ? "#0d0d0d" : "#f5f4f0",
        transition: "background 0.25s ease",
      }}
    >
      {/* Main menu — receives isDark + toggleTheme so the toggle button works */}
      {view === "menu" && (
        <MainTaskMenu
          setView={setView}
          isDark={isDark}
          toggleTheme={toggleTheme}
        />
      )}

      {/* All other views get the theme class automatically from the root div above */}
      {Component && view !== "menu" && <Component />}

      {/* Fallback */}
      {!Component && view !== "menu" && (
        <div style={{ textAlign: "center", color: "#ef4444", marginTop: 40 }}>
          ⚠ View not found: {view}
        </div>
      )}

      {/* Back button — styled to match current theme */}
      {view !== "menu" && (
        <button style={backBtnStyle} onClick={() => setView("menu")}>
          ⬅ Menu
        </button>
      )}
    </div>
  );
}
