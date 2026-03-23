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
  if (document.getElementById("menu-styles")) return;
  const style = document.createElement("style");
  style.id = "menu-styles";
  style.textContent = `
    :root {
      --font-display: 'Barlow Condensed', sans-serif;
      --font-body: 'Barlow', sans-serif;
      --accent: #f59e0b;
      --green: #22c55e;
      --blue: #60a5fa;
      --transition: 0.25s ease;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }

    /* ── DARK ── */
    .theme-dark {
      --bg: #0d0d0d; --bg2: #141414; --bg3: #1c1c1c;
      --border: #2a2a2a; --border-bright: #3a3a3a;
      --text: #e8e8e8; --text-muted: #666; --text-dim: #999;
      --accent-dim: rgba(245,158,11,0.12);
      --green-dim: rgba(34,197,94,0.08);
      --blue-dim: rgba(96,165,250,0.08);
      --header-grad: linear-gradient(180deg, #111 0%, #0d0d0d 100%);
      --watermark: rgba(245,158,11,0.04);
    }

    /* ── LIGHT ── */
    .theme-light {
      --bg: #f5f4f0; --bg2: #ffffff; --bg3: #eeecea;
      --border: #e0ddd8; --border-bright: #c8c4bc;
      --text: #1a1a1a; --text-muted: #888; --text-dim: #555;
      --accent-dim: rgba(245,158,11,0.1);
      --green-dim: rgba(34,197,94,0.06);
      --blue-dim: rgba(96,165,250,0.06);
      --header-grad: linear-gradient(180deg, #eeece8 0%, #f5f4f0 100%);
      --watermark: rgba(245,158,11,0.06);
    }

    body { font-family: var(--font-body); -webkit-font-smoothing: antialiased; }

    .menu-root { max-width: 480px; margin: 0 auto; min-height: 100vh; background: var(--bg); padding-bottom: 60px; transition: background var(--transition); }

    /* ── HEADER ── */
    .menu-header { padding: 36px 24px 24px; border-bottom: 1px solid var(--border); background: var(--header-grad); position: relative; overflow: hidden; transition: background var(--transition), border-color var(--transition); }
    .menu-header::before { content: '75'; position: absolute; right: -10px; top: -10px; font-family: var(--font-display); font-size: 120px; font-weight: 900; color: var(--watermark); line-height: 1; pointer-events: none; user-select: none; }
    .menu-header .tagline { font-family: var(--font-display); font-size: 11px; font-weight: 600; letter-spacing: 0.25em; text-transform: uppercase; color: var(--accent); margin-bottom: 6px; }
    .menu-header h1 { font-family: var(--font-display); font-size: 42px; font-weight: 900; letter-spacing: -0.02em; line-height: 1; color: var(--text); transition: color var(--transition); }
    .menu-header h1 span { color: var(--accent); }
    .menu-header .subtitle { font-family: var(--font-body); font-size: 13px; color: var(--text-muted); margin-top: 8px; font-weight: 300; letter-spacing: 0.02em; }

    /* ── TOGGLE ── */
    .theme-toggle { position: absolute; top: 24px; right: 24px; display: flex; align-items: center; gap: 8px; }
    .toggle-label { font-family: var(--font-display); font-size: 10px; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; color: var(--text-muted); user-select: none; transition: color var(--transition); }
    .toggle-switch { position: relative; width: 44px; height: 24px; cursor: pointer; flex-shrink: 0; }
    .toggle-switch input { opacity: 0; width: 0; height: 0; position: absolute; }
    .toggle-track { position: absolute; inset: 0; background: var(--border); border: 1px solid var(--border-bright); border-radius: 12px; transition: all var(--transition); }
    .toggle-switch input:checked + .toggle-track { background: rgba(245,158,11,0.15); border-color: rgba(245,158,11,0.4); }
    .toggle-knob { position: absolute; top: 3px; left: 3px; width: 16px; height: 16px; background: var(--text-muted); border-radius: 50%; transition: all var(--transition); display: flex; align-items: center; justify-content: center; font-size: 9px; line-height: 1; }
    .toggle-switch input:checked + .toggle-track + .toggle-knob { transform: translateX(20px); background: var(--accent); }

    /* ── SECTIONS ── */
    .menu-section { padding: 20px 16px 0; }
    .section-label { font-family: var(--font-display); font-size: 10px; font-weight: 700; letter-spacing: 0.25em; text-transform: uppercase; color: var(--text-muted); margin-bottom: 10px; padding-bottom: 8px; border-bottom: 1px solid var(--border); transition: color var(--transition), border-color var(--transition); }

    /* ── MENU BUTTONS ── */
    .menu-btn { width: 100%; display: flex; align-items: center; gap: 12px; background: var(--bg2); border: 1px solid var(--border); border-radius: 10px; padding: 13px 16px; margin-bottom: 8px; cursor: pointer; transition: all 0.15s ease; text-align: left; color: var(--text); font-family: var(--font-body); }
    .menu-btn:hover { border-color: var(--border-bright); background: var(--bg3); transform: translateX(2px); }
    .menu-btn:active { transform: translateX(1px); }
    .btn-icon { font-size: 18px; flex-shrink: 0; width: 28px; text-align: center; }
    .btn-body { flex: 1; }
    .btn-label { font-family: var(--font-display); font-size: 16px; font-weight: 700; letter-spacing: 0.03em; text-transform: uppercase; color: var(--text); line-height: 1; transition: color var(--transition); }
    .btn-desc { font-size: 11px; color: var(--text-muted); margin-top: 2px; font-weight: 300; }
    .btn-arrow { font-size: 14px; color: var(--text-muted); flex-shrink: 0; transition: transform 0.15s, color 0.15s; }
    .menu-btn:hover .btn-arrow { transform: translateX(3px); color: var(--accent); }
    .menu-btn.accent { border-color: rgba(245,158,11,0.2); }
    .menu-btn.accent:hover { border-color: var(--accent); background: var(--accent-dim); }
    .menu-btn.accent:hover .btn-label { color: var(--accent); }
    .menu-btn.green { border-color: rgba(34,197,94,0.15); }
    .menu-btn.green:hover { border-color: var(--green); background: var(--green-dim); }
    .menu-btn.green:hover .btn-label { color: var(--green); }
    .menu-btn.blue { border-color: rgba(96,165,250,0.15); }
    .menu-btn.blue:hover { border-color: var(--blue); background: var(--blue-dim); }
    .menu-btn.blue:hover .btn-label { color: var(--blue); }

    /* ── WEEK GRID ── */
    .week-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-bottom: 4px; }
    .week-btn { background: var(--bg2); border: 1px solid var(--border); border-radius: 10px; padding: 12px 8px; cursor: pointer; transition: all 0.15s ease; text-align: center; color: var(--text); font-family: var(--font-body); }
    .week-btn:hover { border-color: var(--accent); background: var(--accent-dim); }
    .week-btn:active { transform: scale(0.97); }
    .week-btn .wk-num { font-family: var(--font-display); font-size: 20px; font-weight: 900; color: var(--text); line-height: 1; transition: color var(--transition); }
    .week-btn:hover .wk-num { color: var(--accent); }
    .week-btn .wk-label { font-family: var(--font-display); font-size: 9px; font-weight: 600; letter-spacing: 0.15em; text-transform: uppercase; color: var(--text-muted); margin-top: 2px; }
    .week-btn.current { border-color: rgba(245,158,11,0.35); background: var(--accent-dim); }
    .week-btn.current .wk-num { color: var(--accent); }
    .week-btn.current .wk-label { color: var(--accent); }
    .week-btn.placeholder { opacity: 0.35; cursor: default; }
    .week-btn.placeholder:hover { border-color: var(--border); background: var(--bg2); }
    .week-btn.placeholder:hover .wk-num { color: var(--text); }
    .theme-light .menu-btn { box-shadow: 0 1px 3px rgba(0,0,0,0.06); }
    .theme-light .week-btn { box-shadow: 0 1px 3px rgba(0,0,0,0.06); }
    .theme-light .menu-btn:hover { box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
  `;
  document.head.appendChild(style);
};
injectStyles();

