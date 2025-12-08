import { useEffect, useState } from "react";
import { Card, CardContent } from "./components/ui/card";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";
import { ScrollArea } from "./components/ui/scroll-area";

export default function ProgressDashboard() {
  const [history, setHistory] = useState<any[]>([]);
  const [measurements, setMeasurements] = useState<any[]>([]);

  useEffect(() => {
    const h = JSON.parse(localStorage.getItem("liftHistory") || "[]");
    const m = JSON.parse(localStorage.getItem("measurementLog") || "[]");
    setHistory(h);
    setMeasurements(m);
  }, []);

  return (
    <ScrollArea className="p-4 max-w-md mx-auto space-y-4">
      <Card>
        <CardContent className="p-4">
          <h2 className="text-xl font-bold mb-2 text-center">Progress Dashboard</h2>
        </CardContent>
      </Card>

      {/* PR Graph */}
      <Card>
        <CardContent className="p-4">
          <h3 className="text-lg font-semibold mb-2">Strength Trend</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={history}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="weight" stroke="#3b82f6" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Measurement Trend */}
      <Card>
        <CardContent className="p-4">
          <h3 className="text-lg font-semibold mb-2">Measurements</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={measurements}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="weight" stroke="#e11d48" />
                <Line type="monotone" dataKey="bodyfat" stroke="#10b981" />
                <Line type="monotone" dataKey="waist" stroke="#f59e0b" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* History */}
      <Card>
        <CardContent className="p-4">
          <h3 className="text-lg font-semibold mb-2">Lift History</h3>
          <ul className="text-sm space-y-1">
            {history.map((h, i) => (
              <li key={i}>
                <strong>{h.exercise}</strong> – {h.weight} lbs × {h.reps} on {h.date}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </ScrollArea>
  );
}
