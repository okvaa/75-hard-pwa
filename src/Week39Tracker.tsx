import { useEffect, useState, useMemo, useRef } from "react";

/* ================= GOOGLE FONTS ================= */
if (!document.getElementById("google-fonts-barlow")) {
  const fontLink = document.createElement("link");
  fontLink.id = "google-fonts-barlow";
  fontLink.href = "https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;900&family=Barlow:wght@300;400;500&display=swap";
  fontLink.rel = "stylesheet";
  document.head.appendChild(fontLink);
}

/* ================= STYLES ================= */
const injectStyles = () => {
  if (document.getElementById("w36-styles")) return;
  const style = document.createElement("style");
  style.id = "w36-styles";
  style.textContent = `
    :root {
      --bg: #0d0d0d; --bg2: #141414; --bg3: #1c1c1c;
      --border: #2a2a2a; --border-bright: #3a3a3a;
      --text: #e8e8e8; --text-muted: #666; --text-dim: #999;
      --accent: #f59e0b; --accent-dim: rgba(245,158,11,0.12);
      --green: #22c55e; --green-dim: rgba(34,197,94,0.12);
      --blue: #60a5fa; --blue-dim: rgba(96,165,250,0.1);
      --red: #ef4444; --red-dim: rgba(239,68,68,0.1);
      --font-display: 'Barlow Condensed', sans-serif;
      --font-body: 'Barlow', sans-serif;
    }
    * { box-sizing: border-box; }
    .tracker-root { max-width: 480px; margin: 0 auto; min-height: 100vh; background: var(--bg); color: var(--text); font-family: var(--font-body); padding-bottom: 60px; -webkit-font-smoothing: antialiased; }
    .tracker-header { padding: 28px 20px 20px; border-bottom: 1px solid var(--border); background: linear-gradient(180deg, #111 0%, var(--bg) 100%); }
    .tracker-header .week-label { font-family: var(--font-display); font-size: 11px; font-weight: 600; letter-spacing: 0.2em; text-transform: uppercase; color: var(--accent); margin-bottom: 4px; }
    .tracker-header h1 { font-family: var(--font-display); font-size: 36px; font-weight: 900; letter-spacing: -0.02em; line-height: 1; }
    .tracker-header h1 span { color: var(--accent); }
    .week-switcher { display: flex; align-items: center; gap: 10px; margin-top: 12px; }
    .week-btn { background: var(--bg3); border: 1px solid var(--border); border-radius: 6px; color: var(--text-muted); font-family: var(--font-display); font-size: 12px; font-weight: 700; letter-spacing: 0.08em; padding: 5px 10px; cursor: pointer; transition: all 0.15s; text-transform: uppercase; }
    .week-btn:hover:not(:disabled) { border-color: var(--border-bright); color: var(--text); }
    .week-btn:disabled { opacity: 0.3; cursor: default; }
    .week-num { font-family: var(--font-display); font-size: 14px; font-weight: 700; letter-spacing: 0.1em; color: var(--text-dim); flex: 1; text-align: center; text-transform: uppercase; }
    .week-num.current { color: var(--accent); }
    .day-strip { display: flex; gap: 6px; padding: 14px 20px; overflow-x: auto; border-bottom: 1px solid var(--border); scrollbar-width: none; }
    .day-strip::-webkit-scrollbar { display: none; }
    .day-chip { flex-shrink: 0; display: flex; flex-direction: column; align-items: center; gap: 4px; padding: 8px 10px; border-radius: 8px; border: 1px solid var(--border); background: var(--bg2); cursor: pointer; transition: all 0.15s ease; min-width: 50px; }
    .day-chip:hover { border-color: var(--border-bright); }
    .day-chip.active { background: var(--accent-dim); border-color: var(--accent); }
    .chip-day { font-family: var(--font-display); font-size: 10px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: var(--text-muted); }
    .day-chip.active .chip-day { color: var(--accent); }
    .chip-label { font-family: var(--font-display); font-size: 12px; font-weight: 700; color: var(--text-dim); text-transform: uppercase; }
    .day-chip.active .chip-label { color: var(--text); }
    .chip-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--border-bright); }
    .chip-dot.complete { background: var(--green); }
    .chip-dot.partial { background: var(--accent); }
    .section-header { display: flex; align-items: center; justify-content: space-between; padding: 20px 20px 10px; }
    .day-title { font-family: var(--font-display); font-size: 28px; font-weight: 900; letter-spacing: -0.01em; text-transform: uppercase; }
    .day-badge { font-family: var(--font-display); font-size: 11px; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; color: var(--accent); border: 1px solid var(--accent); padding: 3px 8px; border-radius: 4px; }
    .progress-bar-wrap { padding: 0 20px 16px; }
    .progress-bar-track { height: 3px; background: var(--border); border-radius: 2px; overflow: hidden; }
    .progress-bar-fill { height: 100%; background: var(--accent); border-radius: 2px; transition: width 0.4s ease; }
    .progress-bar-fill.complete { background: var(--green); }
    .progress-label { font-family: var(--font-display); font-size: 11px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: var(--text-muted); margin-top: 6px; }
    .readiness-card { margin: 0 16px 16px; border-radius: 12px; border: 1px solid var(--border); background: var(--bg2); padding: 16px; }
    .card-title { font-family: var(--font-display); font-size: 11px; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; color: var(--text-muted); margin-bottom: 12px; }
    .readiness-inner { display: flex; align-items: center; gap: 16px; }
    .readiness-gauge { position: relative; width: 72px; height: 72px; flex-shrink: 0; }
    .readiness-gauge svg { transform: rotate(-90deg); }
    .gauge-bg { stroke: var(--border); fill: none; }
    .gauge-fill { fill: none; stroke-linecap: round; transition: stroke-dashoffset 0.5s ease, stroke 0.3s ease; }
    .gauge-text { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; font-family: var(--font-display); font-size: 18px; font-weight: 900; }
    .readiness-details { flex: 1; }
    .readiness-input { width: 100%; background: var(--bg3); border: 1px solid var(--border); border-radius: 8px; padding: 8px 12px; font-family: var(--font-body); font-size: 14px; color: var(--text); outline: none; transition: border-color 0.15s; }
    .readiness-input:focus { border-color: var(--accent); }
    .readiness-input::placeholder { color: var(--text-muted); }
    .mode-badge { margin-top: 8px; font-family: var(--font-display); font-size: 13px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; }
    .mode-badge.full { color: #22c55e; }
    .mode-badge.reduced { color: var(--accent); }
    .mode-badge.recovery-mode { color: #60a5fa; }
    .recovery-day-card { margin: 0 16px 16px; border-radius: 12px; border: 1px solid #1e3a5f; background: rgba(30,58,95,0.25); padding: 28px 24px; text-align: center; }
    .recovery-day-card .rec-icon { font-size: 32px; margin-bottom: 8px; }
    .recovery-day-card h2 { font-family: var(--font-display); font-size: 22px; font-weight: 900; text-transform: uppercase; color: #93c5fd; margin-bottom: 6px; }
    .recovery-day-card p { font-size: 13px; color: var(--text-muted); }
    .exercises-wrap { padding: 0 16px; }
    .exercise-card { background: var(--bg2); border: 1px solid var(--border); border-radius: 12px; padding: 16px; margin-bottom: 10px; transition: border-color 0.2s, background 0.2s; }
    .exercise-card.complete { border-color: rgba(34,197,94,0.35); background: rgba(34,197,94,0.04); }
    .ex-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 6px; }
    .ex-name { font-family: var(--font-display); font-size: 18px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.02em; line-height: 1.15; flex: 1; }
    .ex-check { font-size: 15px; color: var(--green); flex-shrink: 0; margin-left: 8px; margin-top: 2px; }
    .ex-meta { font-family: var(--font-display); font-size: 12px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; color: var(--text-muted); margin-bottom: 12px; }
    {e.notes && (<div style={{fontSize: 11,color: "var(--text-muted)",marginBottom: 8}}>{e.notes} </div>)}
    .overload-hint { border-radius: 8px; border: 1px solid rgba(96,165,250,0.2); background: var(--blue-dim); padding: 10px 12px; margin-bottom: 10px; }
    .overload-hint.maintain { background: rgba(245,158,11,0.07); border-color: rgba(245,158,11,0.2); }
    .overload-hint.deload { background: rgba(239,68,68,0.08); border-color: rgba(239,68,68,0.2); }
    .overload-hint.no-data { background: var(--bg3); border-color: var(--border); }
    .hint-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; }
    .hint-tag { font-family: var(--font-display); font-size: 9px; font-weight: 700; letter-spacing: 0.18em; text-transform: uppercase; }
    .hint-tag.increase { color: var(--blue); }
    .hint-tag.maintain { color: var(--accent); }
    .hint-tag.deload { color: var(--red); }
    .hint-tag.no-data { color: var(--text-muted); }
    .hint-weights { display: flex; align-items: baseline; gap: 6px; flex-wrap: wrap; margin-bottom: 8px; }
    .hint-last { font-family: var(--font-display); font-size: 12px; color: var(--text-muted); }
    .hint-arrow { color: var(--text-muted); font-size: 11px; }
    .hint-suggest { font-family: var(--font-display); font-size: 20px; font-weight: 900; line-height: 1; }
    .hint-suggest.increase { color: var(--blue); }
    .hint-suggest.maintain { color: var(--accent); }
    .hint-suggest.deload { color: var(--red); }
    .hint-unit { font-family: var(--font-display); font-size: 11px; color: var(--text-muted); }
    .hint-delta { font-family: var(--font-display); font-size: 11px; font-weight: 700; letter-spacing: 0.06em; padding: 2px 6px; border-radius: 4px; align-self: center; }
    .hint-delta.increase { background: rgba(96,165,250,0.15); color: var(--blue); }
    .hint-delta.deload { background: rgba(239,68,68,0.15); color: var(--red); }
    .hint-apply-btn { background: transparent; border: 1px solid rgba(96,165,250,0.3); border-radius: 5px; color: var(--blue); font-family: var(--font-display); font-size: 10px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; padding: 4px 8px; cursor: pointer; transition: all 0.15s; white-space: nowrap; flex-shrink: 0; }
    .hint-apply-btn:hover { background: rgba(96,165,250,0.1); border-color: var(--blue); }
    .hint-apply-btn.maintain { border-color: rgba(245,158,11,0.3); color: var(--accent); }
    .hint-apply-btn.maintain:hover { background: rgba(245,158,11,0.08); border-color: var(--accent); }
    .hint-apply-btn.deload { border-color: rgba(239,68,68,0.3); color: var(--red); }
    .hint-apply-btn.deload:hover { background: rgba(239,68,68,0.08); border-color: var(--red); }
    .hint-history { display: flex; align-items: center; gap: 5px; }
    .hint-history-label { font-family: var(--font-display); font-size: 9px; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; color: var(--text-muted); margin-right: 2px; flex-shrink: 0; }
    .history-week { display: flex; flex-direction: column; align-items: center; gap: 3px; }
    .history-dot { width: 8px; height: 8px; border-radius: 50%; }
    .history-wk-label { font-family: var(--font-display); font-size: 8px; font-weight: 700; color: var(--text-muted); }
    .hint-streak-badge { margin-left: auto; font-family: var(--font-display); font-size: 10px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; padding: 2px 7px; border-radius: 10px; flex-shrink: 0; }
    .hint-streak-badge.streak-3 { background: rgba(34,197,94,0.18); color: #86efac; }
    .hint-streak-badge.streak-2 { background: rgba(96,165,250,0.15); color: var(--blue); }
    .hint-streak-badge.streak-1 { background: rgba(245,158,11,0.12); color: var(--accent); }
    .machine-input { width: 100%; background: var(--bg3); border: 1px solid var(--border); border-radius: 6px; padding: 7px 10px; font-family: var(--font-body); font-size: 12px; color: var(--text-dim); outline: none; margin-bottom: 10px; transition: border-color 0.15s; }
    .machine-input:focus { border-color: var(--border-bright); }
    .machine-input::placeholder { color: var(--text-muted); font-size: 11px; }
    .col-headers { display: grid; grid-template-columns: 28px 1fr 1fr auto; gap: 6px; margin-bottom: 4px; }
    .col-hdr { font-family: var(--font-display); font-size: 10px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: var(--text-muted); text-align: center; }
    .set-row { display: grid; grid-template-columns: 28px 1fr 1fr auto; gap: 6px; align-items: center; margin-bottom: 6px; }
    .set-num { font-family: var(--font-display); font-size: 11px; font-weight: 700; color: var(--text-muted); letter-spacing: 0.05em; text-align: right; }
    .set-input { background: var(--bg3); border: 1px solid var(--border); border-radius: 6px; padding: 7px 8px; font-family: var(--font-body); font-size: 13px; color: var(--text); outline: none; width: 100%; transition: border-color 0.15s; text-align: center; }
    .set-input:focus { border-color: var(--accent); }
    .set-input::placeholder { color: var(--text-muted); font-size: 11px; }
    .pain-scale { display: flex; gap: 3px; }
    .pain-btn { width: 24px; height: 24px; border-radius: 4px; border: 1px solid var(--border); background: var(--bg3); cursor: pointer; font-family: var(--font-display); font-size: 10px; font-weight: 700; color: var(--text-muted); transition: all 0.1s ease; display: flex; align-items: center; justify-content: center; }
    .pain-btn.p0.on { background: #14532d; border-color: #22c55e; color: #86efac; }
    .pain-btn.p1.on { background: #365314; border-color: #84cc16; color: #d9f99d; }
    .pain-btn.p2.on { background: #713f12; border-color: #f59e0b; color: #fde68a; }
    .pain-btn.p3.on { background: #7c2d12; border-color: #f97316; color: #fed7aa; }
    .pain-btn.p4.on { background: #7f1d1d; border-color: #ef4444; color: #fca5a5; }
    .cardio-check-label { display: flex; align-items: center; gap: 10px; cursor: pointer; padding: 8px 0 2px; }
    .cardio-checkbox { appearance: none; -webkit-appearance: none; width: 20px; height: 20px; border: 1px solid var(--border-bright); border-radius: 4px; background: var(--bg3); cursor: pointer; position: relative; transition: all 0.15s; flex-shrink: 0; }
    .cardio-checkbox:checked { background: var(--green); border-color: var(--green); }
    .cardio-checkbox:checked::after { content: '✓'; position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; font-size: 13px; color: #000; font-weight: 900; }
    .cardio-check-text { font-family: var(--font-display); font-size: 13px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: var(--text-dim); }
    .export-section { margin: 24px 16px 0; padding-top: 16px; border-top: 1px solid var(--border); }
    .export-title { font-family: var(--font-display); font-size: 10px; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase; color: var(--text-muted); margin-bottom: 10px; }
    .export-btns { display: flex; gap: 8px; }
    .export-btn { flex: 1; background: var(--bg2); border: 1px solid var(--border); border-radius: 8px; padding: 10px; font-family: var(--font-display); font-size: 12px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: var(--text-muted); cursor: pointer; transition: all 0.15s; }
    .export-btn:hover { border-color: var(--border-bright); color: var(--text); }
    .status-bar { font-family: var(--font-display); font-size: 10px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--text-muted); padding: 6px 20px 0; text-align: right; }
  `;
  document.head.appendChild(style);
};
injectStyles();

