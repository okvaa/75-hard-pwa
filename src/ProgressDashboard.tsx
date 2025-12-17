import { useState, useEffect } from "react";
import { Card, CardContent } from "./components/ui/card";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

/* =======================
   TYPES
======================= */
interface Entry {
  date: string;
  weight: number;
  bodyFat: number;
  neck: number;
  chest: number;
  waist: number;
  arms: number;
  legs: number;
  photo?: string;
}

/* =======================
   UTILITIES
======================= */

// 7-day moving average
function movingAvg<T extends Record<string, any>>(data: T[], key: keyof T) {
  return data.map((_, i) => {
    const slice = data.slice(Math.max(0, i - 6), i + 1);
    const avg =
      slice.reduce((sum, d) => sum + Number(d[key] || 0), 0) / slice.length;
    return { ...data[i], [key]: Number(avg.toFixed(2)) };
  });
}

function weeklyChange(history: Entry[], key: keyof Entry) {
  if (history.length < 2) return null;
  const last = history[history.length - 1][key];
  const prev = history[Math.max(0, history.length - 8)][key];
  return Number((last - prev).toFixed(1));
}

const leanMass = (w: number, bf: number) => w * (1 - bf / 100);
const fatMass = (w: number, bf: number) => w * (bf / 100);

/* =======================
   MAIN COMPONENT
======================= */
export default function ProgressDashboard() {
  const [form, setForm] = useState({
    weight: "",
    bodyFat: "",
    neck: "",
    chest: "",
    waist: "",
    arms: "",
    legs: "",
  });

  const [photo, setPhoto] = useState<string>();
  const [history, setHistory] = useState<Entry[]>([]);

  /* ---------- LOAD ---------- */
  useEffect(() => {
    try {
      const raw = localStorage.getItem("photoProgress");
      if (raw) setHistory(JSON.parse(raw));
    } catch {
      localStorage.removeItem("photoProgress");
    }
  }, []);

  /* ---------- SAVE ---------- */
  useEffect(() => {
    localStorage.setItem("photoProgress", JSON.stringify(history));
  }, [history]);

  /* ---------- SAVE ENTRY ---------- */
  const saveEntry = () => {
    if (!form.weight || !form.bodyFat) return;

    const entry: Entry = {
      date: new Date().toLocaleDateString(),
      weight: Number(form.weight),
      bodyFat: Number(form.bodyFat),
      neck: Number(form.neck),
      chest: Number(form.chest),
      waist: Number(form.waist),
      arms: Number(form.arms),
      legs: Number(form.legs),
      photo,
    };

    setHistory((h) => [...h, entry]);
    setForm({ weight: "", bodyFat: "", neck: "", chest: "", waist: "", arms: "", legs: "" });
    setPhoto(undefined);
  };

  /* ---------- PHOTO ---------- */
  const onPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    const reader = new FileReader();
    reader.onload = () => setPhoto(reader.result as string);
    reader.readAsDataURL(e.target.files[0]);
  };

  const latest = history.at(-1);
  const weightMA = movingAvg(history, "weight");
  const bfMA = movingAvg(history, "bodyFat");

  /* =======================
     RENDER
  ======================= */
  return (
    <div className="max-w-md mx-auto px-4 pb-12 space-y-6">

      {/* INPUT */}
      <Card>
        <CardContent className="space-y-3 p-4">
          <h2 className="text-xl font-bold">📸 Progress Log</h2>

          <div className="grid grid-cols-2 gap-2">
            {Object.keys(form).map((k) => (
              <Input
                key={k}
                type="number"
                placeholder={k.charAt(0).toUpperCase() + k.slice(1)}
                value={(form as any)[k]}
                onChange={(e) => setForm({ ...form, [k]: e.target.value })}
              />
            ))}
          </div>

          <input type="file" accept="image/*" onChange={onPhoto} />

          {photo && (
            <img src={photo} className="h-32 w-32 rounded object-cover" />
          )}

          <Button onClick={saveEntry} className="w-full">
            Save Entry
          </Button>
        </CardContent>
      </Card>

      {/* SUMMARY */}
      {latest && (
        <div className="grid grid-cols-2 gap-3">
          {[
            ["Weight", `${latest.weight} lbs`, weeklyChange(history, "weight")],
            ["Body Fat", `${latest.bodyFat}%`, weeklyChange(history, "bodyFat")],
            ["Lean Mass", `${leanMass(latest.weight, latest.bodyFat).toFixed(1)} lbs`],
            ["Fat Mass", `${fatMass(latest.weight, latest.bodyFat).toFixed(1)} lbs`],
          ].map(([title, value, delta]: any) => (
            <Card key={title}>
              <CardContent className="p-3 text-center">
                <div className="font-semibold">{title}</div>
                <div className="text-xl font-bold">{value}</div>
                {delta !== undefined && delta !== null && (
                  <div className={`text-sm ${delta < 0 ? "text-green-600" : "text-red-600"}`}>
                    {delta} this week
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* WEIGHT CHART */}
      {history.length > 1 && (
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold mb-2">📉 Weight Trend</h3>
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={weightMA}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line dataKey="weight" stroke="#4F46E5" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* BODY FAT CHART */}
      {history.length > 1 && (
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold mb-2">📊 Body Fat Trend</h3>
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={bfMA}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={[0, 40]} />
                <Tooltip />
                <Legend />
                <Line dataKey="bodyFat" stroke="#16A34A" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* HISTORY */}
      <Card>
        <CardContent className="p-4">
          <h3 className="font-semibold mb-3">📅 Full Log</h3>
          <ul className="space-y-2 text-sm">
            {history.map((h, i) => (
              <li key={i} className="border rounded p-2">
                <strong>{h.date}</strong><br />
                {h.weight} lbs — {h.bodyFat}% BF<br />
                Chest {h.chest}", Waist {h.waist}", Arms {h.arms}", Legs {h.legs}"
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
