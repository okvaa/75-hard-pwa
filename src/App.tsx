import { useState } from "react";
import MainTaskMenu from "./MainTaskMenu";
import DayCounterView from "./DayCounterView";
import ProgressDashboard from "./ProgressDashboard";
import PhotoPage from "./PhotoPage";
import Week25Tracker from "./Week25Tracker";
import TRXTracker from "./TRXTracker";
import Norwegian4x4 from "./Norwegian4x4";
import AbsTracker from "./AbsTracker";

export default function App() {
  const [view, setView] = useState("menu");

  return (
    <>
      {view === "menu" && <MainTaskMenu setView={setView} />}
      {view === "day" && <DayCounterView />}
      {view === "dashboard" && <ProgressDashboard />}
      {view === "photos" && <PhotoPage />}
      {view === "week25" && <Week25Tracker />}
      {view === "trx" && <TRXTracker />}
      {view === "norwegian" && <Norwegian4x4 />}
      {view === "abs" && <AbsTracker />}
    </>
  );
}
