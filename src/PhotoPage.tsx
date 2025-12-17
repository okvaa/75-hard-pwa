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

interface Entry {
  date: string;          // MM/DD/YYYY
  weight: number;        // lbs
  bodyFat: number;       // %
  neck: number;
  chest: number;
  waist: number;
  arms: number;
  legs: number;
  photo?: string;
}

// ------------------------------
// UTILITY: 7-day moving average
// ------------------------------
function movingAvg(data: any[], key: string) {
  return data.map((_, i) => {
    const start = Math.max(0, i - 6);
    const slice = data.slice(start, i + 1);
    const avg =
      slice.reduce((sum, d) => sum + (d[key] || 0), 0) / slice.length;
    return { ...data[i], [key]: avg };
  });
}

// ------------------------------
// UTILITY: Weekly change
// ------------------------------
function calcWeeklyChange(history: Entry[], key: keyof Entry) {
  if (history.length < 2) return null;
  const last = history[history.length - 1][key];
  const weekAgoIndex = Math.max(0, history.length - 8);
  const prev = history[weekAgoIndex][key];
  return (last - prev).toFixed(1);
}

// ------------------------------
// Lean Mass / Fat Mass
// ------------------------------
function calcLeanMass(weight: number, bf: number) {
  return weight * (1 - bf / 100);
}
function calcFatMass(weight: number, bf: number) {
  return weight * (bf / 100);
}

// ============================================================
// MAIN COMPONENT: PHOTO + METRIC PROGRESS DASHBOARD
// ============================================================

