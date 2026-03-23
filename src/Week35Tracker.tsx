import { useEffect, useState, useMemo } from "react";

/* ── FONTS ── */
const injectFonts = () => {
  if (document.getElementById("jo60-fonts")) return;
  const l = document.createElement("link");
  l.id = "jo60-fonts"; l.rel = "stylesheet";
  l.href = "https://fonts.googleapis.com/css2?family=Exo+2:wght@300;400;600;700;900&family=Barlow:wght@300;400;500&display=swap";
  document.head.appendChild(l);
};
injectFonts();

/* ── STYLES ── */
const injectStyles = () => {
  if (document.getElementById("jo60-w35-styles")) return;
  const s = document.createElement("style");
  s.id = "jo60-w35-styles";
  s.textContent = `
    .jo60-dark {
      --bg:#080c10; --bg2:#0d1117; --bg3:#111827;
      --border:#1e2d3d; --border-hi:#1e3a5f;
      --text:#e2e8f0; --muted:#4a6075; --dim:#8aa0b4;
      --accent:#0ea5e9; --accent-dim:rgba(14,165,233,0.1); --accent-glow:rgba(14,165,233,0.3);
      --green:#22c55e; --green-dim:rgba(34,197,94,0.08);
      --blue-dim:rgba(14,165,233,0.08);
      --header-grad:linear-gradient(160deg,#0d1829 0%,#080c10 60%);
      --scan:rgba(14,165,233,0.025);
    }
    .jo60-light {
      --bg:#f0f4f8; --bg2:#ffffff; --bg3:#e2eaf2;
      --border:#cbd5e1; --border-hi:#7dd3fc;
      --text:#0f172a; --muted:#64748b; --dim:#334155;
      --accent:#0284c7; --accent-dim:rgba(2,132,199,0.08); --accent-glow:rgba(2,132,199,0.2);
      --green:#16a34a; --green-dim:rgba(22,163,74,0.07);
      --blue-dim:rgba(2,132,199,0.06);
      --header-grad:linear-gradient(160deg,#dbeafe 0%,#f0f4f8 60%);
      --scan:rgba(2,132,199,0.025);
    }
    * { box-sizing:border-box; }
    .w35-root {
      max-width:480px; margin:0 auto; min-height:100vh;
      background:var(--bg); color:var(--text);
      font-family:'Barlow',sans-serif; padding-bottom:70px;
      -webkit-font-smoothing:antialiased; position:relative;
    }
    .w35-root::before {
      content:''; position:fixed; inset:0; pointer-events:none; z-index:0;
      background:repeating-linear-gradient(0deg,var(--scan) 0px,transparent 1px,transparent 3px);
    }

    /* ── HEADER ── */
    .w35-header {
      padding:28px 20px 20px; border-bottom:1px solid var(--border);
      background:var(--header-grad); position:relative; overflow:hidden; z-index:1;
    }
    .w35-header::after {
      content:''; position:absolute; bottom:0; left:0; right:0;
      height:1px; background:linear-gradient(90deg,transparent,var(--accent),transparent);
    }
    .w35-eyebrow {
      font-family:'Exo 2',sans-serif; font-size:10px; font-weight:700;
      letter-spacing:0.3em; text-transform:uppercase; color:var(--accent);
      margin-bottom:6px; display:flex; align-items:center; gap:8px;
    }
    .w35-eyebrow::before { content:''; width:16px; height:1px; background:var(--accent); }
    .w35-title {
      font-family:'Exo 2',sans-serif; font-size:32px; font-weight:900;
      letter-spacing:-0.02em; line-height:1; color:var(--text);
    }
    .w35-title span { color:var(--accent); }
    .w35-subtitle {
      font-family:'Exo 2',sans-serif; font-size:11px; font-weight:600;
      letter-spacing:0.15em; text-transform:uppercase; color:var(--muted);
      margin-top:6px;
    }
    .w35-watermark {
      position:absolute; right:-10px; top:-14px; font-family:'Exo 2',sans-serif;
      font-size:110px; font-weight:900; color:rgba(14,165,233,0.04); line-height:1;
      pointer-events:none; user-select:none;
    }
    .jo60-light .w35-watermark { color:rgba(2,132,199,0.06); }

    /* ── WEEK SWITCHER ── */
    .w35-week-sw { display:flex; align-items:center; gap:8px; margin-top:14px; }
    .wsw-btn {
      background:var(--bg3); border:1px solid var(--border); border-radius:6px;
      color:var(--muted); font-family:'Exo 2',sans-serif; font-size:11px; font-weight:700;
      letter-spacing:0.1em; padding:5px 10px; cursor:pointer; transition:all 0.15s;
      text-transform:uppercase;
    }
    .wsw-btn:hover:not(:disabled) { border-color:var(--border-hi); color:var(--text); }
    .wsw-btn:disabled { opacity:0.3; cursor:default; }
    .wsw-label {
      flex:1; text-align:center; font-family:'Exo 2',sans-serif; font-size:13px;
      font-weight:700; letter-spacing:0.1em; color:var(--dim); text-transform:uppercase;
    }
    .wsw-label.current { color:var(--accent); }

    /* ── DAY STRIP ── */
    .w35-day-strip {
      display:flex; gap:6px; padding:14px 20px; overflow-x:auto;
      border-bottom:1px solid var(--border); scrollbar-width:none; z-index:1; position:relative;
    }
    .w35-day-strip::-webkit-scrollbar { display:none; }
    .day-chip {
      flex-shrink:0; display:flex; flex-direction:column; align-items:center; gap:4px;
      padding:8px 10px; border-radius:8px; border:1px solid var(--border);
      background:var(--bg2); cursor:pointer; transition:all 0.15s; min-width:52px;
    }
    .day-chip:hover { border-color:var(--border-hi); }
    .day-chip.active { background:var(--accent-dim); border-color:var(--accent); }
    .dc-day {
      font-family:'Exo 2',sans-serif; font-size:10px; font-weight:700;
      letter-spacing:0.1em; text-transform:uppercase; color:var(--muted);
    }
    .day-chip.active .dc-day { color:var(--accent); }
    .dc-label {
      font-family:'Exo 2',sans-serif; font-size:11px; font-weight:700;
      color:var(--dim); text-transform:uppercase;
    }
    .day-chip.active .dc-label { color:var(--text); }
    .dc-dot { width:5px; height:5px; border-radius:50%; background:var(--border-hi); }
    .dc-dot.complete { background:var(--green); }
    .dc-dot.partial { background:var(--accent); }

    /* ── SECTION HEADER ── */
    .w35-sec-hdr {
      display:flex; align-items:center; justify-content:space-between;
      padding:18px 20px 10px; position:relative; z-index:1;
    }
    .w35-day-title {
      font-family:'Exo 2',sans-serif; font-size:26px; font-weight:900;
      letter-spacing:-0.01em; text-transform:uppercase; color:var(--text);
    }
    .w35-day-badge {
      font-family:'Exo 2',sans-serif; font-size:10px; font-weight:700;
      letter-spacing:0.18em; text-transform:uppercase; color:var(--accent);
      border:1px solid var(--accent); padding:3px 8px; border-radius:4px;
    }

    /* ── PROGRESS BAR ── */
    .w35-prog-wrap { padding:0 20px 16px; position:relative; z-index:1; }
    .w35-prog-track { height:3px; background:var(--border); border-radius:2px; overflow:hidden; }
    .w35-prog-fill { height:100%; background:var(--accent); border-radius:2px; transition:width 0.4s ease; }
    .w35-prog-fill.done { background:var(--green); }
    .w35-prog-label {
      font-family:'Exo 2',sans-serif; font-size:10px; font-weight:700;
      letter-spacing:0.15em; text-transform:uppercase; color:var(--muted); margin-top:6px;
    }

    /* ── READINESS CARD ── */
    .w35-readiness {
      margin:0 16px 16px; border-radius:12px; border:1px solid var(--border);
      background:var(--bg2); padding:16px; position:relative; z-index:1;
    }
    .card-sec-label {
      font-family:'Exo 2',sans-serif; font-size:9px; font-weight:700;
      letter-spacing:0.25em; text-transform:uppercase; color:var(--muted); margin-bottom:12px;
    }
    .r-inner { display:flex; align-items:center; gap:16px; }
    .r-gauge { position:relative; width:72px; height:72px; flex-shrink:0; }
    .r-gauge svg { transform:rotate(-90deg); }
    .gauge-bg { stroke:var(--border); fill:none; }
    .gauge-fill { fill:none; stroke-linecap:round; transition:stroke-dashoffset 0.6s ease, stroke 0.3s ease; }
    .gauge-val {
      position:absolute; inset:0; display:flex; align-items:center; justify-content:center;
      font-family:'Exo 2',sans-serif; font-size:18px; font-weight:900;
    }
    .r-details { flex:1; }
    .r-input {
      width:100%; background:var(--bg3); border:1px solid var(--border); border-radius:8px;
      padding:8px 12px; font-family:'Barlow',sans-serif; font-size:14px; color:var(--text);
      outline:none; transition:border-color 0.15s;
    }
    .r-input:focus { border-color:var(--accent); }
    .r-input::placeholder { color:var(--muted); }
    .r-mode {
      margin-top:8px; font-family:'Exo 2',sans-serif; font-size:12px; font-weight:700;
      letter-spacing:0.1em; text-transform:uppercase;
    }
    .r-mode.full { color:#22c55e; }
    .r-mode.reduced { color:var(--accent); }
    .r-mode.recovery { color:#0ea5e9; }

    /* ── RECOVERY BANNER ── */
    .w35-rec-banner {
      margin:0 16px 16px; border-radius:12px;
      border:1px solid rgba(14,165,233,0.2); background:rgba(14,165,233,0.05);
      padding:28px 24px; text-align:center; position:relative; z-index:1;
    }
    .rec-icon { font-size:32px; margin-bottom:8px; }
    .rec-title {
      font-family:'Exo 2',sans-serif; font-size:22px; font-weight:900;
      text-transform:uppercase; color:var(--accent); margin-bottom:6px;
    }
    .rec-text { font-size:13px; color:var(--muted); line-height:1.5; }

    /* ── EXERCISE CARDS ── */
    .w35-exs { padding:0 16px; position:relative; z-index:1; }
    .ex-card {
      background:var(--bg2); border:1px solid var(--border);
      border-radius:12px; padding:16px; margin-bottom:10px;
      transition:border-color 0.2s, background 0.2s;
    }
    .ex-card.done { border-color:rgba(34,197,94,0.3); background:rgba(34,197,94,0.03); }
    .ex-top { display:flex; align-items:flex-start; justify-content:space-between; margin-bottom:4px; }
    .ex-name {
      font-family:'Exo 2',sans-serif; font-size:17px; font-weight:700;
      text-transform:uppercase; letter-spacing:0.02em; line-height:1.15;
      color:var(--text); flex:1;
    }
    .ex-check { color:var(--green); font-size:15px; flex-shrink:0; margin-left:8px; margin-top:2px; }
    .ex-meta {
      font-family:'Exo 2',sans-serif; font-size:11px; font-weight:600;
      letter-spacing:0.15em; text-transform:uppercase; color:var(--muted); margin-bottom:4px;
    }

    /* ── COACH CUE ── */
    .ex-cue {
      border-left:2px solid var(--accent); padding:6px 10px;
      margin-bottom:12px; background:var(--accent-dim); border-radius:0 6px 6px 0;
    }
    .ex-cue-tag {
      font-family:'Exo 2',sans-serif; font-size:8px; font-weight:700;
      letter-spacing:0.2em; text-transform:uppercase; color:var(--accent); margin-bottom:2px;
    }
    .ex-cue-text { font-size:11px; color:var(--dim); line-height:1.5; }

    /* ── OVERLOAD HINT ── */
    .overload-hint {
      display:flex; align-items:center; justify-content:space-between;
      border-radius:8px; padding:8px 10px; margin-bottom:10px; gap:8px;
      border:1px solid rgba(14,165,233,0.2); background:var(--blue-dim);
    }
    .overload-hint.maintain { border-color:rgba(245,158,11,0.2); background:rgba(245,158,11,0.06); }
    .overload-hint.no-data { border-color:var(--border); background:var(--bg3); }
    .oh-left { display:flex; flex-direction:column; gap:2px; }
    .oh-tag { font-family:'Exo 2',sans-serif; font-size:9px; font-weight:700; letter-spacing:0.18em; text-transform:uppercase; }
    .oh-tag.increase { color:var(--accent); }
    .oh-tag.maintain { color:#f59e0b; }
    .oh-tag.no-data { color:var(--muted); }
    .oh-weights { display:flex; align-items:baseline; gap:6px; flex-wrap:wrap; }
    .oh-last { font-family:'Exo 2',sans-serif; font-size:12px; color:var(--muted); }
    .oh-arrow { color:var(--muted); font-size:11px; }
    .oh-suggest { font-family:'Exo 2',sans-serif; font-size:16px; font-weight:900; }
    .oh-suggest.increase { color:var(--accent); }
    .oh-suggest.maintain { color:#f59e0b; }
    .oh-unit { font-family:'Exo 2',sans-serif; font-size:11px; color:var(--muted); }
    .oh-apply {
      background:transparent; border:1px solid rgba(14,165,233,0.3);
      border-radius:5px; color:var(--accent); font-family:'Exo 2',sans-serif;
      font-size:10px; font-weight:700; letter-spacing:0.1em; text-transform:uppercase;
      padding:4px 8px; cursor:pointer; transition:all 0.15s; white-space:nowrap; flex-shrink:0;
    }
    .oh-apply:hover { background:var(--accent-dim); border-color:var(--accent); }
    .oh-apply.maintain { border-color:rgba(245,158,11,0.3); color:#f59e0b; }
    .oh-apply.maintain:hover { background:rgba(245,158,11,0.08); }

    /* ── MACHINE INPUT ── */
    .machine-inp {
      width:100%; background:var(--bg3); border:1px solid var(--border);
      border-radius:6px; padding:7px 10px; font-family:'Barlow',sans-serif;
      font-size:12px; color:var(--dim); outline:none; margin-bottom:10px;
      transition:border-color 0.15s; letter-spacing:0.02em;
    }
    .machine-inp:focus { border-color:var(--border-hi); }
    .machine-inp::placeholder { color:var(--muted); font-size:11px; }

    /* ── SET ROW ── */
    .col-hdrs { display:grid; grid-template-columns:28px 1fr 1fr auto; gap:6px; margin-bottom:4px; }
    .col-hdr {
      font-family:'Exo 2',sans-serif; font-size:9px; font-weight:700;
      letter-spacing:0.15em; text-transform:uppercase; color:var(--muted); text-align:center;
    }
    .set-row { display:grid; grid-template-columns:28px 1fr 1fr auto; gap:6px; align-items:center; margin-bottom:6px; }
    .set-num {
      font-family:'Exo 2',sans-serif; font-size:10px; font-weight:700;
      color:var(--muted); text-align:right; letter-spacing:0.05em;
    }
    .set-inp {
      background:var(--bg3); border:1px solid var(--border); border-radius:6px;
      padding:7px 6px; font-family:'Barlow',sans-serif; font-size:13px; color:var(--text);
      outline:none; width:100%; transition:border-color 0.15s; text-align:center;
    }
    .set-inp:focus { border-color:var(--accent); }
    .set-inp::placeholder { color:var(--muted); font-size:11px; }

    /* ── PAIN SCALE ── */
    .pain-scale { display:flex; gap:3px; }
    .pain-btn {
      width:24px; height:24px; border-radius:4px; border:1px solid var(--border);
      background:var(--bg3); cursor:pointer; font-family:'Exo 2',sans-serif;
      font-size:10px; font-weight:700; color:var(--muted); transition:all 0.1s;
      display:flex; align-items:center; justify-content:center;
    }
    .pain-btn.p0.on { background:#14532d; border-color:#22c55e; color:#86efac; }
    .pain-btn.p1.on { background:#365314; border-color:#84cc16; color:#d9f99d; }
    .pain-btn.p2.on { background:#713f12; border-color:#f59e0b; color:#fde68a; }
    .pain-btn.p3.on { background:#7c2d12; border-color:#f97316; color:#fed7aa; }
    .pain-btn.p4.on { background:#7f1d1d; border-color:#ef4444; color:#fca5a5; }

    /* ── CARDIO CHECK ── */
    .cardio-label { display:flex; align-items:center; gap:10px; cursor:pointer; padding:8px 0 2px; }
    .cardio-chk {
      appearance:none; -webkit-appearance:none; width:20px; height:20px;
      border:1px solid var(--border-hi); border-radius:4px; background:var(--bg3);
      cursor:pointer; position:relative; transition:all 0.15s; flex-shrink:0;
    }
    .cardio-chk:checked { background:var(--green); border-color:var(--green); }
    .cardio-chk:checked::after {
      content:'✓'; position:absolute; inset:0; display:flex;
      align-items:center; justify-content:center; font-size:13px; color:#000; font-weight:900;
    }
    .cardio-chk-text {
      font-family:'Exo 2',sans-serif; font-size:12px; font-weight:700;
      letter-spacing:0.1em; text-transform:uppercase; color:var(--dim);
    }

    /* ── EXPORT ── */
    .w35-export { margin:24px 16px 0; padding-top:16px; border-top:1px solid var(--border); position:relative; z-index:1; }
    .exp-label {
      font-family:'Exo 2',sans-serif; font-size:9px; font-weight:700;
      letter-spacing:0.25em; text-transform:uppercase; color:var(--muted); margin-bottom:10px;
    }
    .exp-btns { display:flex; gap:8px; }
    .exp-btn {
      flex:1; background:var(--bg2); border:1px solid var(--border); border-radius:8px;
      padding:10px; font-family:'Exo 2',sans-serif; font-size:11px; font-weight:700;
      letter-spacing:0.12em; text-transform:uppercase; color:var(--muted); cursor:pointer;
      transition:all 0.15s;
    }
    .exp-btn:hover { border-color:var(--border-hi); color:var(--accent); }
  `;
  document.head.appendChild(s);
};
injectStyles();

