import { useState, useEffect } from "react";
import { Card, CardContent } from "./components/ui/card";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";

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

  useEffect(() => {
    const stored = localStorage.getItem("photoProgress");
    if (stored) {
      setHistory(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("photoProgress", JSON.stringify(history));
  }, [history]);

  const handleSave = () => {
    if (!weight) return;
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
    setHistory([...history, newEntry]);
    setWeight("");
    setBodyFat("");
    setNeck("");
    setChest("");
    setWaist("");
    setArms("");
    setLegs("");
    setPhoto(undefined);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = () => setPhoto(reader.result as string);
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Form Card */}
      <Card>
        <CardContent className="space-y-4 p-4">
          <h3 className="text-xl font-bold">📸 Progress Log</h3>

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
          <Input
            type="number"
            placeholder="Neck (in)"
            value={neck}
            onChange={(e) => setNeck(e.target.value)}
          />
          <Input
            type="number"
            placeholder="Chest (in)"
            value={chest}
            onChange={(e) => setChest(e.target.value)}
          />
          <Input
            type="number"
            placeholder="Waist (in)"
            value={waist}
            onChange={(e) => setWaist(e.target.value)}
          />
          <Input
            type="number"
            placeholder="Arms (in)"
            value={arms}
            onChange={(e) => setArms(e.target.value)}
          />
          <Input
            type="number"
            placeholder="Legs (in)"
            value={legs}
            onChange={(e) => setLegs(e.target.value)}
          />

          <input type="file" accept="image/*" onChange={handlePhotoUpload} />

          {photo && (
            <img
              src={photo}
              alt="Uploaded progress"
              className="mt-2 w-32 h-32 object-cover rounded"
            />
          )}

          <Button onClick={handleSave} className="w-full">
            Save Entry
          </Button>
        </CardContent>
      </Card>

      {/* Chart Card */}
      {history.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold mb-2">
              📊 Progress Chart (Weight & Body Fat)
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={history}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  stroke="#82ca9d"
                  domain={[0, 50]}
                />
                <Tooltip />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="weight"
                  stroke="#8884d8"
                  name="Weight (lbs)"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="bodyFat"
                  stroke="#82ca9d"
                  name="Body Fat %"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* History Card */}
      {history.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold mb-2">📅 History</h3>
            <ul className="space-y-2 text-sm">
              {history.map((entry, i) => (
                <li key={i} className="border-b pb-1">
                  <strong>{entry.date}</strong> –{" "}
                  {entry.weight} lbs, {entry.bodyFat}% BF, Chest {entry.chest}",
                  Waist {entry.waist}", Arms {entry.arms}", Legs {entry.legs}"
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