export default function PhotoPage() {
  const [weight, setWeight] = useState("");
  const [bodyFat, setBodyFat] = useState("");
  const [neck, setNeck] = useState("");
  const [chest, setChest] = useState("");
  const [waist, setWaist] = useState("");
  const [arms, setArms] = useState("");
  const [legs, setLegs] = useState("");
  const [photo, setPhoto] = useState<string | undefined>(undefined);

  const [history, setHistory] = useState<Entry[]>([]);

  // ------------------------------------------
  // LOAD HISTORY
  // ------------------------------------------
  useEffect(() => {
    const stored = localStorage.getItem("photoProgress");
    if (stored) {
      try {
        setHistory(JSON.parse(stored));
      } catch {
        console.warn("Corrupted photoProgress — resetting.");
        setHistory([]);
      }
    }
  }, []);

  // ------------------------------------------
  // SAVE HISTORY
  // ------------------------------------------
  useEffect(() => {
    localStorage.setItem("photoProgress", JSON.stringify(history));
  }, [history]);

  // ------------------------------------------
  // SAVE ENTRY
  // ------------------------------------------
  const handleSave = () => {
    if (!weight || !bodyFat) return;

    const newEntry: Entry = {
      date: new Date().toLocaleDateString(),
      weight: parseFloat(weight),
      bodyFat: parseFloat(bodyFat),
      neck: parseFloat(neck),
      chest: parseFloat(chest),
      waist: parseFloat(waist),
      arms: parseFloat(arms),
      legs: parseFloat(legs),
      photo,
    };

    setHistory((prev) => [...prev, newEntry]);

    setWeight("");
    setBodyFat("");
    setNeck("");
    setChest("");
    setWaist("");
    setArms("");
    setLegs("");
    setPhoto(undefined);
  };

  // ------------------------------------------
  // PHOTO UPLOAD
  // ------------------------------------------
  const handlePhotoUpload = (e: any) => {
    if (!e.target.files?.[0]) return;
    const reader = new FileReader();
    reader.onload = () => setPhoto(reader.result as string);
    reader.readAsDataURL(e.target.files[0]);
  };

  // Derived data for charts
  const weightMA = movingAvg(history, "weight");
  const bfMA = movingAvg(history, "bodyFat");

  const weightChange = calcWeeklyChange(history, "weight");
  const bfChange = calcWeeklyChange(history, "bodyFat");

  const latest = history[history.length - 1];

  return (
    <div className="space-y-6 px-4 pb-10 max-w-md mx-auto">

      {/* -----------------------------
        FORM INPUT CARD
      ------------------------------ */}
      <Card>
        <CardContent className="space-y-4 p-4">
          <h2 className="text-xl font-bold">📸 Progress Log</h2>

          <div className="grid grid-cols-2 gap-3">
            <Input
              type="number"
              placeholder="Weight (lbs)"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
            />
            <Input
              type="number"
              placeholder="Body Fat %"
              value={bodyFat}
              onChange={(e) => setBodyFat(e.target.value)}
            />

            <Input type="number" placeholder="Neck" value={neck} onChange={(e) => setNeck(e.target.value)} />
            <Input type="number" placeholder="Chest" value={chest} onChange={(e) => setChest(e.target.value)} />
            <Input type="number" placeholder="Waist" value={waist} onChange={(e) => setWaist(e.target.value)} />
            <Input type="number" placeholder="Arms" value={arms} onChange={(e) => setArms(e.target.value)} />
            <Input type="number" placeholder="Legs" value={legs} onChange={(e) => setLegs(e.target.value)} />
          </div>

          {/* Photo upload */}
          <input type="file" accept="image/*" onChange={handlePhotoUpload} />

          {photo && (
            <img src={photo} className="w-32 h-32 object-cover rounded mt-2" />
          )}

          <Button onClick={handleSave} className="w-full">
            Save Entry
          </Button>
        </CardContent>
      </Card>

      {/* ===================================================
            SUMMARY CARDS (WEIGHT, BF, LEAN MASS)
      ==================================================== */}
      {latest && (
        <div className="grid grid-cols-2 gap-3">
          <Card>
            <CardContent className="p-3 text-center">
              <h4 className="font-semibold">Weight</h4>
              <div className="text-xl font-bold">{latest.weight} lbs</div>
              {weightChange && (
                <div className={`text-sm ${Number(weightChange) < 0 ? "text-green-600" : "text-red-600"}`}>
                  {weightChange} this week
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-3 text-center">
              <h4 className="font-semibold">Body Fat</h4>
              <div className="text-xl font-bold">{latest.bodyFat}%</div>
              {bfChange && (
                <div className={`text-sm ${Number(bfChange) < 0 ? "text-green-600" : "text-red-600"}`}>
                  {bfChange}% this week
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-3 text-center">
              <h4 className="font-semibold">Lean Mass</h4>
              <div className="text-xl font-bold">
                {calcLeanMass(latest.weight, latest.bodyFat).toFixed(1)} lbs
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-3 text-center">
              <h4 className="font-semibold">Fat Mass</h4>
              <div className="text-xl font-bold">
                {calcFatMass(latest.weight, latest.bodyFat).toFixed(1)} lbs
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ===================================================
            WEIGHT CHART
      ==================================================== */}
      {history.length > 1 && (
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold mb-2">📉 Weight Trend</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={weightMA}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="weight" stroke="#4F46E5" name="Weight" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* ===================================================
            BODY FAT CHART
      ==================================================== */}
      {history.length > 1 && (
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold mb-2">📊 Body Fat Trend</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={bfMA}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={[0, 40]} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="bodyFat" stroke="#16A34A" name="Body Fat %" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* ===================================================
            HISTORY LIST
      ==================================================== */}
      <Card>
        <CardContent className="p-4">
          <h3 className="font-semibold mb-3">📅 Full Log</h3>

          <ul className="space-y-3">
            {history.map((h, i) => (
              <li key={i} className="border rounded p-2 text-sm">
                <strong>{h.date}</strong>
                <br />
                Weight: {h.weight} lbs — BF: {h.bodyFat}%
                <br />
                Chest {h.chest}", Waist {h.waist}", Arms {h.arms}", Legs {h.legs}"
                {h.photo && (
                  <div className="mt-2">
                    <img
                      src={h.photo}
                      className="h-32 w-full object-cover rounded"
                    />
                  </div>
                )}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
