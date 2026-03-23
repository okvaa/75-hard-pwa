import { useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "./components/ui/card";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";

type InjectionLog = {
  date: string;
  peptide: string;
  dose: string;
  site: string;
};

const LS_KEY = "injectionLogs";

function startOfWeek(date: Date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day;
  return new Date(d.setDate(diff));
}

export default function InjectionTracker() {
  const [logs, setLogs] = useState<InjectionLog[]>([]);
  const [form, setForm] = useState<InjectionLog>({
    date: new Date().toISOString().slice(0, 10),
    peptide: "",
    dose: "",
    site: "",
  });

  /* Load */
  useEffect(() => {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) setLogs(JSON.parse(raw));
  }, []);

  /* Save */
  useEffect(() => {
    localStorage.setItem(LS_KEY, JSON.stringify(logs));
  }, [logs]);

  const addLog = () => {
    if (!form.peptide || !form.dose) return;
    setLogs((prev) => [form, ...prev]);
    setForm({
      date: new Date().toISOString().slice(0, 10),
      peptide: form.peptide, // auto keep peptide
      dose: "",
      site: "",
    });
  };

  /* Weekly totals */
  const weeklyTotals = useMemo(() => {
    const start = startOfWeek(new Date());
    const totals: Record<string, number> = {};

    logs.forEach((l) => {
      const d = new Date(l.date);
      if (d >= start) {
        const dose = parseFloat(l.dose);
        if (!isNaN(dose)) {
          totals[l.peptide] = (totals[l.peptide] || 0) + dose;
        }
      }
    });

    return totals;
  }, [logs]);

  const exportWeeklyTotals = () => {
    let text = "Weekly Injection Totals\n";
    Object.entries(weeklyTotals).forEach(([p, d]) => {
      text += `${p}: ${d} mcg\n`;
    });
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="max-w-md mx-auto p-4 space-y-4">
      {/* Header */}
      <Card className="rounded-2xl">
        <CardContent className="p-4 text-center">
          <h1 className="text-xl font-bold">💉 Injection Tracker</h1>
          <p className="text-sm text-gray-500">
            Tap peptides to auto-copy · Weekly totals below
          </p>
        </CardContent>
      </Card>

      {/* Entry */}
      <Card className="rounded-2xl">
        <CardContent className="p-4 space-y-3">
          <Input
            type="date"
            value={form.date}
            onChange={(e) =>
              setForm({ ...form, date: e.target.value })
            }
          />
          <Input
            placeholder="Peptide"
            value={form.peptide}
            onChange={(e) =>
              setForm({ ...form, peptide: e.target.value })
            }
          />
          <Input
            placeholder="Dose (mcg)"
            value={form.dose}
            onChange={(e) =>
              setForm({ ...form, dose: e.target.value })
            }
          />
          <Input
            placeholder="Injection Site"
            value={form.site}
            onChange={(e) =>
              setForm({ ...form, site: e.target.value })
            }
          />

          <Button onClick={addLog}>➕ Add Injection</Button>
        </CardContent>
      </Card>

      {/* Weekly Totals */}
      <Card className="rounded-2xl">
        <CardContent className="p-4 space-y-2">
          <div className="flex justify-between items-center">
            <h2 className="font-semibold text-sm">📊 Weekly Totals</h2>
            <Button size="sm" variant="outline" onClick={exportWeeklyTotals}>
              📋 Copy
            </Button>
          </div>

          {Object.keys(weeklyTotals).length === 0 && (
            <p className="text-sm text-gray-500">No injections this week.</p>
          )}

          {Object.entries(weeklyTotals).map(([p, d]) => (
            <div key={p} className="text-sm">
              {p}: <strong>{d} mcg</strong>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* History */}
      <Card className="rounded-2xl">
        <CardContent className="p-4 space-y-2">
          <h2 className="font-semibold text-sm">📜 History</h2>

          {logs.map((log, i) => (
            <button
              key={i}
              onClick={() =>
                setForm({
                  date: new Date().toISOString().slice(0, 10),
                  peptide: log.peptide,
                  dose: log.dose,
                  site: log.site,
                })
              }
              className="w-full text-left border rounded-xl p-2 text-sm hover:bg-gray-50"
            >
              <div className="font-semibold">
                {log.peptide} — {log.dose} mcg
              </div>
              <div className="text-gray-500">
                {log.date} · {log.site || "No site"}
              </div>
            </button>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