/* ── CONSTANTS ── */
const WEEK_NUM = 35;
const INCREMENT_LBS = 2.5;

const isCardioExercise = (name: string) =>
  ["Exercise Bike","Incline Walk","Incline Walk Intervals","Zone 2 Walk",
   "Mobility Flow","Breathing / Decompression","Foam Roller + Mobility"].includes(name);

/* ── COACH CUES (science-based, JO60 voice) ── */
const COACH_CUES: Record<string, string> = {
  "Incline Walk": "Low-intensity warm-up primes blood flow and elevates core temp — reducing injury risk by up to 40% compared to cold starts.",
  "Smith Flat Press": "Smith track eliminates shoulder stabilizer demand, allowing pec-focused loading without rotator cuff stress — key for longevity over 60.",
  "Low Incline DB Press": "15–30° incline shifts emphasis to upper pec fibers while reducing anterior shoulder impingement risk vs. steep incline.",
  "Cable Fly (Deep Stretch)": "Full stretch under load maximizes pec fiber recruitment at longest muscle length — the highest-hypertrophy position.",
  "Overhead Cable Triceps Extension": "Overhead position places the long head under full stretch, the most stimulus-efficient triceps movement.",
  "Rope Pushdown (Pump)": "High-rep pump work drives metabolic stress and cell swelling — a secondary hypertrophy mechanism that complements heavy loading.",
  "Pallof Press": "Anti-rotation core training builds spinal stability under load — critical for protecting L-spine during pressing and pulling.",
  "Assisted Pull-Up": "Assistance allows full ROM without compromising form as fatigue accumulates. Lat activation is unchanged.",
  "Single-Arm Cable Row (Pause)": "Pause at peak contraction increases time under tension and eliminates momentum — 30% more mid-back activation.",
  "Rear Delt Cable Fly": "Rear delts are chronically undertrained over 60. Direct isolation restores shoulder girdle balance and prevents impingement.",
  "Incline DB Curl": "Incline stretches the long head of biceps at the bottom — the most effective arm position for biceps hypertrophy.",
  "Cable Curl (Constant Tension)": "Constant cable tension maintains load through the entire ROM — no 'dead zone' at the top like free weights.",
  "Hanging Knee Raise": "Hip flexion under load trains the rectus abdominis through its full range rather than the shortened range of floor crunches.",
  "Belt Squat or Hack Squat": "Axial loading removed from spine — allows quad-dominant leg training without lumbar compression. Ideal post-60.",
  "Seated Leg Curl": "Seated position stretches hamstrings at the hip, activating the long head more fully than lying curl variations.",
  "Seated Calf Raise": "Bent knee isolates the soleus over the gastrocnemius — the deeper calf muscle that responds best to moderate-high rep ranges.",
  "Dead Bug": "Contralateral limb movement trains spinal stabilization under load without spinal flexion — safer than crunches for disc health.",
  "Incline Smith Press": "Smith track allows aggressive overloading of upper chest without fear of losing the bar — maximize progressive overload safely.",
  "Chest-Supported Row": "Chest support eliminates lumbar involvement entirely — all force goes to the back. Zero injury risk from back rounding.",
  "Machine Lateral Raise": "Machine provides consistent resistance through full arc. Lateral delts respond best to isolation work at moderate loads.",
  "Cable Curl": "Cable angle provides constant tension at peak contraction — where free weight tension drops to near zero.",
  "Cable Fly (Mid Range Pump)": "Mid-range cable fly targets peak pec contraction. High-rep pump at session end drives maximum metabolic stress.",
  "Triceps Pushdown (High Rep)": "High-rep finisher maximizes lateral head pump and triggers mTOR-independent hypertrophy via metabolic stress.",
  "Weighted Push-Up": "Added load converts a bodyweight move into a progressive overload exercise. AMRAP tests current strength ceiling.",
  "Machine Chest Press": "Fixed path reduces shoulder stabilizer demand — allows pure pec loading at moderate rep ranges with lower injury risk.",
  "EZ Bar Curl": "EZ bar neutral grip reduces wrist and elbow stress vs. straight bar — important for joint longevity over 60.",
  "Hammer Curl (Slow)": "Neutral grip targets brachialis (under biceps) and brachioradialis. Slow tempo increases time under tension.",
  "Overhead Rope Extension": "Rope allows natural forearm rotation at the bottom, achieving full triceps long head stretch.",
  "Farmer Carry": "Loaded carry trains grip, core stability, and gait mechanics simultaneously — high functional carryover to daily life.",
  "Incline Walk Intervals": "Intervals modulate cardiac output between 70–85% HRmax — the most effective zone for improving VO2max and fat oxidation.",
  "Cable Crunch": "Cable provides constant tension through crunch ROM. Superior to sit-ups which create lumbar flexion under load.",
  "Side Plank": "Lateral core stability protects the spine during all unilateral movements. Reduces lower back injury risk significantly.",
  "Zone 2 Walk": "Zone 2 (60–70% HRmax) maximizes mitochondrial biogenesis and fat oxidation without adding CNS stress on recovery day.",
  "Mobility Flow": "Active mobility during recovery accelerates waste product clearance and maintains joint ROM without added muscle damage.",
  "Breathing / Decompression": "Diaphragmatic breathing activates the parasympathetic nervous system — lowering cortisol and accelerating recovery.",
};