/* ================= CONSTANTS ================= */

const CURRENT_WEEK = 39;
const INCREMENT_LBS = 2.5;

const isCardioExercise = (name: string): boolean =>
  ["Exercise Bike","Incline Walk","Incline Walk Intervals","Zone 2 Walk",
   "Mobility Flow","Breathing / Decompression","Foam Roller + Mobility",
   "Incline Treadmill Walk","Sauna"].includes(name);

/* ================= TYPES ================= */

interface Exercise {
  name: string;
  reps: string;
  sets: number;
  targetTopSet?: number;
}

interface PlanDay {
  date: string;
  label: string;
  exercises: Exercise[];
}

interface SetEntry {
  weight?: string;
  reps?: string;
  pain?: string;
}

interface ExerciseEntry {
  sets?: SetEntry[];
  machine?: string;
  completed?: boolean;
}

type DayLog = Record<string, ExerciseEntry>;
type WeekLog = Record<string, DayLog>;
type AllLogs = Record<number, WeekLog>;

interface WeekHistoryEntry {
  hasData: boolean;
  allRepsComplete: boolean;
  hasPartialReps: boolean;
}

interface OverloadSuggestion {
  type: "increase" | "maintain" | "deload";
  lastWeight: number;
  suggestedWeight: number;
  streakWeeks: number;
  increment: number;
  perSet: { weight: string; reps: string }[];
  weekHistory: WeekHistoryEntry[];
}