/* ================= TYPES ================= */

interface CoreItem {
  view: string;
  icon: string;
  label: string;
  desc: string;
  variant: string;
}

interface ConditioningItem {
  view: string;
  icon: string;
  label: string;
  desc: string;
}

interface Week {
  id: string;
  num: number;
  placeholder?: boolean;
}

type Props = {
  setView: (view: string) => void;
  isDark: boolean;
  toggleTheme: () => void;
};

/* ================= DATA ================= */

const CURRENT_WEEK = 39; // Update this each week to auto-highlight current week in menu

const coreItems: CoreItem[] = [
  { view: "day",         icon: "📆", label: "Day Counter",           desc: "Track your 75 Hard streak",       variant: "accent" },
  { view: "dashboard",   icon: "📊", label: "Progress Dashboard",    desc: "Stats, trends & weekly summary",  variant: "green"  },
  { view: "photos",      icon: "📸", label: "Photos & Measurements", desc: "Body composition progress",       variant: "blue"   },
  { view: "supplements", icon: "💊", label: "Supplements Tracker",   desc: "Daily stack & timing",            variant: ""       },
  { view: "injections",  icon: "💉", label: "Injection Tracker",     desc: "Log & schedule",                  variant: ""       },
];

const conditioningItems: ConditioningItem[] = [
  { view: "norwegian", icon: "🫀", label: "Norwegian 4×4",  desc: "Zone 2 cardiac output protocol" },
  { view: "trx",       icon: "🤸", label: "TRX Workouts",   desc: "Suspension training sessions"   },
  { view: "abs",       icon: "💥", label: "ABS / Core",      desc: "Core & anti-rotation work"      },
  { view: "neck",      icon: "💪", label: "Neck & Jawline",  desc: "Neck hypertrophy protocol"      },
  { view: "neck31",    icon: "🧠", label: "Neck Finisher",   desc: "Week 31 accessory work"         },
];