/* ── WEEK PLAN ── */
const weekPlan = [
  { date: "MON", label: "PUSH", exercises: [
    { name: "Incline Walk", reps: "5 min", sets: 1 },
    { name: "Smith Flat Press", reps: "6–8", sets: 4 },
    { name: "Low Incline DB Press", reps: "8–10", sets: 3 },
    { name: "Cable Fly (Deep Stretch)", reps: "12–15", sets: 3 },
    { name: "Overhead Cable Triceps Extension", reps: "12–15", sets: 3 },
    { name: "Rope Pushdown (Pump)", reps: "15–20", sets: 2 },
    { name: "Pallof Press", reps: "12 / side", sets: 3 },
  ]},
  { date: "TUE", label: "PULL", exercises: [
    { name: "Incline Walk", reps: "5 min", sets: 1 },
    { name: "Assisted Pull-Up", reps: "6–8", sets: 4 },
    { name: "Single-Arm Cable Row (Pause)", reps: "10 / side", sets: 3 },
    { name: "Rear Delt Cable Fly", reps: "12–15", sets: 3 },
    { name: "Incline DB Curl", reps: "10–12", sets: 3 },
    { name: "Cable Curl (Constant Tension)", reps: "15–20", sets: 2 },
    { name: "Hanging Knee Raise", reps: "10–15", sets: 3 },
  ]},
  { date: "WED", label: "LEGS", exercises: [
    { name: "Incline Walk", reps: "5 min", sets: 1 },
    { name: "Belt Squat or Hack Squat", reps: "8–10", sets: 3 },
    { name: "Seated Leg Curl", reps: "12–15", sets: 3 },
    { name: "Seated Calf Raise", reps: "15–20", sets: 3 },
    { name: "Dead Bug", reps: "10 / side", sets: 3 },
  ]},
  { date: "THU", label: "UPPER", exercises: [
    { name: "Incline Walk", reps: "5 min", sets: 1 },
    { name: "Incline Smith Press", reps: "8–10", sets: 4 },
    { name: "Chest-Supported Row", reps: "10–12", sets: 4 },
    { name: "Machine Lateral Raise", reps: "12–15", sets: 3 },
    { name: "Cable Curl", reps: "12–15", sets: 3 },
    { name: "Cable Fly (Mid Range Pump)", reps: "15–20", sets: 2 },
    { name: "Triceps Pushdown (High Rep)", reps: "15–20", sets: 2 },
  ]},
  { date: "FRI", label: "FULL", exercises: [
    { name: "Incline Walk", reps: "5 min", sets: 1 },
    { name: "Weighted Push-Up", reps: "AMRAP", sets: 4 },
    { name: "Machine Chest Press", reps: "12–15", sets: 3 },
    { name: "EZ Bar Curl", reps: "8–10", sets: 3 },
    { name: "Hammer Curl (Slow)", reps: "12", sets: 2 },
    { name: "Overhead Rope Extension", reps: "15", sets: 3 },
    { name: "Farmer Carry", reps: "30–40 sec", sets: 3 },
  ]},
  { date: "SAT", label: "COND", exercises: [
    { name: "Incline Walk Intervals", reps: "30–40 min", sets: 1 },
    { name: "Cable Crunch", reps: "12–15", sets: 3 },
    { name: "Side Plank", reps: "30–45 sec", sets: 3 },
  ]},
  { date: "SUN", label: "REST", exercises: [
    { name: "Zone 2 Walk", reps: "45–60 min", sets: 1 },
    { name: "Mobility Flow", reps: "10–15 min", sets: 1 },
    { name: "Breathing / Decompression", reps: "5 min", sets: 1 },
  ]},
];