/* ================= WEEK 39 PLAN ================= */

const week39Plan: PlanDay[] = [
  {
    date: "Mon March 23 • Week 39",
    label: "Back Width + Abs",
    exercises: [
      { name: "Sauna", sets: 1, reps: "15 min" },
      { name: "Neutral Grip Lat Pulldown", sets: 4, reps: "8-10" },
      { name: "Single Arm Cable Lat Pulldown", sets: 3, reps: "10/side" },
      { name: "Straight Arm Pulldown (Slow Eccentric)", sets: 3, reps: "12" },
      { name: "Chest Supported Row", sets: 3, reps: "10" },
      { name: "Rear Delt Fly", sets: 3, reps: "15" },
      { name: "Hanging Knee Raise", sets: 4, reps: "15" },
      { name: "Pallof Press", sets: 3, reps: "12/side" },
      { name: "Incline Treadmill Walk", sets: 1, reps: "15 min", notes: "10–12% incline · 3.0 mph" },
    ],
  },
  {
    date: "Tue March 24 • Week 39",
    label: "PUSH + Core",
    exercises: [
      { name: "Sauna", sets: 1, reps: "15 min" },
      { name: "Incline Dumbbell Press", sets: 4, reps: "8" },
      { name: "Machine Chest Press", sets: 3, reps: "10" },
      { name: "Low to High Cable Fly", sets: 3, reps: "12" },
      { name: "Seated Shoulder Press", sets: 3, reps: "10" },
      { name: "Cable Lateral Raise (Drop Set Last)", sets: 4, reps: "15" },
      { name: "Rope Triceps Pushdown", sets: 3, reps: "12" },
      { name: "Cable Crunch", sets: 4, reps: "15" }
    ],
  },
  {
    date: "Wed March 25 • Week 39",
    label: "LEGS + Core",
    exercises: [
      { name: "Sauna", sets: 1, reps: "15 min" },
      { name: "Hack Squat", sets: 3, reps: "10" },
      { name: "Step Ups (Dumbbell)", sets: 4, reps: "10/leg" },
      { name: "Romanian Deadlift", sets: 3, reps: "10" },
      { name: "Walking Lunges", sets: 2, reps: "12/leg" },
      { name: "Seated Leg Curl", sets: 3, reps: "12" },
      { name: "Standing Calf Raise", sets: 4, reps: "15" },
      { name: "Dead Bug", sets: 3, reps: "20" },
      { name: "Side Plank", sets: 3, reps: "30 sec/side" },
      { name: "Incline Treadmill Walk", sets: 1, reps: "15 min", notes: "10–12% incline · 3.0 mph" },
    ],
  },
  {
    date: "Thu March 26 • Week 39",
    label: "Back Thickness + Abs",
    exercises: [
      { name: "Sauna", sets: 1, reps: "15 min" },
      { name: "Assisted Pullups", sets: 4, reps: "8" },
      { name: "Seated Cable Row", sets: 4, reps: "10" },
      { name: "Straight Arm Pulldown", sets: 3, reps: "12" },
      { name: "Face Pull", sets: 3, reps: "15" },
      { name: "EZ Bar Curl", sets: 3, reps: "10" },
      { name: "Hammer Curl", sets: 2, reps: "12" },
      { name: "Hanging Knee Raise", sets: 3, reps: "15" },
    ],
  },
  {
    date: "Fri March 27 • Week 39",
    label: "Shoulders + Abs",
    exercises: [
      { name: "Sauna", sets: 1, reps: "15 min" },
      { name: "Machine Lateral Raise", sets: 5, reps: "15" },
      { name: "Cable Lateral Raise", sets: 3, reps: "15" },
      { name: "Rear Delt Fly", sets: 4, reps: "15" },
      { name: "Incline Dumbbell Press", sets: 3, reps: "10" },
      { name: "Overhead Triceps Extension", sets: 3, reps: "12" },
      { name: "Cable Crunch", sets: 3, reps: "15" },
      { name: "Incline Treadmill Walk", sets: 1, reps: "15 min", notes: "10–12% incline · 3.0 mph" },
    ],
  },
  {
    date: "Sat March 28 • Week 39",
    label: "CONDITIONING + Core",
    exercises: [
      { name: "Sauna", sets: 1, reps: "15 min" },
      { name: "Incline Treadmill Walk", sets: 1, reps: "40 - 45 min", notes: "10–12% incline · 3.0 mph" },
      { name: "Farmer Carry", sets: 3, reps: "45 sec" },
      { name: "Dead Bug", sets: 3, reps: "20" },
      { name: "Plank", sets: 3, reps: "45 sec" },
    ],
  },
  {
    date: "Sun March 29 • Week 39",
    label: "RECOVERY",
    exercises: [
      { name: "Sauna", sets: 1, reps: "15 min" },
      { name: "Zone 2 Walk", reps: "45–60 min", sets: 1 },
      { name: "Mobility Flow", reps: "10–15 min", sets: 1 },
      { name: "Breathing / Decompression", reps: "5 min", sets: 1 },
    ],
  },
];