const weeks: Week[] = [
  { id: "week25", num: 25 }, { id: "week26", num: 26 }, { id: "week27", num: 27 },
  { id: "week28", num: 28 }, { id: "week29", num: 29 }, { id: "week30", num: 30 },
  { id: "week31", num: 31 }, { id: "week32", num: 32 }, { id: "week33", num: 33 },
  { id: "week34", num: 34 }, { id: "week35", num: 35 }, { id: "week36", num: 36 },
  { id: "week37", num: 37 }, { id: "week38", num: 38 }, { id: "week39", num: 39 },
  { id: "week39", num: 40, placeholder: true },
];

/* ================= COMPONENT ================= */

export default function MainTaskMenu({ setView, isDark, toggleTheme }: Props) {
  return (
    <div className={`menu-root ${isDark ? "theme-dark" : "theme-light"}`}>

      {/* HEADER */}
      <div className="menu-header">
        <div className="tagline">75 Hard · Training Log</div>
        <h1>MAIN<span>.</span></h1>
        <div className="subtitle">Day counter · lifting · conditioning · progress</div>

        {/* THEME TOGGLE — dark = checked/on */}
        <div className="theme-toggle">
          <span className="toggle-label">{isDark ? "Dark" : "Light"}</span>
          <label className="toggle-switch" title="Toggle theme">
            <input
              type="checkbox"
              checked={isDark}
              onChange={toggleTheme}
            />
            <div className="toggle-track" />
            <div className="toggle-knob">{isDark ? "🌙" : "☀️"}</div>
          </label>
        </div>
      </div>

      {/* CORE TRACKING */}
      <div className="menu-section">
        <div className="section-label">Core Tracking</div>
        {coreItems.map((item) => (
          <button key={item.view} className={`menu-btn ${item.variant}`} onClick={() => setView(item.view)}>
            <span className="btn-icon">{item.icon}</span>
            <span className="btn-body">
              <span className="btn-label">{item.label}</span>
              {item.desc && <div className="btn-desc">{item.desc}</div>}
            </span>
            <span className="btn-arrow">›</span>
          </button>
        ))}
      </div>

      {/* TRAINING WEEKS */}
      <div className="menu-section">
        <div className="section-label">Training Weeks</div>
        <div className="week-grid">
          {weeks.map((w) => (
            <button
              key={w.id}
              className={`week-btn ${w.num === CURRENT_WEEK ? "current" : ""} ${w.placeholder ? "placeholder" : ""}`}
              onClick={() => !w.placeholder && setView(w.id)}
            >
              <div className="wk-num">{w.num}</div>
              <div className="wk-label">
                {w.num === CURRENT_WEEK ? "Current" : w.placeholder ? "Soon" : `Week ${w.num}`}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* CONDITIONING */}
      <div className="menu-section">
        <div className="section-label">Conditioning & Accessories</div>
        {conditioningItems.map((item) => (
          <button key={item.view} className="menu-btn" onClick={() => setView(item.view)}>
            <span className="btn-icon">{item.icon}</span>
            <span className="btn-body">
              <span className="btn-label">{item.label}</span>
              {item.desc && <div className="btn-desc">{item.desc}</div>}
            </span>
            <span className="btn-arrow">›</span>
          </button>
        ))}
      </div>

    </div>
  );
}