/* ── STORAGE ── */
const logKey = (w: number) => `jo60_log_w${w}`;

/* ── PROGRESSIVE OVERLOAD ── */
const getOverloadSuggestion = (prevLog: any, dayLabel: string, exName: string) => {
  const prevEntry = prevLog?.[dayLabel]?.[exName];
  if (!prevEntry?.sets?.length) return null;
  const allReps = prevEntry.sets.every((s: any) => s.reps?.trim());
  if (!allReps) return null;
  const weights = prevEntry.sets.map((s: any) => parseFloat(s.weight)).filter((w: number) => !isNaN(w));
  if (!weights.length) return null;
  const maxW = Math.max(...weights);
  const allHaveWeight = weights.length === prevEntry.sets.length;
  const perSet = prevEntry.sets.map((s: any) => ({ weight: s.weight || "", reps: s.reps || "" }));
  if (allHaveWeight) return { type: "increase", lastWeight: maxW, suggestedWeight: maxW + INCREMENT_LBS, perSet };
  return { type: "maintain", lastWeight: maxW, suggestedWeight: maxW, perSet };
};

/* ── HELPERS ── */
const isExDone = (entry: any, totalSets: number, name: string) => {
  if (isCardioExercise(name)) return entry?.completed === true;
  if (!entry?.sets || entry.sets.length !== totalSets) return false;
  return entry.sets.every((s: any) => s.reps?.trim());
};