/* ================= STORAGE KEYS ================= */

const logKey = (week: number) => `w39log_w${week}`;
const recKey = (week: number, dayLabel: string) => `w39rec_w${week}_${dayLabel}`;

/* ================= localStorage HELPERS ================= */

const lsGet = (key: string): string | null => {
  try { return localStorage.getItem(key); } catch { return null; }
};

const lsSet = (key: string, value: string): void => {
  try { localStorage.setItem(key, value); } catch {}
};

const lsRemove = (key: string): void => {
  try { localStorage.removeItem(key); } catch {}
};

/* ================= PROGRESSIVE OVERLOAD LOGIC (3-WEEK ENGINE) ================= */

const getOverloadSuggestion = (
  allLogs: AllLogs,
  currentWeek: number,
  dayLabel: string,
  exName: string,
  _numSets: number
): OverloadSuggestion | null => {

  // Gather last 3 weeks of performance (offset 1 = most recent previous week)
  const weekHistory: WeekHistoryEntry[] = [];
  let mostRecentEntry: { perSet: { weight: string; reps: string }[]; topWeight: number } | null = null;

  for (let offset = 1; offset <= 3; offset++) {
    const w = currentWeek - offset;
    const entry = allLogs[w]?.[dayLabel]?.[exName];

    if (!entry?.sets || entry.sets.length === 0) {
      weekHistory.push({ hasData: false, allRepsComplete: false, hasPartialReps: false });
      continue;
    }

    const sets = entry.sets;
    const allRepsComplete = sets.every((s) => s.reps && s.reps.trim() !== "");
    const hasPartialReps = !allRepsComplete && sets.some((s) => s.reps && s.reps.trim() !== "");
    const weights = sets.map((s) => parseFloat(s.weight ?? "")).filter((w) => !isNaN(w));
    const topWeight = weights.length > 0 ? Math.max(...weights) : 0;

    weekHistory.push({ hasData: true, allRepsComplete, hasPartialReps });

    // Capture the most recent week that has weight data
    if (!mostRecentEntry && topWeight > 0) {
      mostRecentEntry = {
        topWeight,
        perSet: sets.map((s) => ({ weight: s.weight ?? "", reps: s.reps ?? "" })),
      };
    }
  }

  if (!mostRecentEntry) return null;

  const lastWeight = mostRecentEntry.topWeight;

  // Count consecutive complete weeks from most recent backwards
  let streakWeeks = 0;
  for (const wh of weekHistory) {
    if (wh.hasData && wh.allRepsComplete) streakWeeks++;
    else break;
  }

  // Count consecutive weeks failing reps from most recent backwards
  let failWeeks = 0;
  for (const wh of weekHistory) {
    if (wh.hasData && !wh.allRepsComplete) failWeeks++;
    else break;
  }

  let type: OverloadSuggestion["type"];
  let increment: number;

  if (streakWeeks >= 3) {
    // 3-week domination — double increment
    type = "increase";
    increment = INCREMENT_LBS * 2; // +5 lbs
  } else if (streakWeeks >= 1) {
    // Standard progression
    type = "increase";
    increment = INCREMENT_LBS; // +2.5 lbs
  } else if (failWeeks >= 2) {
    // Struggling for 2+ weeks — deload
    type = "deload";
    increment = -(INCREMENT_LBS * 2); // -5 lbs
  } else {
    // One bad week or mixed — hold
    type = "maintain";
    increment = 0;
  }

  return {
    type,
    lastWeight,
    suggestedWeight: Math.max(0, lastWeight + increment),
    streakWeeks,
    increment,
    perSet: mostRecentEntry.perSet,
    weekHistory,
  };
};

