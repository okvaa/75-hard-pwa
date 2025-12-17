import { Button } from "./components/ui/button";

type Props = {
  onBack: () => void;
  onSelectWeek: (week: number) => void;
};

export default function WeeksMenu({ onBack, onSelectWeek }: Props) {
  const weeks = [23, 24, 25]; // add more as you build them

  return (
    <div className="p-4 max-w-md mx-auto space-y-3">
      <Button variant="outline" onClick={onBack}>
        ← Back to Menu
      </Button>

      <h2 className="text-xl font-bold">📆 Training Weeks</h2>

      {weeks.map((week) => (
        <Button
          key={week}
          className="w-full"
          onClick={() => onSelectWeek(week)}
        >
          🏋️ Week {week}
        </Button>
      ))}
    </div>
  );
}