const getDayProg = (dayLog: any, exercises: any[], mode: string) => {
  let done = 0;
  exercises.forEach((e) => {
    const adj = mode === "reduced" ? Math.ceil(e.sets * 0.75) : e.sets;
    if (isExDone(dayLog?.[e.name], adj, e.name)) done++;
  });
  return { done, total: exercises.length };
};

/* ── READINESS GAUGE ── */
function ReadinessGauge({ value }: { value: number | null }) {
  const r = 28, circ = 2 * Math.PI * r;
  const pct = value === null ? 0 : Math.min(100, Math.max(0, value)) / 100;
  const offset = circ * (1 - pct);
  const color = value === null ? "var(--border)"
    : value >= 80 ? "#22c55e" : value >= 65 ? "#84cc16"
    : value >= 50 ? "#f59e0b" : value >= 35 ? "#f97316" : "#ef4444";
  return (
    <div className="r-gauge">
      <svg width="72" height="72" viewBox="0 0 72 72">
        <circle className="gauge-bg" cx="36" cy="36" r={r} strokeWidth="5" />
        <circle className="gauge-fill" cx="36" cy="36" r={r} strokeWidth="5"
          stroke={color} strokeDasharray={circ} strokeDashoffset={offset} />
      </svg>
      <div className="gauge-val" style={{ color }}>{value === null ? "—" : value}</div>
    </div>
  );
}