/* ================= HELPERS ================= */

const isExerciseComplete = (entry: ExerciseEntry | undefined, totalSets: number, name: string): boolean => {
  if (isCardioExercise(name)) return entry?.completed === true;
  if (!entry?.sets || entry.sets.length !== totalSets) return false;
  return entry.sets.every((s) => s.reps && s.reps.trim() !== "");
};

const getDayProgress = (dayLog: DayLog | undefined, exercises: Exercise[], mode: string) => {
  let done = 0;
  exercises.forEach((e) => {
    const adj = mode === "reduced" ? Math.ceil(e.sets * 0.75) : e.sets;
    if (isExerciseComplete(dayLog?.[e.name], adj, e.name)) done++;
  });
  return { done, total: exercises.length };
};

/* ================= SUB-COMPONENTS ================= */

function ReadinessGauge({ value }: { value: number | null }) {
  const r = 28, circ = 2 * Math.PI * r;
  const pct = value === null ? 0 : Math.min(100, Math.max(0, value)) / 100;
  const offset = circ * (1 - pct);
  const color = value === null ? "#2a2a2a"
    : value >= 80 ? "#22c55e" : value >= 65 ? "#84cc16"
    : value >= 50 ? "#f59e0b" : value >= 35 ? "#f97316" : "#ef4444";
  return (
    <div className="readiness-gauge">
      <svg width="72" height="72" viewBox="0 0 72 72">
        <circle className="gauge-bg" cx="36" cy="36" r={r} strokeWidth="5" />
        <circle className="gauge-fill" cx="36" cy="36" r={r} strokeWidth="5"
          stroke={color} strokeDasharray={circ} strokeDashoffset={offset} />
      </svg>
      <div className="gauge-text" style={{ color }}>{value === null ? "—" : value}</div>
    </div>
  );
}