/* ── PAIN SCALE ── */
const PAIN_LABELS = ["None","Mild","Mod","High","Severe"];
function PainScale({ value, onChange }: { value: string | undefined; onChange: (v: string) => void }) {
  const cur = value === undefined || value === "" ? null : Number(value);
  return (
    <div className="pain-scale">
      {[0,1,2,3,4].map((i) => (
        <button key={i} className={`pain-btn p${i} ${cur === i ? "on" : ""}`}
          title={PAIN_LABELS[i]} onClick={() => onChange(cur === i ? "" : String(i))}>
          {i}
        </button>
      ))}
    </div>
  );
}

/* ── OVERLOAD HINT ── */
function OverloadHint({ suggestion, onApply }: { suggestion: any; onApply: () => void }) {
  if (!suggestion) {
    return (
      <div className="overload-hint no-data">
        <div className="oh-left">
          <div className="oh-tag no-data">No Previous Data</div>
          <div style={{ fontSize:11, color:"var(--muted)", fontFamily:"'Barlow',sans-serif", marginTop:2 }}>
            Log this week to unlock next week's targets
          </div>
        </div>
      </div>
    );
  }
  const isInc = suggestion.type === "increase";
  return (
    <div className={`overload-hint ${isInc ? "" : "maintain"}`}>
      <div className="oh-left">
        <div className={`oh-tag ${isInc ? "increase" : "maintain"}`}>
          {isInc ? "↑ Progressive Overload" : "↔ Maintain Weight"}
        </div>
        <div className="oh-weights">
          <span className="oh-last">{suggestion.lastWeight} lbs last wk</span>
          {isInc && <>
            <span className="oh-arrow">→</span>
            <span className={`oh-suggest ${isInc ? "increase" : "maintain"}`}>{suggestion.suggestedWeight}</span>
            <span className="oh-unit">lbs</span>
          </>}
        </div>
      </div>
      <button className={`oh-apply ${isInc ? "" : "maintain"}`} onClick={onApply}>Apply</button>
    </div>
  );
}

/* ── MAIN COMPONENT ── */
export default function Week35Tracker() {
  const [viewWeek, setViewWeek] = useState(WEEK_NUM);
  const [allLogs, setAllLogs] = useState<Record<number, any>>({});
  const [dayIndex, setDayIndex] = useState(0);
  const [recovery, setRecovery] = useState<number | null>(null);
  const [isDark] = useState(() => {
    try { return localStorage.getItem("jo60-theme") !== "light"; } catch { return true; }
  });

  const readinessScore = useMemo(() => {
    if (recovery === null) return null;
    if (recovery >= 80) return 5; if (recovery >= 65) return 4;
    if (recovery >= 50) return 3; if (recovery >= 35) return 2; return 1;
  }, [recovery]);

  const workoutMode = useMemo(() => {
    if (readinessScore === null) return "unset";
    if (readinessScore >= 4) return "full";
    if (readinessScore === 3) return "reduced";
    return "recovery";
  }, [readinessScore]);

  const day = weekPlan[dayIndex];
  const currentLog = allLogs[viewWeek] ?? {};
  const prevLog = allLogs[viewWeek - 1] ?? {};
  const isCurrentWeek = viewWeek === WEEK_NUM;

  useEffect(() => {
    const loaded: Record<number, any> = {};
    for (let w = 1; w <= WEEK_NUM; w++) {
      const s = localStorage.getItem(logKey(w));
      if (s) try { loaded[w] = JSON.parse(s); } catch {}
    }
    setAllLogs(loaded);
    const r = localStorage.getItem(`jo60_rec_w${WEEK_NUM}`);
    if (r) setRecovery(Number(r));
  }, []);

  useEffect(() => {
    if (allLogs[viewWeek]) localStorage.setItem(logKey(viewWeek), JSON.stringify(allLogs[viewWeek]));
  }, [allLogs, viewWeek]);

  useEffect(() => {
    if (recovery !== null) localStorage.setItem(`jo60_rec_w${WEEK_NUM}`, String(recovery));
  }, [recovery]);

  const updateSet = (ex: string, i: number, field: string, value: string) => {
    setAllLogs((prev) => {
      const wk = prev[viewWeek] ?? {};
      const dl = wk[day.label] ?? {};
      const en = dl[ex] ?? {};
      const sets = [...(en.sets ?? [])];
      sets[i] = { ...sets[i], [field]: value };
      return { ...prev, [viewWeek]: { ...wk, [day.label]: { ...dl, [ex]: { ...en, sets } } } };
    });
  };

  const updateEx = (ex: string, patch: any) => {
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
      const existing = en.sets ?? [];
      const sets = [...Array(numSets)].map((_, i) => ({ ...(existing[i] ?? {}), weight: String(suggestedWeight) }));
      return { ...prev, [viewWeek]: { ...wk, [day.label]: { ...dl, [exName]: { ...en, sets } } } };
    });
  };

  const downloadJSON = () => {
    const b = new Blob([JSON.stringify(allLogs, null, 2)], { type: "application/json" });
    const u = URL.createObjectURL(b);
    Object.assign(document.createElement("a"), { href: u, download: `jo60-log-w${viewWeek}.json` }).click();
    URL.revokeObjectURL(u);
  };

  const downloadCSV = () => {
    const rows = ["Week,Day,Exercise,Set,Weight,Reps,Pain,Machine"];
    Object.entries(allLogs).forEach(([wk, wkLog]) => {
      Object.entries(wkLog as any).forEach(([d, exs]: any) => {
        Object.entries(exs).forEach(([ex, en]: any) => {
          (en.sets ?? []).forEach((s: any, i: number) => {
            rows.push([wk,d,ex,i+1,s.weight||"",s.reps||"",s.pain||"",en.machine||""].join(","));
          });
        });
      });
    });
    const b = new Blob([rows.join("\n")], { type: "text/csv" });
    const u = URL.createObjectURL(b);
    Object.assign(document.createElement("a"), { href: u, download: "jo60-all-logs.csv" }).click();
    URL.revokeObjectURL(u);
  };

  const getDayStatus = (planDay: any) => {
    const { done, total } = getDayProg(currentLog[planDay.label], planDay.exercises, workoutMode);
    if (done === 0) return "none";
    if (done === total) return "complete";
    return "partial";
  };

  const { done, total } = getDayProg(currentLog[day.label], day.exercises, workoutMode);
  const progPct = total > 0 ? Math.round((done / total) * 100) : 0;
  const themeClass = isDark ? "jo60-dark" : "jo60-light";

  return (
    <div className={`w35-root ${themeClass}`}>

      {/* HEADER */}
      <div className="w35-header">
        <div className="w35-watermark">35</div>
        <div className="w35-eyebrow">Jacked Over 60 · Training Log</div>
        <div className="w35-title">Week <span>35</span></div>
        <div className="w35-subtitle">Feb 23 – Feb 29 · Hypertrophy Block</div>

        {/* WEEK SWITCHER */}
        <div className="w35-week-sw">
          <button className="wsw-btn" disabled={viewWeek <= 1} onClick={() => setViewWeek(w => w - 1)}>◀ Prev</button>
          <div className={`wsw-label ${isCurrentWeek ? "current" : ""}`}>
            Week {viewWeek}{isCurrentWeek ? " · Active" : " · History"}
          </div>
          <button className="wsw-btn" disabled={viewWeek >= WEEK_NUM} onClick={() => setViewWeek(w => w + 1)}>Next ▶</button>
        </div>
      </div>

      {/* DAY STRIP */}
      <div className="w35-day-strip">
        {weekPlan.map((planDay, i) => {
          const status = getDayStatus(planDay);
          return (
            <div key={i} className={`day-chip ${i === dayIndex ? "active" : ""}`} onClick={() => setDayIndex(i)}>
              <div className="dc-day">{planDay.date}</div>
              <div className="dc-label">{planDay.label}</div>
              <div className={`dc-dot ${status === "complete" ? "complete" : status === "partial" ? "partial" : ""}`} />
            </div>
          );
        })}
      </div>

      {/* SECTION HEADER */}
      <div className="w35-sec-hdr">
        <div className="w35-day-title">{day.label}</div>
        <div className="w35-day-badge">{day.date}</div>
      </div>

      {/* PROGRESS BAR */}
      <div className="w35-prog-wrap">
        <div className="w35-prog-track">
          <div className={`w35-prog-fill ${done === total && total > 0 ? "done" : ""}`} style={{ width: `${progPct}%` }} />
        </div>
        <div className="w35-prog-label">{done} / {total} exercises complete</div>
      </div>

      {/* READINESS */}
      {isCurrentWeek && (
        <div className="w35-readiness">
          <div className="card-sec-label">◈ Daily Readiness</div>
          <div className="r-inner">
            <ReadinessGauge value={recovery} />
            <div className="r-details">
              <input type="number" className="r-input" placeholder="Recovery % (WHOOP / Oura)"
                min={0} max={100} value={recovery ?? ""}
                onChange={(e) => setRecovery(e.target.value === "" ? null : Number(e.target.value))}
              />
              {readinessScore !== null && (
                <div className={`r-mode ${workoutMode === "full" ? "full" : workoutMode === "reduced" ? "reduced" : "recovery"}`}>
                  {workoutMode === "full" && "🔥 Full Session — Optimal CNS readiness"}
                  {workoutMode === "reduced" && "⚡ Reduced Volume — Partial recovery"}
                  {workoutMode === "recovery" && "🧘 Mobility Only — CNS demands rest"}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* RECOVERY BANNER OR EXERCISES */}
      {workoutMode === "recovery" && isCurrentWeek ? (
        <div className="w35-rec-banner">
          <div className="rec-icon">🧘</div>
          <div className="rec-title">Recovery Day</div>
          <div className="rec-text">
            Your CNS readiness score indicates full rest is optimal.<br />
            Focus on Zone 2, mobility flow, and decompression breathing.
          </div>
        </div>
      ) : (
        <div className="w35-exs">
          {day.exercises.map((e) => {
            const entry = currentLog[day.label]?.[e.name];
            const adjSets = workoutMode === "reduced" ? Math.ceil(e.sets * 0.75) : e.sets;
            const completed = isExDone(entry, adjSets, e.name);
            const isCardio = isCardioExercise(e.name);
            const cue = COACH_CUES[e.name];
            const suggestion = !isCardio && isCurrentWeek
              ? getOverloadSuggestion(prevLog, day.label, e.name)
              : null;

            return (
              <div key={e.name} className={`ex-card ${completed ? "done" : ""}`}>
                <div className="ex-top">
                  <div className="ex-name">{e.name}</div>
                  {completed && <div className="ex-check">✓</div>}
                </div>
                <div className="ex-meta">{adjSets} sets · {e.reps}</div>

                {/* Coach cue */}
                {cue && (
                  <div className="ex-cue">
                    <div className="ex-cue-tag">🔬 Why This Works</div>
                    <div className="ex-cue-text">{cue}</div>
                  </div>
                )}

                {isCardio ? (
                  <label className="cardio-label">
                    <input type="checkbox" className="cardio-chk"
                      checked={entry?.completed || false}
                      onChange={(ev) => updateEx(e.name, { completed: ev.target.checked })}
                    />
                    <span className="cardio-chk-text">Mark Complete</span>
                  </label>
                ) : (
                  <>
                    {/* Overload hint */}
                    <OverloadHint
                      suggestion={suggestion}
                      onApply={() => suggestion && applySuggestion(e.name, suggestion.suggestedWeight, adjSets)}
                    />

                    <input className="machine-inp" placeholder="Machine / equipment"
                      value={entry?.machine || ""}
                      onChange={(ev) => updateEx(e.name, { machine: ev.target.value })}
                    />

                    <div className="col-hdrs">
                      <div />
                      <div className="col-hdr">WT</div>
                      <div className="col-hdr">REPS</div>
                      <div className="col-hdr" style={{ textAlign:"left", paddingLeft:2 }}>PAIN</div>
                    </div>

                    {[...Array(adjSets)].map((_, i) => (
                      <div key={i} className="set-row">
                        <div className="set-num">S{i+1}</div>
                        <input className="set-inp" placeholder="—"
                          value={entry?.sets?.[i]?.weight || ""}
                          onChange={(ev) => updateSet(e.name, i, "weight", ev.target.value)}
                        />
                        <input className="set-inp" placeholder="—"
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
      <div className="w35-export">
        <div className="exp-label">Export Training Data</div>
        <div className="exp-btns">
          <button className="exp-btn" onClick={downloadJSON}>↓ JSON</button>
          <button className="exp-btn" onClick={downloadCSV}>↓ CSV</button>
        </div>
      </div>

    </div>
  );
}