function PainScale({ value, onChange }: { value: string | undefined; onChange: (v: string) => void }) {
  const current = value === undefined || value === "" ? null : Number(value);
  const labels = ["None", "Mild", "Moderate", "High", "Severe"];
  return (
    <div className="pain-scale">
      {[0, 1, 2, 3, 4].map((i) => (
        <button key={i} className={`pain-btn p${i} ${current === i ? "on" : ""}`}
          title={labels[i]} onClick={() => onChange(current === i ? "" : String(i))}>
          {i}
        </button>
      ))}
    </div>
  );
}

function OverloadHint({ suggestion, onApply }: { suggestion: OverloadSuggestion | null; onApply: () => void }) {
  if (!suggestion) {
    return (
      <div className="overload-hint no-data">
        <div className="hint-top">
          <div className="hint-tag no-data">No Previous Data</div>
        </div>
        <div style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--font-body)" }}>
          Log this week to unlock next week's targets
        </div>
      </div>
    );
  }

  const { type, lastWeight, suggestedWeight, streakWeeks, increment, weekHistory } = suggestion;
  const isIncrease = type === "increase";
  const isDeload = type === "deload";

  const tagText = isDeload
    ? "↓ Deload Recommended"
    : streakWeeks >= 3
    ? "↑↑ Crush It — Double Increment"
    : isIncrease
    ? "↑ Progressive Overload"
    : "↔ Maintain Weight";

  const dotColor = (wh: WeekHistoryEntry): string => {
    if (!wh.hasData) return "var(--border-bright)";
    if (wh.allRepsComplete) return "var(--green)";
    if (wh.hasPartialReps) return "var(--accent)";
    return "var(--red)";
  };

  const streakBadge =
    streakWeeks >= 3 ? <span className="hint-streak-badge streak-3">🔥 3-WK STREAK</span>
    : streakWeeks === 2 ? <span className="hint-streak-badge streak-2">✓ 2-WK STREAK</span>
    : streakWeeks === 1 ? <span className="hint-streak-badge streak-1">✓ 1-WK STREAK</span>
    : null;

  const deltaBadge = (isIncrease || isDeload) ? (
    <span className={`hint-delta ${type}`}>
      {isIncrease ? `+${increment}` : `${increment}`} lbs
    </span>
  ) : null;

  return (
    <div className={`overload-hint${isDeload ? " deload" : !isIncrease ? " maintain" : ""}`}>

      {/* Top row: tag + apply button */}
      <div className="hint-top">
        <div className={`hint-tag ${isDeload ? "deload" : isIncrease ? "increase" : "maintain"}`}>
          {tagText}
        </div>
        <button className={`hint-apply-btn${isDeload ? " deload" : !isIncrease ? " maintain" : ""}`} onClick={onApply}>
          Apply
        </button>
      </div>

      {/* Weight row */}
      <div className="hint-weights">
        <span className="hint-last">{lastWeight} lbs last wk</span>
        {type !== "maintain" && (
          <>
            <span className="hint-arrow">→</span>
            <span className={`hint-suggest ${type}`}>{suggestedWeight}</span>
            <span className="hint-unit">lbs</span>
            {deltaBadge}
          </>
        )}
        {type === "maintain" && (
          <span style={{ fontFamily: "var(--font-display)", fontSize: 12, color: "var(--text-muted)" }}>
            — hold this weight
          </span>
        )}
      </div>

      {/* 3-week history dots */}
      <div className="hint-history">
        <span className="hint-history-label">History</span>
        {weekHistory.map((wh, i) => (
          <div key={i} className="history-week">
            <div
              className="history-dot"
              title={
                wh.hasData
                  ? wh.allRepsComplete ? "All reps complete"
                  : wh.hasPartialReps ? "Partial reps"
                  : "Missed reps"
                  : "No data"
              }
              style={{ background: dotColor(wh), border: `1px solid ${dotColor(wh)}` }}
            />
            <span className="history-wk-label">W-{i + 1}</span>
          </div>
        ))}
        {streakBadge}
      </div>

    </div>
  );
}

/* ================= MAIN COMPONENT ================= */

export default function Week39Tracker() {
  const [viewWeek, setViewWeek] = useState<number>(CURRENT_WEEK);
  const [allLogs, setAllLogs] = useState<AllLogs>({});
  const [dayIndex, setDayIndex] = useState<number>(0);
  const [recovery, setRecovery] = useState<number | null>(null);
  const [storageStatus, setStorageStatus] = useState<string>("");

  // Prevents the save effect from clobbering the load when switching days/weeks
  const skipSaveRef = useRef<boolean>(false);

  const weekPlan = useMemo(() => week39Plan, []);
  const isCurrentWeek = viewWeek === CURRENT_WEEK;

  const readinessScore = useMemo<number | null>(() => {
    if (recovery === null) return null;
    if (recovery >= 80) return 5; if (recovery >= 65) return 4;
    if (recovery >= 50) return 3; if (recovery >= 35) return 2;
    return 1;
  }, [recovery]);

  const workoutMode = useMemo<string>(() => {
    if (readinessScore === null) return "unset";
    if (readinessScore >= 4) return "full";
    if (readinessScore === 3) return "reduced";
    return "recovery";
  }, [readinessScore]);

  const day = weekPlan[dayIndex];
  const currentLog: WeekLog = allLogs[viewWeek] ?? {};

  /* ── LOAD ALL WORKOUT LOGS (ONCE) ── */
  useEffect(() => {
    const newLogs: AllLogs = {};
    for (let w = 1; w <= 52; w++) {
      const raw = lsGet(logKey(w));
      if (raw) {
        try { newLogs[w] = JSON.parse(raw); } catch {}
      }
    }
    setAllLogs(newLogs);
  }, []);

  /* ── SAVE WORKOUT LOGS (PER WEEK, ON EVERY CHANGE) ── */
  useEffect(() => {
    if (allLogs[viewWeek] === undefined) return;
    lsSet(logKey(viewWeek), JSON.stringify(allLogs[viewWeek]));
    setStorageStatus("Saved ✓");
    const t = setTimeout(() => setStorageStatus(""), 1500);
    return () => clearTimeout(t);
  }, [allLogs, viewWeek]);

  /* ── LOAD READINESS (DAY/WEEK CHANGE) ── */
  useEffect(() => {
    if (!weekPlan?.[dayIndex]) return;
    skipSaveRef.current = true;
    const raw = lsGet(recKey(viewWeek, weekPlan[dayIndex].label));
    setRecovery(raw !== null ? Number(raw) : null);
  }, [viewWeek, dayIndex, weekPlan]);

  /* ── SAVE READINESS (SKIPS ONCE AFTER EACH DAY/WEEK SWITCH) ── */
  useEffect(() => {
    if (!weekPlan?.[dayIndex]) return;
    if (skipSaveRef.current) { skipSaveRef.current = false; return; }
    const k = recKey(viewWeek, weekPlan[dayIndex].label);
    if (recovery === null) {
      lsRemove(k);
    } else {
      lsSet(k, String(recovery));
    }
  }, [recovery, viewWeek, dayIndex, weekPlan]);

  /* ── UPDATE HELPERS ── */
  const updateSet = (ex: string, i: number, field: keyof SetEntry, value: string) => {
    setAllLogs((prev) => {
      const wk = prev[viewWeek] ?? {};
      const dl = wk[day.label] ?? {};
      const en = dl[ex] ?? {};
      const sets = [...(en.sets ?? [])];
      sets[i] = { ...sets[i], [field]: value };
      return { ...prev, [viewWeek]: { ...wk, [day.label]: { ...dl, [ex]: { ...en, sets } } } };
    });
  };

  const updateExercise = (ex: string, patch: Partial<ExerciseEntry>) => {
    setAllLogs((prev) => {
      const wk = prev[viewWeek] ?? {};
      const dl = wk[day.label] ?? {};
      const en = dl[ex] ?? {};
      return { ...prev, [viewWeek]: { ...wk, [day.label]: { ...dl, [ex]: { ...en, ...patch } } } };
    });
  };

  const applySuggestion = (exName: string, suggestedWeight: number, numSets: number) => {
    setAllLogs((prev) => {
      const wk = prev[viewWeek] ?? {};
      const dl = wk[day.label] ?? {};
      const en = dl[exName] ?? {};
      const existingSets = en.sets ?? [];
      const sets = [...Array(numSets)].map((_, i) => ({
        ...(existingSets[i] ?? {}),
        weight: String(suggestedWeight),
      }));
      return { ...prev, [viewWeek]: { ...wk, [day.label]: { ...dl, [exName]: { ...en, sets } } } };
    });
  };

  /* ── EXPORT ── */
  const downloadJSON = () => {
    const b = new Blob([JSON.stringify(allLogs, null, 2)], { type: "application/json" });
    const u = URL.createObjectURL(b);
    Object.assign(document.createElement("a"), { href: u, download: "training-log-all-weeks.json" }).click();
    URL.revokeObjectURL(u);
  };

  const downloadCSV = () => {
    const rows = ["Week,Day,Exercise,Set,Weight,Reps,Pain,Machine"];
    Object.entries(allLogs).forEach(([wk, wkLog]) => {
      Object.entries(wkLog).forEach(([d, exs]) => {
        Object.entries(exs).forEach(([ex, en]) => {
          (en.sets ?? []).forEach((s, i) => {
            rows.push([wk, d, ex, i + 1, s.weight ?? "", s.reps ?? "", s.pain ?? "", en.machine ?? ""].join(","));
          });
        });
      });
    });
    const b = new Blob([rows.join("\n")], { type: "text/csv" });
    const u = URL.createObjectURL(b);
    Object.assign(document.createElement("a"), { href: u, download: "training-log-all-weeks.csv" }).click();
    URL.revokeObjectURL(u);
  };

  /* ── DAY STATUS ── */
  const getDayStatus = (planDay: PlanDay): "none" | "partial" | "complete" => {
    const { done, total } = getDayProgress(currentLog[planDay.label], planDay.exercises, workoutMode);
    if (done === 0) return "none";
    if (done === total) return "complete";
    return "partial";
  };

  const { done, total } = getDayProgress(currentLog[day.label], day.exercises, workoutMode);
  const progressPct = total > 0 ? Math.round((done / total) * 100) : 0;

  return (
    <div className="tracker-root">

      {/* HEADER */}
      <div className="tracker-header">
        <div className="week-label">Mar 16 – Mar 22</div>
        <h1>TRAINING<span>.</span></h1>
        <div className="week-switcher">
          <button className="week-btn" disabled={viewWeek <= 1} onClick={() => setViewWeek((w) => w - 1)}>◀ Prev</button>
          <div className={`week-num ${isCurrentWeek ? "current" : ""}`}>
            Week {viewWeek}{isCurrentWeek ? " · Current" : " · History"}
          </div>
          <button className="week-btn" disabled={viewWeek >= CURRENT_WEEK} onClick={() => setViewWeek((w) => w + 1)}>Next ▶</button>
        </div>
      </div>

      {storageStatus && <div className="status-bar">{storageStatus}</div>}

      {/* DAY STRIP */}
      <div className="day-strip">
        {weekPlan.map((planDay, i) => {
          const status = getDayStatus(planDay);
          return (
            <div key={i} className={`day-chip ${i === dayIndex ? "active" : ""}`} onClick={() => setDayIndex(i)}>
              <div className="chip-day">{planDay.date}</div>
              <div className="chip-label">{planDay.label}</div>
              <div className={`chip-dot ${status}`} />
            </div>
          );
        })}
      </div>

      {/* SECTION HEADER */}
      <div className="section-header">
        <div className="day-title">{day.label}</div>
        <div className="day-badge">{day.date}</div>
      </div>

      {/* PROGRESS BAR */}
      <div className="progress-bar-wrap">
        <div className="progress-bar-track">
          <div className={`progress-bar-fill ${done === total && total > 0 ? "complete" : ""}`}
            style={{ width: `${progressPct}%` }} />
        </div>
        <div className="progress-label">{done} / {total} exercises complete</div>
      </div>

      {/* READINESS */}
      {isCurrentWeek && (
        <div className="readiness-card">
          <div className="card-title">Daily Readiness</div>
          <div className="readiness-inner">
            <ReadinessGauge value={recovery} />
            <div className="readiness-details">
              <input type="number" className="readiness-input"
                placeholder="Recovery % (WHOOP / Oura)"
                min={0} max={100} value={recovery ?? ""}
                onChange={(e) => setRecovery(e.target.value === "" ? null : Number(e.target.value))}
              />
              {readinessScore !== null && (
                <div className={`mode-badge ${workoutMode === "full" ? "full" : workoutMode === "reduced" ? "reduced" : "recovery-mode"}`}>
                  {workoutMode === "full" && "🔥 Full Session"}
                  {workoutMode === "reduced" && "⚡ Reduced Volume"}
                  {workoutMode === "recovery" && "🧘 Mobility Only"}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* RECOVERY DAY vs EXERCISES */}
      {workoutMode === "recovery" && isCurrentWeek ? (
        <div className="recovery-day-card">
          <div className="rec-icon">🧘</div>
          <h2>Recovery Day</h2>
          <p>Focus on mobility, stretching, and light walking. No heavy lifting today.</p>
        </div>
      ) : (
        <div className="exercises-wrap">
          {day.exercises.map((e) => {
            const entry = currentLog[day.label]?.[e.name];
            const adjSets = workoutMode === "reduced" ? Math.ceil(e.sets * 0.75) : e.sets;
            const completed = isExerciseComplete(entry, adjSets, e.name);
            const isCardio = isCardioExercise(e.name);
            const suggestion = (!isCardio && isCurrentWeek)
              ? getOverloadSuggestion(allLogs, viewWeek, day.label, e.name, adjSets)
              : null;

            return (
              <div key={e.name} className={`exercise-card ${completed ? "complete" : ""}`}>
                <div className="ex-header">
                  <div className="ex-name">{e.name}</div>
                  {completed && <div className="ex-check">✓</div>}
                </div>
                <div className="ex-meta">{adjSets} sets · {e.reps}</div>

                {isCardio ? (
                  <>
                    <label className="cardio-check-label">
                      <input type="checkbox" className="cardio-checkbox"
                        checked={entry?.completed || false}
                        onChange={(ev) => updateExercise(e.name, { completed: ev.target.checked })}
                      />
                      <span className="cardio-check-text">Mark complete</span>
                    </label>
                    {e.name === "Incline Treadmill Walk" && (
                      <input
                        className="machine-input"
                        placeholder="Equipment used (e.g. Stairmaster, Bike…)"
                        value={entry?.machine || ""}
                        onChange={(ev) => updateExercise(e.name, { machine: ev.target.value })}
                        style={{ marginTop: 8 }}
                      />
                    )}
                  </>
                ) : (
                  <>
                    {isCurrentWeek && (
                      <OverloadHint
                        suggestion={suggestion}
                        onApply={() => suggestion && applySuggestion(e.name, suggestion.suggestedWeight, adjSets)}
                      />
                    )}
                    <input className="machine-input" placeholder="Machine / equipment"
                      value={entry?.machine || ""}
                      onChange={(ev) => updateExercise(e.name, { machine: ev.target.value })}
                    />
                    <div className="col-headers">
                      <div />
                      <div className="col-hdr">WT</div>
                      <div className="col-hdr">REPS</div>
                      <div className="col-hdr" style={{ textAlign: "left", paddingLeft: 2 }}>PAIN</div>
                    </div>
                    {[...Array(adjSets)].map((_, i) => (
                      <div key={i} className="set-row">
                        <div className="set-num">S{i + 1}</div>
                        <input className="set-input" placeholder="—"
                          value={entry?.sets?.[i]?.weight || ""}
                          onChange={(ev) => updateSet(e.name, i, "weight", ev.target.value)}
                        />
                        <input className="set-input" placeholder="—"
                          value={entry?.sets?.[i]?.reps || ""}
                          onChange={(ev) => updateSet(e.name, i, "reps", ev.target.value)}
                        />
                        <PainScale
                          value={entry?.sets?.[i]?.pain}
                          onChange={(val) => updateSet(e.name, i, "pain", val)}
                        />
                      </div>
                    ))}
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* EXPORT */}
      <div className="export-section">
        <div className="export-title">Export All Logs</div>
        <div className="export-btns">
          <button className="export-btn" onClick={downloadJSON}>↓ JSON</button>
          <button className="export-btn" onClick={downloadCSV}>↓ CSV</button>
        </div>
      </div>

    </div>
  );
}
